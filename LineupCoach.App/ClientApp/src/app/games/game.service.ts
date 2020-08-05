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
  WHILE_LOOP_BREAKER_GAME = 500;
  WHILE_LOOP_BREAKER_PERIOD = 1000;
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

    let periodTries = this.WHILE_LOOP_BREAKER_GAME;
    let periodIndex = 0;

    while (periodIndex !== this.periodService.getPeriods().length && periodTries !== 0) {
      periodTries--;
      if (periodIndex === this.periodService.getPeriods().length) {
        periodTries = 0;
        continue;
      }
      const currentPeriod = cloneDeep(this.periodService.getPeriods()[periodIndex]);
      this.fulfilledGame.push(currentPeriod);
      if (!this.tryFillPeriod(currentPeriod) ||
        !this.periodService.allPeriodPositionsFull(currentPeriod)) {
        this.fulfilledGame.pop();
        continue;
      } else {
        const nextPeriod = cloneDeep(this.periodService.getPeriods()[periodIndex + 1]);
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
    // TODO figure out why you did this or if it is needed
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
    let result = false;
    const fulfilledPeriod = new Array<Position>();
    const currentPlayerIdtoPlacementScoreMap = new Map<number, number>();

    let positionTries = this.WHILE_LOOP_BREAKER_PERIOD;
    let positionIndex = 0;
    // TODO counts here (might) need to take into consideration when all players
    // TODO have been tried in all positions and we need to rethink previous period
    let playerTries = 1;
    let placeablePlayers = this.playerService.getPresentPlayers();
    while (positionIndex !== period.positions.length && positionTries !== 0) {
      positionTries--;
      if (positionIndex === period.positions.length) {
        positionTries = 0;
        continue;
      }

      const currentPosition = cloneDeep(period.positions[positionIndex]);
      fulfilledPeriod.push(currentPosition);

      const postitionFilled = this.tryFillPosition(currentPosition, period, placeablePlayers);
      if (!postitionFilled ||
        currentPosition.startingPlayer === undefined) {
        fulfilledPeriod.pop();

        if (placeablePlayers.length === 0 && positionIndex > 0) {
          positionIndex--;
          placeablePlayers = this.playerService.getPresentPlayers();
        } else {
          result = false;
          break;
        }
        continue;
      }
      if (
        this.periodService.playerIsPlacedAnotherPositionThisPeriod(currentPosition.periodId,
          currentPosition.id,
          currentPosition.startingPlayer,
          period) ||
        this.benchDistributionMet(currentPosition.startingPlayer) ||
        this.positionDistributionMet(currentPosition.startingPlayer)) {
        // TODO shouldn't need to do this. Likely added this when some other logic was wrong:
        this.removePlayerPosition(currentPosition.startingPlayer, currentPosition);
        currentPosition.startingPlayer = undefined;
        fulfilledPeriod.pop();
        playerTries++;
        // TODO the idea is to retry this position index entirely if we've tried all players.
        // TODO BUT, need to prove that we have tried all players. don't think count considers mult tries same player

        if (placeablePlayers.length === 0 && positionIndex > 0) {
          positionIndex--;
          placeablePlayers = this.playerService.getPresentPlayers();
        } else {
          result = false;
          break;
        }
        continue;
      } else {
        const nextPosition = cloneDeep(period.positions[positionIndex + 1]);
        if (!this.periodService.playerIsPlacedAnotherPositionThisPeriod(currentPosition.periodId,
          currentPosition.id,
          currentPosition.startingPlayer,
          period) &&
          (nextPosition === undefined || this.tryFillPosition(nextPosition, period, placeablePlayers))) {
          // The next player will place, so we start again, or all the positions are filled.

          if (nextPosition !== undefined) {
            nextPosition.startingPlayer = undefined;
          }
          currentPlayerIdtoPlacementScoreMap.set(currentPosition.startingPlayer.id, currentPosition.startingPlayer.fitScore);
          currentPosition.startingPlayer.placementScore +=
             isNaN(currentPosition.startingPlayer.fitScore) ? 0 : currentPosition.startingPlayer.fitScore;
          if (currentPosition.name === 'bench') {
            currentPosition.startingPlayer.benchIds.push(currentPosition.id);
          } else {
            currentPosition.startingPlayer.startingPositionIds.push(currentPosition.id);
          }
          placeablePlayers.splice(placeablePlayers.indexOf(currentPosition.startingPlayer), 1);
          playerTries = 1;
          positionIndex++;
          continue;
        } else {
          // TODO shouldn't need to do this. Likely added this when some other logic was wrong:
          this.removePlayerPosition(currentPosition.startingPlayer, currentPosition);
          currentPosition.startingPlayer = undefined;
          fulfilledPeriod.pop();
          playerTries++;

          if (placeablePlayers.length === 0 && positionIndex > 0) {
            positionIndex--;
            placeablePlayers = this.playerService.getPresentPlayers();
          } else {
            result = false;
            break;
          }
          continue;
        }
      }
    }
    result = fulfilledPeriod.length === period.positions.length;
    if (result) {
      period.positions = fulfilledPeriod;
    } else {
      // Remove added to a player this round.
      for (const positionId of period.positions.map(position => position.id)) {
        for (const player of this.playerService.getPresentPlayers()) {
          let index = player.benchIds?.indexOf(positionId);
          if (index > -1) {
            player.benchIds.splice(index, 1);
          }
          index = player.startingPositionIds?.indexOf(positionId);
          if (index > -1) {
            player.startingPositionIds.splice(index, 1);
          }
        }
      }
      this.subtractCurrentPlacementScores(currentPlayerIdtoPlacementScoreMap);
    }
    return result;
  }

  subtractCurrentPlacementScores(scoreMap) {
    for (const player of this.playerService.getPresentPlayers()) {
      const score = player.placementScore - scoreMap.get(player.id);
      player.placementScore = isNaN(score) ? player.placementScore : player.placementScore + score;
    }
    scoreMap.clear();
  }

  removePlayerPosition(tempPlayer: Player, currentPosition: Position) {
    if (currentPosition.name === 'bench') {
      // TODO pop would work if we were correctly backtracking. now we're not popping back to prev period or position.
      tempPlayer.benchIds.splice(tempPlayer.benchIds.indexOf(currentPosition.id), 1);
    } else {
      tempPlayer.startingPositionIds.splice(tempPlayer.startingPositionIds.indexOf(currentPosition.id), 1);
    }
  }

  tryFillPosition(position: Position, period: Period, players: Player[]): boolean {
    this.setPlayerFitScores(position, players);
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
        const bestFitPlayer = players.filter(player => player.id === bestFitPlayerId)[0];
        if (this.periodService.playerIsPlacedAnotherPositionThisPeriod(position.periodId,
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

  setPlayerFitScores(position: Position, players: Player[]) {
    for (const player of players) {

      // to sort by fitness for given position, you have to set the fitness score
      player.fitScore = 0;

      // increase fitness score by player's preference for the position
      const rank = player.positionPreferenceRank.ranking.indexOf(
        position.name.toLowerCase()
      );
      // player.fitScore += (this.startingPositionsPerPlayer - player.startingPositionIds.length);
      player.fitScore += player.positionPreferenceRank.ranking.length - rank;
      player.fitScore += -(this.getRelativePlacementOffset(
        (player.fitScore + (player.positionPreferenceRank.ranking.length - rank))));

      if ((typeof player.fitScore) === 'undefined' || player.fitScore < 0) {
        player.fitScore = 0;
      }
      position.candidates.set(player.id, player.fitScore);
    }
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
      .filter(player =>
        ((player.startingPositionIds.length + 1) - player.benchIds.length) >= this.getMinStartingPositionsPerPlayerCount());
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
      .filter(player =>
        ((player.startingPositionIds.length + 1) - player.benchIds.length) >= (this.getMinStartingPositionsPerPlayerCount() + 1)));

    if (maxSatisfiedPlayers.length < playerGetsExtraStartCount) {
      return maxSatisfiedPlayers.filter(player => player.id === currentPlayer.id).length > 0;
    }
  }

  benchDistributionMet(currentPlayer: Player) {
    const placedPlayers = this.flattenGamePositions(this.fulfilledGame)
      .filter(position => typeof position.startingPlayer !== 'undefined')
      .map(position => position.startingPlayer);
    if (!placedPlayers || placedPlayers.length === 0) {
      return false;
    }
    const minBenchedPlayers = this.sort_desc_unique(placedPlayers
      // +1 to account for the position we're evaluating - easier than adding it and removing it in mult places
      .filter(player => (player.benchIds.length + 1) >= this.getMinBenchesPerPlayer()));
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
      .filter(player => (player.benchIds.length + 1) >= (this.getMinBenchesPerPlayer() + 1)));

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
    return Math.floor(
      this.availablePlayerCount / (this.availablePlayerCount - this.MAX_PLAYERS_ON_FIELD)
    );
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
