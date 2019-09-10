import { Position } from '../positions/position';

export class      Period {
  id: number;
  periodNumber: number;
  positions?: Position[];

  constructor(periodNumber: number) {
    this.id = periodNumber;
    this.periodNumber = periodNumber;
  }
}
