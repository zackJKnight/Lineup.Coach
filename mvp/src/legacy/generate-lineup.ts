import type {
  EntityId,
  GenerateLineupInput,
  GeneratedLineup,
  LineupAssignment,
  LineupScore,
  LockedAssignment,
  Period,
  Player,
  Position,
} from './types';

type PlayerId = EntityId;
type PeriodGenes = Array<PlayerId | null>;
type Genes = PeriodGenes[];

interface PeriodDefinition {
  id: EntityId;
  positions: Position[];
}

interface EvaluationContext {
  players: Player[];
  periods: PeriodDefinition[];
  lockedByPeriod: Map<string, Map<number, PlayerId>>;
}

const SCORE_WEIGHTS = {
  preference: 10,
  benchFairness: 18,
  positionVariety: 3,
  consecutiveBench: 12,
  invalidAssignment: 1_000,
} as const;

function key(value: EntityId): string {
  return String(value);
}

function isBench(position: Position): boolean {
  return position.isBench === true || position.name.trim().toLowerCase() === 'bench';
}

function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function normalizePositions(positions: Position[], playerCount: number): Position[] {
  const result = [...positions];
  let benchNumber = 1;
  while (result.length < playerCount) {
    result.push({ id: `bench-${benchNumber}`, name: 'bench', isBench: true });
    benchNumber += 1;
  }
  return result;
}

function getPeriodDefinitions(input: GenerateLineupInput, playerCount: number): PeriodDefinition[] {
  return input.periods.map((period: Period) => ({
    id: period.id,
    positions: normalizePositions(
      period.positions.length > 0 ? period.positions : input.positions,
      playerCount,
    ),
  }));
}

function buildLocks(
  locks: LockedAssignment[],
  periods: PeriodDefinition[],
  players: Player[],
  warnings: string[],
): Map<string, Map<number, PlayerId>> {
  const result = new Map<string, Map<number, PlayerId>>();
  const playerIds = new Set(players.map((player) => key(player.id)));

  for (const lock of locks) {
    const period = periods.find((candidate) => key(candidate.id) === key(lock.periodId));
    if (!period) {
      warnings.push(`Ignored locked assignment for unknown period ${String(lock.periodId)}.`);
      continue;
    }
    if (!playerIds.has(key(lock.playerId))) {
      warnings.push(`Ignored locked assignment for unavailable player ${String(lock.playerId)}.`);
      continue;
    }
    const positionIndex = period.positions.findIndex(
      (position) => key(position.id) === key(lock.positionId),
    );
    if (positionIndex < 0) {
      warnings.push(`Ignored locked assignment for unknown position ${String(lock.positionId)}.`);
      continue;
    }
    const periodLocks = result.get(key(period.id)) ?? new Map<number, PlayerId>();
    if ([...periodLocks.values()].some((playerId) => key(playerId) === key(lock.playerId))) {
      warnings.push(
        `Ignored duplicate locked assignment for player ${String(lock.playerId)} in period ${String(lock.periodId)}.`,
      );
      continue;
    }
    periodLocks.set(positionIndex, lock.playerId);
    result.set(key(period.id), periodLocks);
  }
  return result;
}

function createPeriodGenes(
  period: PeriodDefinition,
  playerIds: PlayerId[],
  locks: Map<number, PlayerId>,
  random: () => number,
): PeriodGenes {
  const genes: PeriodGenes = Array.from({ length: period.positions.length }, () => null);
  const lockedPlayers = new Set<string>();
  for (const [positionIndex, playerId] of locks) {
    genes[positionIndex] = playerId;
    lockedPlayers.add(key(playerId));
  }
  const remainingPlayers = shuffle(
    playerIds.filter((playerId) => !lockedPlayers.has(key(playerId))),
    random,
  );
  let playerIndex = 0;
  for (let positionIndex = 0; positionIndex < genes.length; positionIndex += 1) {
    if (genes[positionIndex] === null && playerIndex < remainingPlayers.length) {
      genes[positionIndex] = remainingPlayers[playerIndex];
      playerIndex += 1;
    }
  }
  return genes;
}

function createGenes(context: EvaluationContext, random: () => number): Genes {
  const playerIds = context.players.map((player) => player.id);
  return context.periods.map((period) =>
    createPeriodGenes(
      period,
      playerIds,
      context.lockedByPeriod.get(key(period.id)) ?? new Map<number, PlayerId>(),
      random,
    ),
  );
}

function repairPeriod(
  genes: PeriodGenes,
  period: PeriodDefinition,
  playerIds: PlayerId[],
  locks: Map<number, PlayerId>,
  random: () => number,
): PeriodGenes {
  const repaired = [...genes];
  for (const [positionIndex, playerId] of locks) repaired[positionIndex] = playerId;

  const lockedPositions = new Set(locks.keys());
  const seen = new Set<string>();
  for (const playerId of locks.values()) seen.add(key(playerId));

  const duplicateOrInvalidIndexes: number[] = [];
  for (let index = 0; index < repaired.length; index += 1) {
    if (lockedPositions.has(index)) continue;
    const playerId = repaired[index];
    if (playerId === null || !playerIds.some((candidate) => key(candidate) === key(playerId)) || seen.has(key(playerId))) {
      duplicateOrInvalidIndexes.push(index);
    } else {
      seen.add(key(playerId));
    }
  }

  const missing = shuffle(
    playerIds.filter((playerId) => !seen.has(key(playerId))),
    random,
  );
  duplicateOrInvalidIndexes.forEach((positionIndex, missingIndex) => {
    repaired[positionIndex] = missing[missingIndex] ?? null;
  });
  return repaired;
}

function preferenceValue(player: Player, position: Position): number {
  if (isBench(position)) return 0;
  if (player.excludedPositionIds?.some((id) => key(id) === key(position.id))) return -20;
  const rankings = player.positionPreferenceRank?.ranking ?? [];
  const rank = rankings.findIndex(
    (value) => value.toLowerCase() === position.name.toLowerCase() || key(value) === key(position.id),
  );
  if (rank < 0) return 0;
  return Math.max(rankings.length - rank, 1);
}

function spread(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.max(...values) - Math.min(...values);
}

function evaluate(genes: Genes, context: EvaluationContext): LineupScore {
  const playerById = new Map(context.players.map((player) => [key(player.id), player]));
  const benchCounts = new Map(context.players.map((player) => [key(player.id), 0]));
  const previousBench = new Map(context.players.map((player) => [key(player.id), false]));
  const positionsByPlayer = new Map(context.players.map((player) => [key(player.id), new Set<string>()]));

  let preference = 0;
  let consecutiveBenchPenalty = 0;
  let invalidAssignmentPenalty = 0;

  context.periods.forEach((period, periodIndex) => {
    const periodGenes = genes[periodIndex] ?? [];
    const seen = new Set<string>();
    period.positions.forEach((position, positionIndex) => {
      const playerId = periodGenes[positionIndex];
      if (playerId === null) return;
      const player = playerById.get(key(playerId));
      if (!player || seen.has(key(playerId))) {
        invalidAssignmentPenalty += 1;
        return;
      }
      seen.add(key(playerId));
      if (player.excludedPositionIds?.some((id) => key(id) === key(position.id))) {
        invalidAssignmentPenalty += 1;
      }
      const bench = isBench(position);
      if (bench) {
        benchCounts.set(key(player.id), (benchCounts.get(key(player.id)) ?? 0) + 1);
        if (previousBench.get(key(player.id))) consecutiveBenchPenalty += 1;
      } else {
        preference += preferenceValue(player, position);
        positionsByPlayer.get(key(player.id))?.add(key(position.id));
      }
      previousBench.set(key(player.id), bench);
    });

    for (const player of context.players) {
      if (!seen.has(key(player.id))) previousBench.set(key(player.id), false);
    }
  });

  const benchSpread = spread([...benchCounts.values()]);
  const benchFairness = benchSpread === 0 ? 0 : -benchSpread;
  const positionVariety = [...positionsByPlayer.values()].reduce(
    (sum, uniquePositions) => sum + uniquePositions.size,
    0,
  );
  const total =
    preference * SCORE_WEIGHTS.preference +
    benchFairness * SCORE_WEIGHTS.benchFairness +
    positionVariety * SCORE_WEIGHTS.positionVariety -
    consecutiveBenchPenalty * SCORE_WEIGHTS.consecutiveBench -
    invalidAssignmentPenalty * SCORE_WEIGHTS.invalidAssignment;

  return {
    total,
    preference,
    benchFairness,
    positionVariety,
    consecutiveBenchPenalty,
    invalidAssignmentPenalty,
  };
}

class Candidate {
  score: LineupScore;

  constructor(
    public genes: Genes,
    private readonly context: EvaluationContext,
    private readonly random: () => number,
  ) {
    this.score = evaluate(genes, context);
  }

  crossover(partner: Candidate): Candidate {
    const childGenes = this.genes.map((periodGenes, periodIndex) => {
      const partnerGenes = partner.genes[periodIndex] ?? periodGenes;
      const midpoint = Math.floor(this.random() * Math.max(periodGenes.length, 1));
      const mixed = periodGenes.map((playerId, positionIndex) =>
        positionIndex > midpoint ? playerId : partnerGenes[positionIndex] ?? null,
      );
      const period = this.context.periods[periodIndex];
      return repairPeriod(
        mixed,
        period,
        this.context.players.map((player) => player.id),
        this.context.lockedByPeriod.get(key(period.id)) ?? new Map<number, PlayerId>(),
        this.random,
      );
    });
    return new Candidate(childGenes, this.context, this.random);
  }

  mutate(rate: number): void {
    this.genes = this.genes.map((periodGenes, periodIndex) => {
      const period = this.context.periods[periodIndex];
      const locks = this.context.lockedByPeriod.get(key(period.id)) ?? new Map<number, PlayerId>();
      const mutableIndexes = periodGenes
        .map((_, index) => index)
        .filter((index) => !locks.has(index));
      const next = [...periodGenes];
      if (mutableIndexes.length > 1 && this.random() < rate) {
        const first = mutableIndexes[Math.floor(this.random() * mutableIndexes.length)];
        let second = mutableIndexes[Math.floor(this.random() * mutableIndexes.length)];
        if (first === second) second = mutableIndexes[(mutableIndexes.indexOf(first) + 1) % mutableIndexes.length];
        [next[first], next[second]] = [next[second], next[first]];
      }
      return repairPeriod(
        next,
        period,
        this.context.players.map((player) => player.id),
        locks,
        this.random,
      );
    });
    this.score = evaluate(this.genes, this.context);
  }
}

function tournamentSelect(population: Candidate[], random: () => number): Candidate {
  const tournamentSize = Math.min(4, population.length);
  let best = population[Math.floor(random() * population.length)];
  for (let index = 1; index < tournamentSize; index += 1) {
    const candidate = population[Math.floor(random() * population.length)];
    if (candidate.score.total > best.score.total) best = candidate;
  }
  return best;
}

function validateInput(input: GenerateLineupInput, players: Player[]): string[] {
  const warnings: string[] = [];
  if (input.players.some((player) => player.isPresent === false)) {
    warnings.push('Absent players were excluded from generation.');
  }
  if (players.length === 0) warnings.push('No present players are available.');
  if (input.periods.length === 0) warnings.push('No periods are configured.');
  if (input.positions.length === 0 && input.periods.every((period) => period.positions.length === 0)) {
    warnings.push('No positions are configured.');
  }
  return warnings;
}

function emptyScore(): LineupScore {
  return {
    total: 0,
    preference: 0,
    benchFairness: 0,
    positionVariety: 0,
    consecutiveBenchPenalty: 0,
    invalidAssignmentPenalty: 0,
  };
}

export function generateLineup(input: GenerateLineupInput): GeneratedLineup {
  const players = input.players.filter((player) => player.isPresent !== false);
  const warnings = validateInput(input, players);
  const seed = input.seed ?? 123456789;
  const random = input.random ?? createSeededRandom(seed);

  if (players.length === 0 || input.periods.length === 0) {
    return { assignments: [], score: emptyScore(), warnings, seed, generations: 0 };
  }

  const periods = getPeriodDefinitions(input, players.length);
  if (periods.some((period) => period.positions.length < players.length)) {
    warnings.push('Some periods have fewer slots than present players; not every player can be assigned.');
  }
  const lockedByPeriod = buildLocks(input.lockedAssignments ?? [], periods, players, warnings);
  const context: EvaluationContext = { players, periods, lockedByPeriod };

  const populationSize = Math.max(2, input.populationSize ?? 160);
  const mutationRate = Math.min(Math.max(input.mutationRate ?? 0.18, 0), 1);
  const maxGenerations = Math.max(1, input.maxGenerations ?? 120);
  const stagnantLimit = Math.max(1, input.stagnantGenerationLimit ?? 24);
  const eliteCount = Math.min(Math.max(1, input.eliteCount ?? 4), populationSize - 1);

  let population = Array.from(
    { length: populationSize },
    () => new Candidate(createGenes(context, random), context, random),
  );
  let best = population.reduce((current, candidate) =>
    candidate.score.total > current.score.total ? candidate : current,
  );
  let stagnant = 0;
  let completedGenerations = 0;

  for (let generation = 0; generation < maxGenerations; generation += 1) {
    const sorted = [...population].sort((a, b) => b.score.total - a.score.total);
    const nextPopulation = sorted.slice(0, eliteCount);
    while (nextPopulation.length < populationSize) {
      const child = tournamentSelect(population, random).crossover(
        tournamentSelect(population, random),
      );
      child.mutate(mutationRate);
      nextPopulation.push(child);
    }
    population = nextPopulation;
    const generationBest = population.reduce((current, candidate) =>
      candidate.score.total > current.score.total ? candidate : current,
    );
    completedGenerations = generation + 1;
    if (generationBest.score.total > best.score.total) {
      best = generationBest;
      stagnant = 0;
    } else {
      stagnant += 1;
    }
    if (stagnant >= stagnantLimit) break;
  }

  const assignments: LineupAssignment[] = [];
  periods.forEach((period, periodIndex) => {
    period.positions.forEach((position, positionIndex) => {
      assignments.push({
        periodId: period.id,
        positionId: position.id,
        positionName: position.name,
        playerId: best.genes[periodIndex]?.[positionIndex] ?? null,
      });
    });
  });

  return {
    assignments,
    score: best.score,
    warnings,
    seed,
    generations: completedGenerations,
  };
}
