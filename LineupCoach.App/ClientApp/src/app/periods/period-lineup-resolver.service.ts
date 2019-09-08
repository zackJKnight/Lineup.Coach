import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { GameService } from '../games/game.service';
import { map } from 'rxjs/operators';
import { PlayerService } from '../players/player.service';

@Injectable()
export class PeriodLineupResolver implements Resolve<any> {
  constructor(
    private gameService: GameService,
    private playerService: PlayerService
  ) {}

  resolve() {
return this.gameService.generateLineup(this.playerService.getPresentPlayers())
        .pipe(map(periods => periods));
  }
}
