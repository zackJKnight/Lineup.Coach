import { Injectable } from '@angular/core';
import { Player } from '../players/player';
import { Position } from '../positions/position';
import { Game } from './game.model';
import { PlayerService } from '../players/player.service';
import { Period } from '../periods/period';
import { PeriodService } from '../periods/period.service';
import * as cloneDeep from 'lodash/cloneDeep';
import * as _shuffle from 'lodash/shuffle';
import { Observable, of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  startingPositionsPerPlayer: number;
  availablePlayerCount: number;
  MAX_PLAYERS_ON_FIELD = 8;
  PLACEMENT_ROUND_DIVISOR = 4;
  WHILE_LOOP_BREAKER = 150;
  fulfilledGame = new Array<Period>();

  constructor(
    private playerService: PlayerService,
    private periodService: PeriodService
  ) {
    this.availablePlayerCount = this.playerService.getPresentPlayers().length;
    this.startingPositionsPerPlayer = this.getMinStartingPositionsPerPlayerCount();
  }

  // =============================== this is the way
  // push player: is position fulfulled? No? pop player, repeat.
  // push position: is period fulfilled? No? pop position, repeat.
  // push period: is game fulfilled? No? pop period, repeat.
  /////////////////////////////////////////////////////
  optimizePlacement(): Observable<Period[]> {
    // "backtracking is not for optimization problems..."
    // hold my beer
    const subject = new Subject<Period[]>();
    const roundedPositionsPerPlayer = Math.floor(
      this.startingPositionsPerPlayer
    );

    let periodTries = this.WHILE_LOOP_BREAKER;
    let periodIndex = 0;

    while (periodIndex !== this.periodService.getPeriods().length && periodTries !== 0) {
      periodTries--;
      if (periodIndex === this.periodService.getPeriods().length) {
        periodTries = 0;
        continue;
      }
      const currentPeriod = this.periodService.getPeriods()[periodIndex];
      this.tryFillPeriod(currentPeriod);
      this.fulfilledGame.push(currentPeriod);
      if (!this.periodService.allPeriodPositionsFull(currentPeriod)) {
        this.fulfilledGame.pop();
        continue;
      } else {
        const nextPeriod = this.periodService.getPeriods()[periodIndex + 1];
        if (nextPeriod === undefined || this.tryFillPeriod(nextPeriod)) {
          periodIndex++;
          continue;
        } else {
          this.fulfilledGame.pop();
          continue;
        }
      }
    }
    const gamePositions = this.fulfilledGame
      .reduce((pos, period) => [...pos, ...period.positions], []);
    for (const setPosition of gamePositions) {
      this.periodService.setStartingPlayer(setPosition.periodId, setPosition.id, setPosition.startingPlayer);
    }

    this.periodService.savePeriods(this.fulfilledGame);

    setTimeout(() => {
      subject.next(this.periodService.getPeriods());
      subject.complete();
    }, 1);
    return subject;
  }

  tryFillPeriod(period: Period): boolean {

    const fulfilledPeriod = new Array<Position>();

    let positionTries = this.WHILE_LOOP_BREAKER;
    let positionIndex = 0;
    // TODO counts here (might) need to take into consideration when all players
    // TODO have been tried in all positions and we need to rethink previous period
    let playerTries = 1;

    while (positionIndex !== period.positions.length && positionTries !== 0) {
      positionTries--;
      if (positionIndex === period.positions.length) {
        positionTries = 0;
        continue;
      }
      const currentPosition = period.positions[positionIndex];
      fulfilledPeriod.push(currentPosition);
      const postitionFilled = this.tryFillPosition(currentPosition, period);
      if (!postitionFilled ||
        currentPosition.startingPlayer === undefined) {
        fulfilledPeriod.pop();
        playerTries++;
        if (this.playerService.getPresentPlayers().length >= playerTries && positionIndex > 0) {
          positionIndex--;
        }
        continue;
      }
      if (
        this.periodService.playerIsStartingAnotherPositionThisPeriod(currentPosition.periodId,
          currentPosition.id,
          currentPosition.startingPlayer,
          period) ||
          // TODO find out why we have dupe starting position ids at this point
          // TODO also, if starting position id hasn't been added, these next two checks don't include current position.
        this.benchDistributionMet(currentPosition.startingPlayer) ||
        this.positionDistributionMet(currentPosition.startingPlayer)) {
        currentPosition.startingPlayer = undefined;
        fulfilledPeriod.pop();
        playerTries++;
        if (this.playerService.getPresentPlayers().length >= playerTries && positionIndex > 0) {
          positionIndex--;
        }
        continue;
      } else {
        const nextPosition = period.positions[positionIndex + 1];

        if (nextPosition === undefined || this.tryFillPosition(nextPosition, period)) {
          positionIndex++;
          playerTries = 1;
          if (nextPosition !== undefined) {
            nextPosition.startingPlayer = undefined;
          }
          currentPosition.startingPlayer.placementScore += currentPosition.startingPlayer.fitScore;
          currentPosition.startingPlayer.startingPositionIds.push(currentPosition.id);
          continue;
        } else {
          currentPosition.startingPlayer = undefined;
          fulfilledPeriod.pop();
          playerTries++;
          if (this.playerService.getPresentPlayers().length === playerTries && positionIndex > 0) {
            positionIndex--;
          }
          continue;
        }
      }
    }

    return this.periodService.allPeriodPositionsFull(period);
  }

  tryFillPosition(position: Position, period: Period): boolean {

    for (const player of this.playerService.getPresentPlayers()) {

      // to sort by fitness for given position, you have to set the fitness score
      player.fitScore = 0;

      // increase fitness score by player's preference for the position
      const rank = player.positionPreferenceRank.ranking.indexOf(
        position.name.toLowerCase()
      );
      player.fitScore += (this.startingPositionsPerPlayer - player.startingPositionIds.length);
      player.fitScore += player.positionPreferenceRank.ranking.length - rank;
      player.fitScore += -(this.getRelativePlacementOffset(
        (player.fitScore + (player.positionPreferenceRank.ranking.length - rank))));

      position.candidates.set(player.id, player.fitScore);
    }

    const scores = this.sort_desc_unique([...position.candidates?.values()]);
    let scoreCount = 1;
    for (const bestFitScore of scores) {
      scoreCount++;
      const bestFitPlayerIds = [...position.candidates.entries()]
        .filter(({ 1: v }) => v === bestFitScore)
        .map(([k]) => k);
      let i = bestFitPlayerIds.length;
      while (i--) {
        const bestFitPlayerId = bestFitPlayerIds[Math.floor(Math.random() * bestFitPlayerIds.length)] || null;
        bestFitPlayerIds.splice(bestFitPlayerIds.indexOf(bestFitPlayerId), 1);
        const bestFitPlayer = this.playerService.getPlayerById(bestFitPlayerId);
        if (this.periodService.playerIsStartingAnotherPositionThisPeriod(position.periodId,
          position.id,
          bestFitPlayer,
          period)) {
          continue;
        }
        position.startingPlayer = bestFitPlayer;
        return true;
      }
    }
    return false;
  }

  positionDistributionMet(currentPlayer: Player) {
    // determine number of players that haven't met number of min starting positions
    // if they all have, determine players that have met max starting positions
    // if there is room left and the player could be one that gets the extra position
    const placedPlayers = this.flattenGamePositions(this.fulfilledGame)
      .filter(position => typeof position.startingPlayer !== 'undefined')
      .map(position => position.startingPlayer);
    if (!placedPlayers || placedPlayers.length === 0) {
      return false;
    }
    const minSatisfiedPlayers = placedPlayers
      .filter(player => player.startingPositionIds.length >= this.getMinStartingPositionsPerPlayerCount());
    if (!minSatisfiedPlayers || minSatisfiedPlayers.length === 0) {
      return false;
    }
    const playerNotBeenMinSatisfiedCount = this.availablePlayerCount - minSatisfiedPlayers.length;
    if (!playerNotBeenMinSatisfiedCount || playerNotBeenMinSatisfiedCount === 0) {
      return false;
    }

    const nonBenchPositions = this.flattenGamePositions().filter(position => position.name !== 'bench');
    const playerGetsExtraStartCount = (nonBenchPositions.length -
      (Math.floor(nonBenchPositions.length / this.availablePlayerCount) * this.availablePlayerCount));

    const maxSatisfiedPlayers = this.sort_desc_unique(placedPlayers
      .filter(player => player.startingPositionIds.length >= (this.getMinStartingPositionsPerPlayerCount() + 1)));

    if (maxSatisfiedPlayers.length < playerGetsExtraStartCount) {
      return maxSatisfiedPlayers.filter(player => player.id === currentPlayer.id).length > 0;
    }
  }

  benchDistributionMet(currentPlayer: Player) {
// TODO counting startingPositionIds doesn't work. Need bench count and start count for this and counterpart function.
    const placedPlayers = this.flattenGamePositions(this.fulfilledGame)
      .filter(position => typeof position.startingPlayer !== 'undefined')
      .map(position => position.startingPlayer);
    if (!placedPlayers || placedPlayers.length === 0) {
      return false;
    }
    const minBenchedPlayers = this.sort_desc_unique(placedPlayers
      .filter(player => player.startingPositionIds.length >= this.getMinBenchesPerPlayer()));
    if (!minBenchedPlayers || minBenchedPlayers.length === 0) {
      return false;
    }
    const playerNotBeenMinBenchedCount = this.availablePlayerCount - minBenchedPlayers.length;
    if (!playerNotBeenMinBenchedCount || playerNotBeenMinBenchedCount === 0) {
      return false;
    }

    const benchPositions = this.flattenGamePositions().filter(position => position.name === 'bench');
    const playerGetsExtraBenchCount = (benchPositions.length -
      (Math.floor(benchPositions.length / this.availablePlayerCount) * this.availablePlayerCount));

    const maxBenchedPlayers = this.sort_desc_unique(placedPlayers
      .filter(player => player.startingPositionIds.length >= (this.getMinBenchesPerPlayer() + 1)));

    if (maxBenchedPlayers.length < playerGetsExtraBenchCount) {
      return maxBenchedPlayers.filter(player => player.id === currentPlayer.id).length > 0;
    }
  }

  getRelativePlacementOffset(newScore: number) {
    const periodCount = this.periodService.getPeriods().length;
    const placedPlayers = this.playerService.getPresentPlayers();
    const highestScore = Math.max.apply(
      Math,
      placedPlayers.map(player => player.placementScore)
    );
    const lowestScore = Math.min.apply(
      Math,
      placedPlayers.map(player => player.placementScore)
    );
    if (lowestScore <= 0) {
      return 0;
    }
    const meanScore = Math.floor((highestScore + lowestScore) / 2);
    const maxNumberOfPreferredPositions = Math.max.apply(
      Math,
      placedPlayers.map(player => player.positionPreferenceRank.ranking.length)
    );
    const totalGamePositionsCount = periodCount * (maxNumberOfPreferredPositions - 1);
    const maxRangeScore = highestScore - meanScore / 2;
    // Prevent player from getting a position that gives him far better placement than most.
    return maxRangeScore - newScore;
  }

  placementScoreIsWithinRange(newScore: number): boolean {
    const periodCount = this.periodService.getPeriods().length;
    const placedPlayers = this.playerService.getPresentPlayers();
    const highestScore = Math.max.apply(
      Math,
      placedPlayers.map(player => player.placementScore)
    );
    const lowestScore = Math.min.apply(
      Math,
      placedPlayers.map(player => player.placementScore)
    );
    const meanScore = Math.floor((highestScore + lowestScore) / 2);
    const maxNumberOfPreferredPositions = Math.max.apply(
      Math,
      placedPlayers.map(player => player.positionPreferenceRank.ranking.length)
    );
    const totalGamePositionsCount = periodCount * (maxNumberOfPreferredPositions - 1);
    const maxRangeScore = highestScore - meanScore / 2;
    // Prevent player from getting a position that gives him far better placement than most.
    return (
      newScore < totalGamePositionsCount ||
      (newScore > meanScore && newScore < maxRangeScore)
    );
  }

  getOpenPositionsByName(positionName: string): Position[] {
    let openMatches: Position[];
    try {
      const flattenedGamePositions = this.flattenGamePositions();

      const nonBenchPositions = flattenedGamePositions.filter(
        position => position.positionType !== 'bench'
      );

      openMatches = nonBenchPositions.filter(
        position =>
          position.name.toLowerCase() === positionName &&
          typeof position.startingPlayer === 'undefined'
      );
    } catch (e) {
      throw new Error(e);
    }

    return openMatches;
  }

  flattenGamePositions(unsetPeriods?: Period[]): Position[] {
    const periods = (typeof unsetPeriods === 'undefined' || unsetPeriods.length === 0) ? this.periodService
      .getPeriods() : unsetPeriods;
    return periods
      .sort(period => period.periodNumber)
      .reduce((pos, period) => [...pos, ...period.positions], []);
  }

  getRandomPlayerIndex(playerIdsInRound: number[]): number {
    return Math.round(Math.random() * playerIdsInRound.length - 1);
  }

  getOpenBenches(): Position[] {
    let openBenches: Position[];
    try {
      const flattenedGamePositions = this.flattenGamePositions();

      const benchPositions = flattenedGamePositions.filter(
        position => position.positionType === 'bench'
      );

      openBenches = benchPositions.filter(
        position => typeof position.startingPlayer === 'undefined'
      );
    } catch (e) {
      throw new Error(e);
    }
    return openBenches;
  }

  allGamePositionsFilled(): boolean {
    // flatten the positions in all periods
    const allPositions = this.flattenGamePositions();
    const allFilled = !allPositions.some(
      position => typeof position.startingPlayer === 'undefined'
    );
    return allFilled;
  }

  allStartingPositionsFilled(): boolean {
    // flatten the positions in all periods
    const allPositions = this.flattenGamePositions().filter(
      position => position.name !== 'bench'
    );
    const allFilled = !allPositions.some(
      position => typeof position.startingPlayer === 'undefined'
    );
    return allFilled;
  }

  getMinStartingPositionsPerPlayerCount(): number {
    return Math.floor(
      (this.MAX_PLAYERS_ON_FIELD * this.periodService.getPeriods().length) /
      this.availablePlayerCount
    );
  }

  getMinBenchesPerPlayer(): number {
    return Math.floor(Math.round(
      this.availablePlayerCount / (this.availablePlayerCount - this.MAX_PLAYERS_ON_FIELD)
    ));
  }

  sort_desc_unique(arr) {
    if (arr.length === 0) {
      return arr;
    }
    arr = arr.sort((a, b) => b * 1 - a * 1);
    const uniques = [arr[0]];
    // Start loop at 1: arr[0] can never be a duplicate
    for (let i = 1; i < arr.length; i++) {
      if (arr[i - 1] !== arr[i]) {
        uniques.push(arr[i]);
      }
    }
    return uniques;
  }
}
