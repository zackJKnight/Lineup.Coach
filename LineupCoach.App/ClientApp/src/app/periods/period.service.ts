import { Injectable } from '@angular/core';
import { Period } from './period';
import { Player } from '../players/player';
import { Position } from '../positions/position';
import { PeriodsModule } from './periods.module';

@Injectable({
  providedIn: 'root'
})
export class PeriodService {
  private periods: Period[];
  constructor() {}

  allPeriodPositionsFull(period: Period): boolean {
    return period.positions.filter(pos => pos.startingPlayer === undefined).length === 0;
  }

  playerIsBenchedThisPeriod(currentPeriodId: number, player: Player): boolean {
    if (!player.benchIds || player.benchIds.length === 0) {
      return false;
    }
    const benchedInPeriods = player.benchIds.map(
      benchId => this.getPositionById(benchId).periodId
    );
    return benchedInPeriods.some(periodId => periodId === currentPeriodId);
  }

  playerIsStartingAnotherPositionThisPeriod(periodId: number, currentPositionId: number, player: Player): boolean {
    if (
      typeof player.startingPositionIds === 'undefined' ||
      player.startingPositionIds.length === 0
    ) {
      return false;
    }
    const otherPostions = player.startingPositionIds.filter(pos => pos !== currentPositionId);
    const matchingPosition = otherPostions.some(
      positionId => this.getPositionById(positionId).periodId === periodId
    );
    return matchingPosition;
  }

  playerIsStartingThisPeriod(periodId: number, player: Player): boolean {
    if (
      typeof player.startingPositionIds === 'undefined' ||
      player.startingPositionIds.length === 0
    ) {
      return false;
    }
    const matchingPosition = player.startingPositionIds.some(
      positionId => this.getPositionById(positionId).periodId === periodId
    );
    return matchingPosition;
  }

  getPositionById(id: number): Position {
    return this.getPeriods()
      .reduce((pos, period) => [...pos, ...period.positions], [])
      .filter(position => position.id === id)[0];
  }
  getPeriods(): Period[] {
    if (typeof this.periods === 'undefined' || this.periods.length === 0) {
      this.periods = new Array<Period>();
      const period1 = new Period(1);
      period1.positions = new Array<Position>();
      period1.positions.push(new Position('goalie', 0, 1));
      period1.positions.push(new Position('forward', 1, 1));
      period1.positions.push(new Position('forward', 2, 1));
      period1.positions.push(new Position('defense', 3, 1));
      period1.positions.push(new Position('defense', 4, 1));
      period1.positions.push(new Position('mid', 5, 1));
      period1.positions.push(new Position('mid', 6, 1));
      period1.positions.push(new Position('mid', 7, 1));
      // TODO Dynamically add benches for present players.
      period1.positions.push(new Position('bench', 8, 1));
      period1.positions.push(new Position('bench', 9, 1));
      period1.positions.push(new Position('bench', 10, 1));
      period1.positions.push(new Position('bench', 11, 1));
      this.periods.push(period1);
      const period2 = new Period(2);
      period2.positions = new Array<Position>();
      period2.positions.push(new Position('goalie', 12, 2));
      period2.positions.push(new Position('forward', 13, 2));
      period2.positions.push(new Position('forward', 14, 2));
      period2.positions.push(new Position('defense', 15, 2));
      period2.positions.push(new Position('defense', 16, 2));
      period2.positions.push(new Position('mid', 17, 2));
      period2.positions.push(new Position('mid', 18, 2));
      period2.positions.push(new Position('mid', 19, 2));
      period2.positions.push(new Position('bench', 20, 2));
      period2.positions.push(new Position('bench', 21, 2));
      period2.positions.push(new Position('bench', 22, 2));
      period2.positions.push(new Position('bench', 23, 2));

      this.periods.push(period2);
      const period3 = new Period(3);
      period3.positions = new Array<Position>();
      period3.positions.push(new Position('goalie', 24, 3));
      period3.positions.push(new Position('forward', 25, 3));
      period3.positions.push(new Position('forward', 26, 3));
      period3.positions.push(new Position('defense', 27, 3));
      period3.positions.push(new Position('defense', 28, 3));
      period3.positions.push(new Position('mid', 29, 3));
      period3.positions.push(new Position('mid', 30, 3));
      period3.positions.push(new Position('mid', 31, 3));
      period3.positions.push(new Position('bench', 32, 3));
      period3.positions.push(new Position('bench', 33, 3));
      period3.positions.push(new Position('bench', 33, 3));
      period3.positions.push(new Position('bench', 34, 3));
      this.periods.push(period3);
      const period4 = new Period(4);
      period4.positions = new Array<Position>();
      period4.positions.push(new Position('goalie', 35, 4));
      period4.positions.push(new Position('forward', 36, 4));
      period4.positions.push(new Position('forward', 37, 4));
      period4.positions.push(new Position('defense', 38, 4));
      period4.positions.push(new Position('defense', 39, 4));
      period4.positions.push(new Position('mid', 40, 4));
      period4.positions.push(new Position('mid', 41, 4));
      period4.positions.push(new Position('mid', 42, 4));
      period4.positions.push(new Position('bench', 43, 4));
      period4.positions.push(new Position('bench', 44, 4));
      period4.positions.push(new Position('bench', 45, 4));
      period4.positions.push(new Position('bench', 46, 4));
      this.periods.push(period4);
    }
    return this.periods;
  }

  resetPositions() {
    this.periods = [];
    this.periods = this.getPeriods();
  }

  setStartingPlayer(periodId: number, positionId: number, player: Player) {
    const givenPosition = this.getPositionById(positionId);
    if (givenPosition) {
      givenPosition.startingPlayer = player;
    }
  }

  savePeriods(periods: Period[]) {
    this.periods = periods;
  }
}
