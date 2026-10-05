export type EntityId = string | number;

export interface Player {
  id: EntityId;
  firstName: string;
  lastName: string;
  isPresent?: boolean;
  positionPreferenceRank: { ranking: string[] };
  excludedPositionIds?: EntityId[];
  startingPositionIds?: EntityId[];
  placementScore?: number;
  fitScore?: number;
  benchIds?: EntityId[];
}

export interface Position {
  id: EntityId;
  name: string;
  isBench?: boolean;
}

export interface Period {
  id: EntityId;
  positions: Position[];
}

export interface LineupAssignment {
  periodId: EntityId;
  positionId: EntityId;
  positionName: string;
  playerId: EntityId | null;
}

export interface LockedAssignment {
  periodId: EntityId;
  positionId: EntityId;
  playerId: EntityId;
}

export interface LineupScore {
  total: number;
  preference: number;
  benchFairness: number;
  positionVariety: number;
  consecutiveBenchPenalty: number;
  invalidAssignmentPenalty: number;
}

export interface GenerateLineupInput {
  players: Player[];
  positions: Position[];
  periods: Period[];
  lockedAssignments?: LockedAssignment[];
  populationSize?: number;
  mutationRate?: number;
  maxGenerations?: number;
  stagnantGenerationLimit?: number;
  eliteCount?: number;
  seed?: number;
  random?: () => number;
}

export interface GeneratedLineup {
  assignments: LineupAssignment[];
  score: LineupScore;
  warnings: string[];
  seed: number;
  generations: number;
}
