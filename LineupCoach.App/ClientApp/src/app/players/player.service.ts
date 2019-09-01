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
    if ( currentPrefRank >= 0 &&
      (typeof player.positionPreferenceRank !== 'undefined') &&
      currentPrefRank + 1 <= player.positionPreferenceRank.ranking.length
    ) {
      result = player.positionPreferenceRank.ranking[currentPrefRank];
    }
    return result;
  }
}

const PLAYERS: Player[] = [
  {
    id: 1,
    firstName: 'Merve',
    lastName: 'Green',
    isPresent: true,
    positionPreferenceRank: {
      ranking: [
        'mid',
        'goalie',
        'forward',
        'defense'
      ]

    },
    startingPositions: [],
    placementScore: 0,
    benches: []
  },
  {
    id: 2,
    firstName: 'Hal',
    lastName: 'Blue',
    isPresent: true,
    positionPreferenceRank: {
      ranking: [
        'forward',
        'goalie',
        'mid',
        'defense'
      ]
    },
    startingPositions: [],
    placementScore: 0,
    benches: []
  },
  {
    id: 3,
    firstName: 'JoeJoe',
    lastName: 'Orange',
    isPresent: true,
    positionPreferenceRank: {
      ranking: [
        'defense',
        'forward',
        'goalie',
        'mid'
      ]
    },
    startingPositions: [],
    placementScore: 0,
    benches: []
  },
  {
    id: 4,
    firstName: 'Mark',
    lastName: 'Brown',
    isPresent: true,
    positionPreferenceRank: {
      ranking: [
        'defense',
        'goalie',
        'mid',
        'forward'
      ]
    },
    startingPositions: [],
    placementScore: 0,
    benches: []
  },
  {
    id: 5,
    firstName: 'Chip',
    lastName: 'Red',
    isPresent: true,
    positionPreferenceRank: {
      ranking: [
        'forward',
        'mid',
        'defense',
        'goalie'
      ]
    },
    startingPositions: [],
    placementScore: 0,
    benches: []
  }
];

