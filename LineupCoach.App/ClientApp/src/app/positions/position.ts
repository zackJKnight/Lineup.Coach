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
  /// key-value playerIds and fitScores
  candidates?: Map<number, number>;

  constructor(name: string, id?: number, periodId?: number) {
    this.id = id;
    this.name = name;
    this.positionType = PositionType[name];
    this.periodId = periodId;
    this.candidates = new Map<number, number>();
  }
}
