import { Injectable } from '@angular/core';

import { GameService } from '../games/game.service';
import { map } from 'rxjs/operators';

@Injectable()
export class PeriodLineupResolver  {
  constructor(
    private gameService: GameService
      ) {}

  resolve() {
return this.gameService.optimizePlacement()
        .pipe(map(periods => periods));
  }
}
