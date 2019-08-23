import { Injectable } from '@angular/core';
import { Player } from './player';
import { Subject } from 'rxjs';
// import { TeamsModule } from '../teams/teams.module';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  getPlayers() {
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
    firstName: 'Merve',
    lastName: 'Green',
    isPresent: true,
    positionPreferenceRank: {
      ranking: [
        ]
    },
    startingPositions: [],
    placementScore: 0,
    benches: []
  },
  {
    firstName: 'Hal',
    lastName: 'Blue',
    isPresent: true,
    positionPreferenceRank: {
      ranking: [
        ]
    },
    startingPositions: [],
    placementScore: 0,
    benches: []
  },
  {
    firstName: 'JoeJoe',
    lastName: 'Orange',
    isPresent: true,
    positionPreferenceRank: {
      ranking: [
        ]
    },
    startingPositions: [],
    placementScore: 0,
    benches: []
  },
  {
    firstName: 'Mark',
    lastName: 'Brown',
    isPresent: true,
    positionPreferenceRank: {
      ranking: [
        ]
    },
    startingPositions: [],
    placementScore: 0,
    benches: []
  },
  {
    firstName: 'Chip',
    lastName: 'Red',
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

