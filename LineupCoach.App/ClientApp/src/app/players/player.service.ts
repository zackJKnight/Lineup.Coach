import { Injectable } from '@angular/core';
import { Player } from './player';
import { Subject } from 'rxjs';
// import { TeamsModule } from '../teams/teams.module';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  getPlayers() {
    //const subject = new Subject();
    //setTimeout(() => {
    //   subject.next(PLAYERS); subject.complete();
    //}, 100);
    //return subject;
    return PLAYERS;
  }

  getPositionNameByPreferenceRank(
    player: Player,
    currentPrefRank: number
  ): string {
    let result: string;
    if ( currentPrefRank > 0 &&
      (typeof player.positionPreferenceRank !== 'undefined') &&
      currentPrefRank <= player.positionPreferenceRank.ranking.length
    ) {
      result = player.positionPreferenceRank.ranking[currentPrefRank - 1];
    }
    return result;
  }
}

const PLAYERS: Player[] = [
  {
    firstName: 'Myles',
    lastName: 'Knight',
    isPresent: true,
    positionPreferenceRank: {
      ranking: [
        ]
    },
    startingPositions: [],
    placementScore: 0,
    benches: []
  }
];

