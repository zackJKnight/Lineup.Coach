import { Injectable } from '@angular/core';
import { Position } from '../positions/position';
import { PlayerService } from '../players/player.service';
import { Period } from '../periods/period';
import { PeriodService } from '../periods/period.service';
import * as _shuffle from 'lodash/shuffle';
import { Observable, of, Subject } from 'rxjs';
import { Population } from './Population';
import { createGame } from './game-utils';
import { TeamService } from '../teams/team.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  availablePlayerCount: number;
  MAX_PLAYERS_ON_FIELD = 8;
  fulfilledGame: Array<Period>;

  constructor(
    private playerService: PlayerService,
    private periodService: PeriodService,
    private teamService: TeamService
  ) {
    this.availablePlayerCount = this.playerService.getPresentPlayers().length;
  }

  // had to do some learning and borrowing to get this to work. Thanks, Daniel Shiffman!
  optimizePlacement(): Observable<Period[]> {
    this.fulfilledGame = new Array<Period>();
    const subject = new Subject<Period[]>();
    this.addOrRemovePositions();
    const positionNames = this.teamService.getPositions().map((pos) => pos.name);
    const target = createGame(this.periodService.getPeriods().length, this.teamService.getPositions());
    console.log(target);
    const popmax = 500;
    const mutationRate = 0.09;
    const simplePlayerArray = this.playerService.getPresentPlayers()?.map((player) => {
      return { name: player.firstName ?? '', pref: player.positionPreferenceRank?.ranking ?? []}
    });

    simplePlayerArray.forEach(player => console.log(player));
    let population = new Population(target, mutationRate, popmax, simplePlayerArray, positionNames);
    population.generate();
    population.calcFitness();
    population.evaluate();
    population.best.genes.forEach((gene, idx) => {
      //map the simple gene to a period?
      const period = new Period(idx + 1);
      period.positions = [];
      gene.forEach((player, idx) => {
        const position = new Position(positionNames[idx]);
        position.startingPlayer = this.playerService.getPresentPlayers().find(p => p.firstName === player.name);
        period.positions.push(position);
      });
      this.fulfilledGame.push(period);
    });
    this.fulfilledGame.reverse();
    this.periodService.savePeriods(this.fulfilledGame);

    setTimeout(() => {
      subject.next(this.periodService.getPeriods());
      subject.complete();
    }, 1);
    return subject;
  }

  addOrRemovePositions() {
    if(this.teamService.getPositions().length < this.availablePlayerCount){
      for(let i =0; i < this.availablePlayerCount - this.teamService.getPositions().length; i++){
      this.teamService.teamPositions.push(new Position('bench'));
      }
    } else if (this.teamService.getPositions().length > this.availablePlayerCount){
      for(let i =0; i < this.teamService.getPositions().length - this.availablePlayerCount; i++){
      this.teamService.teamPositions.pop();
      }
    }
  }
}
