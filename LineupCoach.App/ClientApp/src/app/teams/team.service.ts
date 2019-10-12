import { Injectable } from '@angular/core';
import { Position } from '../positions/position';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
public teamPositions: Position[];
  constructor() { }

getPositions(): Position[] {

let positions = new Array<Position>();
positions.push(new Position('goalie'));
positions.push(new Position('forward'));
positions.push(new Position('forward'));
positions.push(new Position('defense'));
positions.push(new Position('defense'));
positions.push(new Position('mid'));
positions.push(new Position('mid'));
positions.push(new Position('mid'));
// positions.push(new Position('bench'));
// positions.push(new Position('bench'));
// positions.push(new Position('bench'));
// positions.push(new Position('bench'));
this.teamPositions = positions;
return this.teamPositions;
}
}
