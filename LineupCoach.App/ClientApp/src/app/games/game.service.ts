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

  constructor(
    private playerService: PlayerService,
    private periodService: PeriodService
  ) {
    this.availablePlayerCount = this.playerService.getPresentPlayers().length;
    this.startingPositionsPerPlayer = this.setStartingPositionsPerPlayerCount();
  }

  // Abandon this approach in favor of an algorithm.
  generateLineup(): Observable<Period[]> {
    const players: Player[] = this.playerService.getPresentPlayers();
    const subject = new Subject<Period[]>();
    let round = 0;
    const playerIdsInRound = players.map(player => player.id);

    const preferenceRankMax: number = Math.max.apply(
      Math,
      players.map(player => player.positionPreferenceRank.ranking.length)
    );
    const roundedPositionsPerPlayer = Math.floor(
      this.startingPositionsPerPlayer
    );
    const benchCount = this.flattenGamePositions().filter(
      position => position.name === 'bench'
    ).length;

    // Rounds - within the rounds the players (in random order) are placed based on preference.
    while (
      !this.allGamePositionsFilled() &&
      round < roundedPositionsPerPlayer + benchCount / (this.PLACEMENT_ROUND_DIVISOR + this.availablePlayerCount)
    ) {
      // Loop through the player list - trying to find each a position that best fits their preference.
      const playerIdsInRandomOrder = _shuffle(playerIdsInRound);
      for (const playerId of playerIdsInRandomOrder) {
        const player: Player = this.playerService.getPlayerById(playerId);
        if (!player || !player.isPresent) {
          console.log(`player ${player.firstName} not present`);
          continue;
        }
        for (
          let currentPrefRankIndex = 0;
          currentPrefRankIndex < preferenceRankMax;
          currentPrefRankIndex++
        ) {
          const positionName: string = this.playerService.getPositionNameByPreferenceRank(
            player,
            currentPrefRankIndex
          );
          // console.log(`Looking for open ${positionName} for player ${player.firstName} ${player.id} in round ${round}`);
          if (typeof positionName !== 'undefined' && positionName) {
            const OpenMatchingPositions: Position[] = this.getOpenPositionsByName(
              positionName
            );
            if (
              typeof OpenMatchingPositions === 'undefined' ||
              OpenMatchingPositions.length === 0
            ) {
              console.log(
                `No position ${positionName} ranked ${currentPrefRankIndex +
                  1} for ${player.firstName} in round ${round}`
              );
              continue;
            } else {
              // Each player will get a number of starts per game. If player is here today, try to place them.
              if (
                player.isPresent &&
                player.startingPositionIds.length <
                  this.startingPositionsPerPlayer
              ) {
                if (player.isPresent && this.tryPlacePlayer(player, OpenMatchingPositions)) {
                  console.log(
                    `Player ${player.firstName} placed in round ${round}`
                  );
                  break;
                }
                console.log(
                  `Could not place player ${player.firstName} in round ${round}`
                );
              }
              // We've tried to put this player in each position.
              // if (currentPrefRankIndex + 1 === preferenceRankMax) {
              if (player.isPresent && this.tryBenchPlayers([player])) {
                console.log(
                  `Player ${player.firstName} benched in round ${round}`
                );
                break;
              } else {
                console.log(`Player ${player} not benched in round ${round}.`);
              }
            }
          }
        }
      }
      round++;
    }
    if (!this.allStartingPositionsFilled()) {
      const unplacedPlayers = cloneDeep(
        players.filter(
          player =>
            player.isPresent
            && !this.playerService.playerPlacementIsComplete(
              player.id,
              this.periodService.getPeriods().length
            )
        )
      );
      for (const player of unplacedPlayers) {
        if (player.isPresent) {
          this.tryPlacePlayer(
            player,
            this.flattenGamePositions().filter(
              position => typeof position.startingPlayer === 'undefined'
            )
          );
        }
      }
    }

    // ToDo filter for players that have not been benched the max bench (so, make a maxBench variable)
    this.tryBenchPlayers(players.filter(player => player.isPresent));
    for (const needsABenchPlayer of _shuffle(players.filter(player => player.isPresent))) {
      this.tryBenchPlayers([needsABenchPlayer]);
    }
    for (const position of this.flattenGamePositions()) {
      console.log(
        `period ${position.periodId} position ${
          position.name
        } player ${(position.startingPlayer &&
          position.startingPlayer.firstName) ||
          'none'}`
      );
    }

    setTimeout(() => {
      subject.next(this.periodService.getPeriods());
      subject.complete();
    }, 1);
    return subject;
  }

  optimizePlacement(): Observable<Period[]> {
    const players: Player[] = this.playerService.getPresentPlayers();
    const subject = new Subject<Period[]>();

/////////////////////////////////////// Rework placement algorithm, in progress. See README.md
    for (const period of this.periodService
      .getPeriods()) {
        for ( const position of period.positions) {

          for ( const player of players) {
            player.fitScore = 0;
            // if player starting already, reduce fitness score
            player.fitScore += this.periodService.playerIsStartingThisPeriod(period.id, player) ? -1 : 0;
            // increase fitness score by player's preference for the position
            const rank = player.positionPreferenceRank.ranking.indexOf(
              position.name.toLowerCase()
            );
            player.fitScore += player.positionPreferenceRank.ranking.length - rank;
            // apply curve to fitness score

          }
          const scores = position.candidates.values;
          const bestFitScore = Math.max.apply(Math, scores);
          // pick the player with the highest fitness score
          position.startingPlayer = this.playerService.getPlayerById(position.candidates[bestFitScore]);
          // check for violations and remove players in violation after placement?
        }
      }
/////////////////////////////////////////////////////
    setTimeout(() => {
      subject.next(this.periodService.getPeriods());
      subject.complete();
    }, 1);
    return subject;
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
    // Prevent player from getting a position that gives him far better placement than most.
    return (
      newScore < periodCount * (maxNumberOfPreferredPositions - 1) ||
      (newScore > meanScore && newScore < highestScore - meanScore / 2)
    );
  }

  // TODO do calculations after all players are placed.
  // find lowest score player, get list of position trades that would even score for swapped players.
  // pick the trade that would bring them both closest to mean??

  // TODO - smart rebalance - Sam's idea.
  rebalancePositions() {
    // pass in list of players
    // look at positions that make their placement score at the high end. not sure yet.
    // remove them from positions.
    // send them back through the rounds?
    // this is smelly. how do we prevent ourselves from reaching this point? I'm going back now to look.
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

  flattenGamePositions(): Position[] {
    return this.periodService
      .getPeriods()
      .sort(period => period.periodNumber)
      .reduce((pos, period) => [...pos, ...period.positions], []);
  }

  tryPlacePlayer(player: Player, OpenMatchingPositions: Position[]): boolean {
    let playerPlaced = false;
    if (!player.isPresent) {
      return playerPlaced;
    }
    for (const OpenMatchingPosition of OpenMatchingPositions) {
      const periodIdWithFirstOpenMatch = this.periodService
        .getPeriods()
        .filter(
          period => period.periodNumber === OpenMatchingPosition.periodId
        )[0].id;
      if (
        periodIdWithFirstOpenMatch &&
        typeof periodIdWithFirstOpenMatch !== 'undefined'
      ) {
        const playerStartingThisPeriod = this.periodService.playerIsStartingThisPeriod(
          periodIdWithFirstOpenMatch,
          player
        );
        if (
          player.isPresent &&
          !playerStartingThisPeriod &&
          (typeof OpenMatchingPosition.startingPlayer === 'undefined' || OpenMatchingPosition.startingPlayer === null)
        ) {
          this.periodService.setStartingPlayer(
            periodIdWithFirstOpenMatch,
            OpenMatchingPosition.id,
            player
          );
          const rank = player.positionPreferenceRank.ranking.indexOf(
            OpenMatchingPosition.name.toLowerCase()
          );
          const newScore =
            player.placementScore +
            player.positionPreferenceRank.ranking.length -
            rank;
          if (
            !player.isPresent ||
            !this.placementScoreIsWithinRange(newScore)
          ) {
            console.log(
              `Placement score ${newScore} not in range for Player ${player.firstName} and position ${OpenMatchingPosition.name}`
            );
            break;
          }
          player.placementScore = newScore;
          player.startingPositionIds.push(OpenMatchingPosition.id);
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
    // .filter(bench =>
    //   benchPlayers.some(player => player.startingPositionIds
    //     .some(positionId =>
    //       this.periodService.getPositionById(positionId).periodId !== bench.periodId)));
    if (openBenches && typeof openBenches !== 'undefined') {
      for (const player of benchPlayers) {
        if (!player.isPresent) {
          continue;
        }
        for (const openBench of openBenches) {
          const currentPeriodId = openBench.periodId;
          if (!currentPeriodId || typeof currentPeriodId === 'undefined') {
            console.log(`Period not found for bench id: ${openBench.id}`);
            continue;
          }
          if (
            this.periodService.playerIsBenchedThisPeriod(
              currentPeriodId,
              player
            )
          ) {
            console.log(
              `Player ${player.firstName} already benched in period ${currentPeriodId}`
            );
            continue;
          }
          if (
            player.isPresent &&
            !this.periodService.playerIsStartingThisPeriod(
              currentPeriodId,
              player
            )
          ) {
            this.periodService.setStartingPlayer(
              currentPeriodId,
              openBench.id,
              player
            );

            player.benchIds.push(openBench.id);
            console.log(
              `player ${player.firstName} placed in bench ${openBench.id} in period ${currentPeriodId}`
            );
            player.placementScore = player.placementScore - 1;
            playerPlaced = true;
            break;
          } else {
            console.log(
              `Player ${player.firstName} already starting in period ${openBench.periodId}`
            );
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

  setStartingPositionsPerPlayerCount(): number {
    return Math.round(
      (this.MAX_PLAYERS_ON_FIELD * this.periodService.getPeriods().length) /
        this.availablePlayerCount
    );
  }
}
