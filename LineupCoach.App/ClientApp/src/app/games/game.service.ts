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

  public periods: Array<Period>;

  constructor(
    private playerService: PlayerService,
    private periodService: PeriodService
  ) {
    this.periods = this.periodService.getPeriods();
    this.availablePlayerCount = this.playerService.getPresentPlayers().length;
    this.startingPositionsPerPlayer = this.setStartingPositionsPerPlayerCount();

  }

  generateLineup(): Observable<Period[]> {
    const players: Player[] = this.playerService.getPresentPlayers();
    const subject = new Subject<Period[]>();
    let round = 0;
    const playerIdsInRound = cloneDeep(players
      .filter(player => player.isPresent)
      .map(player => player.id));

    // ToDo if the players don't have ranking, need default or throw here.
    const preferenceRankMax: number = Math.max.apply(Math, players.map(player =>
      player.positionPreferenceRank.ranking.length));

    // Rounds - within the rounds the players (in random order) are placed based on preference.
    while (!this.allGamePositionsFilled() && round < Math.floor(this.startingPositionsPerPlayer)) {
      // Loop through the player list - trying to find each a position that best fits their preference.
      let playerIdsInRandomOrder = _shuffle(playerIdsInRound);
      for (const playerId of playerIdsInRandomOrder) {
        const player: Player = this.playerService.getPlayerById(playerId);

        for (let currentPrefRankIndex = 0; currentPrefRankIndex < preferenceRankMax; currentPrefRankIndex++) {
          const positionName: string = this.playerService.getPositionNameByPreferenceRank(player, currentPrefRankIndex);
          console.log(`Looking for open ${positionName} for player ${player.firstName} ${player.id} in round ${round}`);
          if (typeof positionName !== 'undefined' && positionName) {
            const OpenMatchingPositions: Position[] = this.getOpenPositionsByName(positionName);
            if (typeof (OpenMatchingPositions) === 'undefined' || OpenMatchingPositions.length === 0) {
              // We've tried to put this player in each position.
              if (currentPrefRankIndex + 1 === preferenceRankMax) {
                const benchPlayers: Player[] = [player];
                if (this.tryBenchPlayers(benchPlayers)) {
                  break;
                }
              } else {
                console.log(`No match for ${positionName} but we can try the next ranked position for ${player.firstName}`);
              }
            } else {
              if (player.startingPositionIds.length < this.startingPositionsPerPlayer) {
                if (this.tryPlacePlayer(player, OpenMatchingPositions)) {
                  break;
                }
              }
            }
          }
        }
      }
      round++;
    }
    if (!this.allStartingPositionsFilled()) {
      const unplacedPlayers = cloneDeep(players
        .filter(player => this.playerService.playerPlacementIsComplete(player.id, this.periods.length)));
      for (const player of unplacedPlayers) {
        this.tryPlacePlayer(player, this.flattenGamePositions()
          .filter(position => typeof (position.startingPlayer) === 'undefined'));
      }
    }
    this.tryBenchPlayers(players
      .filter(player => this.playerService.playerPlacementIsComplete(player.id, this.periods.length)));

    setTimeout(() => {
      subject.next(this.periods);
      subject.complete();
    }, 10);
    return subject;
  }

  getOpenPositionsByName(positionName: string): Position[] {
    let openMatches: Position[];
    try {
      const flattenedGamePositions = this.flattenGamePositions();

      const nonBenchPositions = flattenedGamePositions.filter(position => position.positionType !== 'bench');

      openMatches = nonBenchPositions
        .filter(position => position.name.toLowerCase() === positionName && typeof (position.startingPlayer) === 'undefined');
    } catch (e) {
      throw new Error(e);
    }

    return openMatches;
  }

  flattenGamePositions(): Position[] {
    return this.periods
      .sort(period => period.periodNumber)
      .reduce((pos, period) => [...pos, ...period.positions], []);
  }

  tryPlacePlayer(player: Player, OpenMatchingPositions: Position[]): boolean {
    let playerPlaced = false;
    for (const OpenMatchingPosition of OpenMatchingPositions) {
      const periodWithFirstOpenMatch = this.periods.filter(period => period.periodNumber === OpenMatchingPosition.periodId)[0];
      if (periodWithFirstOpenMatch && typeof (periodWithFirstOpenMatch) !== 'undefined') {
        const playerStartingThisPeriod = this.periodService.playerIsStartingThisPeriod(periodWithFirstOpenMatch, player);
        if (!playerStartingThisPeriod && OpenMatchingPosition.startingPlayer == null) {
          this.periodService.setStartingPlayer(periodWithFirstOpenMatch.id, OpenMatchingPosition.id, player);
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
    const openBenches: Position[] = this.getOpenBenches().filter(bench =>
      benchPlayers.some(player => player.startingPositionIds
        .some(positionId =>
          this.periodService.getPositionById(positionId).periodId !== bench.periodId)));
    if (openBenches && typeof (openBenches) !== 'undefined') {
      for (const player of benchPlayers) {
        for (const openBench of openBenches) {
          const currentPeriod: Period = this.periods.filter(period => period.id === openBench.periodId)[0];
          if (!currentPeriod || this.periodService.playerIsBenchedThisPeriod(currentPeriod, player)) {
            console.log(`Player ${player.firstName} already benched in period ${currentPeriod.id}`);
            continue;
          }
          if (!this.periodService.playerIsStartingThisPeriod(currentPeriod, player)) {
            this.periodService.setStartingPlayer(currentPeriod.id, openBench.id, player);

            player.benchIds.push(openBench.id);
            console.log(`player ${player.firstName} placed in bench ${openBench.id} in period ${currentPeriod.periodNumber}`);
            player.placementScore = player.placementScore - 1;
            playerPlaced = true;
            break;
          }
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
        .filter(position => typeof (position.startingPlayer) === 'undefined');
    } catch (e) {
      throw new Error(e);
    }
    return openBenches;
  }

  allGamePositionsFilled(): boolean {
    // flatten the positions in all periods
    const allPositions = this.flattenGamePositions();
    const allFilled = !allPositions.some(position => typeof (position.startingPlayer) === 'undefined');
    return allFilled;
  }

  allStartingPositionsFilled(): boolean {
    // flatten the positions in all periods
    const allPositions = this.flattenGamePositions()
      .filter(position => position.name !== 'bench');
    const allFilled = !allPositions.some(position => typeof (position.startingPlayer) === 'undefined');
    return allFilled;
  }

  setStartingPositionsPerPlayerCount(): number {
    return Math.round(this.MAX_PLAYERS_ON_FIELD * this.periods.length / this.availablePlayerCount);
  }
}

