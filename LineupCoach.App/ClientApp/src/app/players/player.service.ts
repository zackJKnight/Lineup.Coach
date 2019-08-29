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
      currentPrefRank <= player.positionPreferenceRank.ranking
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
      ranking: {
        goalie: '2',
        defense: '4',
        mid: '1',
        forward: '3'
      }

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
      ranking: {
        goalie: '2',
          defense: '4',
          mid: '1',
          forward: '3'
      }
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
      ranking: {
        goalie: '3',
          defense: '1',
          mid: '4',
          forward: '2'
      }
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
      ranking: {
        goalie: '2',
        defense: '1',
        mid: '3',
        forward: '4'
    }
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
      ranking: {
        goalie: '4',
        defense: '3',
        mid: '2',
        forward: '1'
    }
    },
    startingPositions: [],
    placementScore: 0,
    benches: []
  }
];

