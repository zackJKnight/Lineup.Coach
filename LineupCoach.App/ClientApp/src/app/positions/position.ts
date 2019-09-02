import { Player } from '../players/player';

enum PositionType {
  bench = 'bench',
  goalie = 'goalie',
  mid = 'mid',
  defense = 'defense',
  forward = 'forward',
  keeper = 'keeper',
  striker = 'striker'
}

export class Position {
  name: string;
  startingPlayer?: Player;
  periodId: number;
  periodNumber: number;
  positionType?: PositionType;

  constructor(name: string, periodId: number) {
    this.name = name;
    this.positionType = PositionType[name];
    this.periodId = periodId;
  }
}
