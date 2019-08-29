import { Player } from '../players/player';

export class Position {
  name: string;
  startingPlayer: Player;
  positionType: [
    'bench',
    'goalie',
    'mid',
    'defense',
    'forward'
  ];
  periodId: number;
  periodNumber: number;

  constructor(name: string) {
this.name = name;
  }
}
