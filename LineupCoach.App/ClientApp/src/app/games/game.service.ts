import { Injectable } from '@angular/core';
import { Player } from '../players/player';
import { Position } from '../positions/position';
import { Game } from './game.model';
import { PlayerService } from '../players/player.service';
import { Period } from '../periods/period';
import { PeriodService } from '../periods/period.service';
import * as cloneDeep from 'lodash/cloneDeep';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class GameService {
  theGame: Game;
  startingPositionsPerPlayer: number;
  availablePlayerCount: number;
  MAX_PLAYERS_ON_FIELD = 8;

  public periods: Array<Period>;

  constructor(
    private playerService: PlayerService,
    private periodService: PeriodService
    ) {
      this.periods = this.periodService.getPeriods();
      this.availablePlayerCount = this.playerService.getPresentPlayers().length;
      this.startingPositionsPerPlayer = this.setStartingPositionsPerPlayerCount();
      // ToDo this is still organized as copied from the C# console app. need to improve this
      this.theGame = new Game();
      this.theGame.Periods = this.periods;
    }

  generateLineup(players: Player[]): Observable<Period[]> {
    let round = 0;
    let playerIdsInRound = cloneDeep(players
      .filter(player => player.isPresent)
      .map(player => player.id));

    // ToDo if the players don't have ranking, need default or throw here.
    const preferenceRankMax: number = Math.max.apply(Math, players.map(player =>
      player.positionPreferenceRank.ranking.length));
    const initialPlayerCount = playerIdsInRound.length;

    // Rounds - within the rounds the players (in random order) are placed based on preference.
    while (!this.allGamePositionsFilled() && round < Math.floor(this.startingPositionsPerPlayer + 1)) {
      for (let i = 0; i < initialPlayerCount; i++) {
        if (playerIdsInRound.length > 0) {
          let playerPlaced = false;
          const player = players[this.getRandomPlayerIndex(playerIdsInRound)];
          for (let currentPrefRankIndex = 0; currentPrefRankIndex < preferenceRankMax; currentPrefRankIndex++) {
            if (!playerPlaced && typeof(player) !== 'undefined') {
              const positionName: string = this.playerService.getPositionNameByPreferenceRank(player, currentPrefRankIndex);
              if (typeof positionName !== 'undefined' && positionName) {
                const OpenMatchingPositions: Position[] = this.getOpenPositionsByName(positionName);
                if (typeof(OpenMatchingPositions) === 'undefined' || OpenMatchingPositions.length === 0) {
                  // We've tried to put this player in each position.
                  if (currentPrefRankIndex + 1 === preferenceRankMax) {
                    const benchPlayers: Player[] = [player];
                    playerPlaced = this.tryBenchPlayers(benchPlayers);
                    const index = playerIdsInRound.indexOf(player.id, 0);
                    if (index > -1) {
                      delete playerIdsInRound[index];
                    } else {
                      console.log(`Player ${player.firstName} not removed from round after attempted bench.`);
                      break;
                    }
                  } else {
                    console.log(`No match for ${positionName} but we can try the next ranked position for ${player.firstName}`);
                  }
                } else {
                  playerPlaced = this.tryPlacePlayer(player, OpenMatchingPositions);
                  const index = playerIdsInRound.indexOf(player.id, 0);
                  if (index > -1) {
                    delete playerIdsInRound[index];
                    break;
                  }
                  for (const position of OpenMatchingPositions) {
                    if (position.startingPlayer !== player) {
                      // tslint:disable-next-line:max-line-length
                      console.log(`${player.firstName} not placed in open position ${position.name} of period ${position.periodId} in round ${round}`);
                      break;
                    }
                  }
                }
              }
            }
          }
        }
      }

      round++;
      playerIdsInRound = cloneDeep(players.map(player => player.id));
    }
    if (this.allStartingPositionsFilled()) {
      this.tryBenchPlayers(players);
    } else {
      const unplacedPlayers = cloneDeep(players);
      for (const player of unplacedPlayers) {
        this.tryPlacePlayer(player, this.flattenGamePositions());
      }
    }
    return of(this.periods);
  }

  getOpenPositionsByName(positionName: string): Position[] {
    let openMatches: Position[];
    try {
      const flattenedGamePositions = this.flattenGamePositions();

      const nonBenchPositions = flattenedGamePositions.filter(position => position.positionType !== 'bench');

      openMatches = nonBenchPositions
      .filter(position => position.name.toLowerCase() === positionName && typeof(position.startingPlayer) === 'undefined');
    } catch (e) {
      throw new Error(e);
    }

    return openMatches;
  }

  flattenGamePositions() {
    return this.periods
        .sort(period => period.periodNumber)
        .reduce((pos, period) => [...pos, ...period.positions], []);
  }

  tryPlacePlayer(player: Player, OpenMatchingPositions: Position[]): boolean {
    let playerPlaced = false;
    for (const OpenMatchingPosition of OpenMatchingPositions) {
      const periodWithFirstOpenMatch = this.periods.filter(period => period.periodNumber === OpenMatchingPosition.periodId)[0];
      if (periodWithFirstOpenMatch && typeof(periodWithFirstOpenMatch) !== 'undefined') {
        const playerStartingThisPeriod = this.periodService.isPlayerStartingThisPeriod(periodWithFirstOpenMatch, player);
        if (!playerStartingThisPeriod && OpenMatchingPosition.startingPlayer == null) {
          OpenMatchingPosition.startingPlayer = player;
          player.startingPositionIds.push(OpenMatchingPosition.id);
          const rank = player.positionPreferenceRank.ranking.indexOf(OpenMatchingPosition.name.toLowerCase());
          player.placementScore += player.positionPreferenceRank.ranking.length - rank;

          playerPlaced = true;
          break;
        }
      }
    }

    return playerPlaced;
  }

  getRandomPlayerIndex(playerIdsInRound: number[]): number {
    return Math.round(Math.random() * playerIdsInRound.length - 1);
  }

  tryBenchPlayers(benchPlayers: Player[]): boolean {
    let playerPlaced = false;
    const openBenches: Position[] = this.getOpenBenches();
    for (const player of benchPlayers) {
      for (const openBench of openBenches) {
        const currentPeriod: Period = this.periods.filter(period => period.periodNumber === openBench.periodId)[0];
        if (!currentPeriod || this.periodService.isPlayerBenchedThisPeriod(currentPeriod, player)) {
          break;
        }
        if (!this.periodService.isPlayerStartingThisPeriod(currentPeriod, player)) {
          openBench.startingPlayer = player;
          player.benches.push(openBench);
          player.placementScore = player.placementScore - 1;
          playerPlaced = true;
          break;
        }
      }
    }

    return playerPlaced;
  }

  getOpenBenches(): Position[] {
    let openBenches: Position[];
    try {
      const flattenedGamePositions = this.flattenGamePositions();

      const benchPositions = flattenedGamePositions.filter(position => position.positionType === 'bench');

      openBenches = benchPositions
      .filter(position => typeof(position.startingPlayer) === 'undefined');
    } catch (e) {
      throw new Error(e);
    }
    return openBenches;
  }

  allGamePositionsFilled(): boolean {
    // flatten the positions in all periods
    const allPositions = this.flattenGamePositions();
    const allFilled = !allPositions.some(position => typeof(position.startingPlayer) === 'undefined');
    return allFilled;
  }

  allStartingPositionsFilled(): boolean {
    // flatten the positions in all periods
    const allPositions = this.flattenGamePositions()
      .filter(position => position.name !== 'bench');
    const allFilled = !allPositions.some(position => typeof(position.startingPlayer) === 'undefined');
    return allFilled;
  }

  setStartingPositionsPerPlayerCount(): number {
      return this.MAX_PLAYERS_ON_FIELD * this.periods.length / this.availablePlayerCount;
  }
}

