import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { GameService } from '../games/game.service';
import { map } from 'rxjs/operators';

@Injectable()
export class PeriodLineupResolver implements Resolve<any> {
  constructor(
    private gameService: GameService
      ) {}

  resolve() {
return this.gameService.generateLineup()
        .pipe(map(periods => periods));
  }
}
