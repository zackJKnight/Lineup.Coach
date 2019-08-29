import { Position } from '../positions/position';

export class      Period {
  periodNumber: number;
  positions?: Position[];

  constructor(periodNumber: number){
  this.periodNumber = periodNumber;
  }
}
