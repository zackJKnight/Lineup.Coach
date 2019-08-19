import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { PlayerService } from '../player.service';
import { map } from 'rxjs/operators';

@Injectable()
export class ListPlayersResolver implements Resolve<any> {

  constructor(private playerService: PlayerService) {

  }

  resolve() {
    return this.playerService.getPlayers();
  }
}
