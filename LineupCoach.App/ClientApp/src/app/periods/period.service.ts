import { Injectable } from '@angular/core';
import { PeriodsModule } from './periods.module';
import { Period } from './period';
import { Player } from '../players/player';
import { Position } from '../positions/position';

@Injectable({
  providedIn: PeriodsModule
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

}
