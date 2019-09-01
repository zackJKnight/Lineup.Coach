import { Injectable } from '@angular/core';
import { Period } from './period';
import { Player } from '../players/player';
import { Position } from '../positions/position';
import { PeriodsModule } from './periods.module';

@Injectable({
  providedIn: 'root'
})
export class PeriodService {

  positions: Position[];

  constructor() { }

  isPlayerBenchedThisPeriod(currentPeriod: Period, player: Player): boolean {
    return this.positions.some(position => player.benches.includes(position));
  }

  isPlayerStartingThisPeriod(periodWithFirstOpenMatchthis: Period, player: Player): boolean {
    return periodWithFirstOpenMatchthis.positions.some(position => player.startingPositions.includes(position));
  }

  getPeriods(): Period[] {
    let periods: Period[] = new Array<Period>();
    const period1 = new Period(1);
    period1.positions = new Array<Position>();
    period1.positions.push(new Position('goalie', 1));
    period1.positions.push(new Position('forward', 1));
    period1.positions.push(new Position('defense', 1));
    period1.positions.push(new Position('mid', 1));
    period1.positions.push(new Position('mid', 1));
    periods.push(period1);
    const period2 = new Period(2);
    period2.positions = new Array<Position>();
    period2.positions.push(new Position('goalie', 2));
    period2.positions.push(new Position('forward', 2));
    period2.positions.push(new Position('defense', 2));
    period2.positions.push(new Position('mid', 2));
    period2.positions.push(new Position('mid', 2));
    periods.push(period2);
    const period3 = new Period(3);
    period3.positions = new Array<Position>();
    period3.positions.push(new Position('goalie', 3));
    period3.positions.push(new Position('forward', 3));
    period3.positions.push(new Position('defense', 3));
    period3.positions.push(new Position('mid', 3));
    period3.positions.push(new Position('mid', 3));
    periods.push(period3);
    const period4 = new Period(4);
    period4.positions = new Array<Position>();
    period4.positions.push(new Position('goalie', 4));
    period4.positions.push(new Position('forward', 4));
    period4.positions.push(new Position('defense', 4));
    period4.positions.push(new Position('mid', 4));
    period4.positions.push(new Position('mid', 4));
    periods.push(period4);
    return periods;
  }

}
