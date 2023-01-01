import { Injectable } from '@angular/core';
import { Position } from '../positions/position';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
public teamPositions: Position[];

  constructor() {
    this.teamPositions = [];
    this.teamPositions.push(new Position('goalie'));
this.teamPositions.push(new Position('forward'));
this.teamPositions.push(new Position('forward'));
this.teamPositions.push(new Position('defense'));
this.teamPositions.push(new Position('defense'));
this.teamPositions.push(new Position('mid'));
this.teamPositions.push(new Position('mid'));
this.teamPositions.push(new Position('mid'));
this.teamPositions.push(new Position('bench'));
this.teamPositions.push(new Position('bench'));
this.teamPositions.push(new Position('bench'));
this.teamPositions.push(new Position('bench'));
   }

getPositions(): Position[] {
return this.teamPositions;
}

}
