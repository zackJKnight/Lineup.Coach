import { Injectable } from '@angular/core';
import { Period } from './period';
import { Player } from '../players/player';
import { Position } from '../positions/position';

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

}
