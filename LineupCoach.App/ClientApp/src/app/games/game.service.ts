import { Injectable } from '@angular/core';
import { Player } from '../players/player';
import { Position } from '../positions/position';
import { Game } from './game.model';
import { PlayerService } from '../players/player.service';
import { Period } from '../periods/period';
import { PeriodService } from '../periods/period.service';
import * as cloneDeep from 'lodash/cloneDeep';

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
      this.availablePlayerCount = this.playerService.getPlayers().map(
        player => player.isPresent).length;
      this.startingPositionsPerPlayer = this.setStartingPositionsPerPlayerCount();
      // ToDo this is still organized as copied from the C# console app. need to improve this
      this.theGame = new Game();
      this.theGame.Periods = this.periods;
    }

  generateLineup(players: Player[]) {
    let round = 0;
    let playersInRound = cloneDeep(players);

    // ToDo if the players don't have ranking, need default or throw here.
    const preferenceRankMax: number = Math.max.apply(Math, players.map(player =>
      player.positionPreferenceRank.ranking.length));
    const initialPlayerCount = playersInRound.length;

    // Rounds - within the rounds the players (in random order) are placed based on preference.
    while (!this.allGamePositionsFilled() && round < this.startingPositionsPerPlayer + 1) {
      for (let i = 0; i < initialPlayerCount; i++) {
        if (playersInRound.length > 0) {
          let playerPlaced = false;
          let player = this.getRandomPlayer(playersInRound);
          for (let currentPrefRankIndex = 0; currentPrefRankIndex < preferenceRankMax; currentPrefRankIndex++) {
            if (!playerPlaced && typeof(player) !== 'undefined') {
              const positionName: string = this.playerService.getPositionNameByPreferenceRank(player, currentPrefRankIndex);
              if (typeof positionName !== 'undefined' && positionName) {
                const OpenMatchingPositions: Position[] = this.getOpenPositionsByName(positionName);
                if (!OpenMatchingPositions.some(open => typeof(open) !== 'undefined')) {
                  if (currentPrefRankIndex === preferenceRankMax) {
                    const benchPlayers: Player[] = [player];
                    // benchPlayers.push(player);
                    playerPlaced = this.tryBenchPlayers(this.theGame, benchPlayers);
                  } else {
                    console.log(`No match for ${positionName} but we can try the next ranked position for ${player.firstName}`);
                  }
                } else {
                  playerPlaced = this.tryPlacePlayer(this.theGame, playersInRound, player, OpenMatchingPositions);
                }
              }
            }
          }
        }
      }

      round++;
      playersInRound = cloneDeep(players);
    }
    return this.periods;
  }
  getOpenPositionsByName(positionName: string): Position[] {
    let openMatches: Position[];
    try {
      const flattenedGamePositions = this.periods
        .sort(period => period.periodNumber)
        .reduce((pos, period) => [...pos, ...period.positions], []);

      const nonBenchPositions = flattenedGamePositions.filter(position => position.positionType !== 'bench');

      openMatches = nonBenchPositions
      .filter(position => position.name.toLowerCase() === positionName && typeof(position.startingPlayer) === 'undefined');
    } catch (e) {
      throw new Error(e);
    }

    return openMatches;
  }

  tryPlacePlayer(theGame: Game, playersInRound: Player[], player: Player, OpenMatchingPositions: Position[]): boolean {
    let playerPlaced = false;
    for (const OpenMatchingPosition of OpenMatchingPositions) {
      const periodWithFirstOpenMatch = this.periods.filter(period => period.periodNumber === OpenMatchingPosition.periodId)[0];
      if (periodWithFirstOpenMatch != null) {
        const playerStartingThisPeriod = this.periodService.isPlayerStartingThisPeriod(periodWithFirstOpenMatch, player);
        if (!playerStartingThisPeriod && OpenMatchingPosition.startingPlayer == null) {
          OpenMatchingPosition.startingPlayer = player;
          player.startingPositions.push(OpenMatchingPosition);
          const rank = player.positionPreferenceRank.ranking.indexOf(OpenMatchingPosition.name.toLowerCase());
          player.placementScore += player.positionPreferenceRank.ranking.length - rank;
          const index = playersInRound.indexOf(player, 0);
          if (index > -1) {
            playersInRound.splice(index, 1);
          }

          playerPlaced = true;
          break;
        }
      }
    }

    return playerPlaced;
  }
  getRandomPlayer(playersInRound: Player[]): Player {
    const randomIndex: number = Math.round(Math.random() * playersInRound.length);

    return playersInRound[randomIndex];
  }

  tryBenchPlayers(theGame: any, benchPlayers: Player[]): boolean {
    let playerPlaced = false;
    const openBenches = this.getOpenBenches();
    for (const player of benchPlayers) {
      for (const openBench of openBenches) {
        const currentPeriod: Period = this.periods.filter(period => period.periodNumber === openBench.periodNumber)[0];
        if (!this.periodService.isPlayerBenchedThisPeriod(currentPeriod, player)
          && !this.periodService.isPlayerStartingThisPeriod(currentPeriod, player)) {
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
    return this.periods
      .sort(period => period.periodNumber)
      .reduce((pos, period) => [...pos, ...period.positions], [])
      .filter(position => position.PositionType === 'bench')
      .filter(position => position.startingPlayer == null);
  }

  allGamePositionsFilled(): boolean {
    // flatten the positions in all periods
    const allPositions = this.periods.reduce((pos, period) => [...pos, ...period.positions], []);
    const allFilled = allPositions.some(position => typeof(position.startingPlayer) !== 'undefined');
    return allFilled;
  }

  setStartingPositionsPerPlayerCount(): number {
      return this.MAX_PLAYERS_ON_FIELD * this.periods.length / this.availablePlayerCount;
  }
}

