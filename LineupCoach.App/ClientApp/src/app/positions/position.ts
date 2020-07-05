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
  id?: number;
  name: string;
  startingPlayer?: Player;
  periodId?: number;
  positionType?: PositionType;
  candidates?: Map<number, number>; //key-value playerIds and fitScores

  constructor(name: string, id?: number, periodId?: number) {
    this.id = id;
    this.name = name;
    this.positionType = PositionType[name];
    this.periodId = periodId;
  }
}
