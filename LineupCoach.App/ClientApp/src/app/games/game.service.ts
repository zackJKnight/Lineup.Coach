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
  StartingPositionsPerPlayerCount: number;
  public periods: Array<Period>;

  constructor(
    private playerService: PlayerService,
    private periodService: PeriodService
    ) {
      this.periods = new Array<Period>();
    }

setPeriods() {
  const period1 = new Period(1);
  period1.positions = new Array<Position>();
  period1.positions.push(new Position('goalie'));
  period1.positions.push(new Position('forward'));
  period1.positions.push(new Position('defense'));
  period1.positions.push(new Position('mid'));
  period1.positions.push(new Position('mid'));
  this.periods.push(period1);
}
  generateLineup(players: Player[]) {
    let round: number;
    const playersInRound = cloneDeep(players);

    // ToDo if the players don't have ranking, need default or throw here.
    const preferenceRankMax: number = Math.max.apply(Math, players.map(player =>
      player.positionPreferenceRank.ranking));
    const initialPlayerCount = playersInRound.length;

    // Rounds - within the rounds the players (in random order) are placed based on preference.
    while (!this.allGamePositionsFilled() && round < this.StartingPositionsPerPlayerCount + 1) {
      for (let i: number; i < initialPlayerCount; i++) {
        if (playersInRound.length > 0) {
          let playerPlaced: boolean;
          const player: Player = this.getRandomPlayer(playersInRound);
          for (let currentPrefRank: number; currentPrefRank < preferenceRankMax; currentPrefRank++) {
            if (!playerPlaced) {
              const positionName: string = this.playerService.getPositionNameByPreferenceRank(player, currentPrefRank);
              if (typeof positionName !== 'undefined' && positionName) {
                const OpenMatchingPositions: Position[] = this.getOpenPositionsByName(positionName);
                if (!OpenMatchingPositions.some(open => open == null || typeof open === 'undefined')) {
                  if (currentPrefRank === preferenceRankMax - 1) {
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
      playersInRound.push(...players);
    }
    return this.periods;
  }
  getOpenPositionsByName(positionName: string): Position[] {
    let openMatches: Position[];
    try {
      openMatches = this.periods
        .sort(period => period.periodNumber)
        .reduce((pos, period) => [...pos, ...period.positions], [])
        .filter(position => position.positionType !== 'bench')
        .filter(position => position.name.ToLower() === name && position.startingPlayer == null);
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
          const rank = player.positionPreferenceRank.ranking[OpenMatchingPosition.name.toLowerCase()];
          player.placementScore += player.positionPreferenceRank.ranking[0] - rank;
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
    for (let player of benchPlayers) {
      for (let openBench of openBenches) {
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
    return this.periods.reduce((pos, period) => [...pos, ...period.positions], [])
      .some(position => position.startingPlayer != null);
  }
}
