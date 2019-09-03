import { Injectable } from '@angular/core';
import { Player } from './player';
import { Subject } from 'rxjs';
import * as cloneDeep from 'lodash/cloneDeep';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  public players: Player[];

  constructor() {
    this.players = PLAYERS;
  }
  savePlayers(players: Player[]) {
    this.players = players;
  }

  getPlayers() {
    return this.players;
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
    firstName: 'B.H.',
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
    firstName: 'E.C.',
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
    firstName: 'G.R.',
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
    firstName: 'G.G.',
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
    firstName: 'J.F.',
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
  },
  {
    id: 6,
    firstName: 'M.K.',
    lastName: 'Turquiose',
    isPresent: true,
    positionPreferenceRank: {
      ranking: [
        'mid',
        'defense',
        'goalie',
        'forward'
      ]
    },
    startingPositions: [],
    placementScore: 0,
    benches: []
  },
  {
    id: 7,
    firstName: 'B.S.',
    lastName: 'Cannon',
    isPresent: true,
    positionPreferenceRank: {
      ranking: [
        'forward',
        'mid',
        'goalie',
        'defense'
      ]
    },
    startingPositions: [],
    placementScore: 0,
    benches: []
  },
  {
    id: 8,
    firstName: 'J.C.',
    lastName: 'Mauve',
    isPresent: true,
    positionPreferenceRank: {
      ranking: [
        'defense',
        'forward',
        'mid',
        'goalie'
      ]
    },
    startingPositions: [],
    placementScore: 0,
    benches: []
  },
  {
    id: 9,
    firstName: 'K.T.',
    lastName: 'Yellow',
    isPresent: true,
    positionPreferenceRank: {
      ranking: [
        'forward',
        'mid',
        'goalie',
        'defense'
      ]
    },
    startingPositions: [],
    placementScore: 0,
    benches: []
  },
  {
    id: 10,
    firstName: 'M.C.',
    lastName: 'LiteUrple',
    isPresent: true,
    positionPreferenceRank: {
      ranking: [
        'forward',
        'defense',
        'goalie',
        'mid'
      ]
    },
    startingPositions: [],
    placementScore: 0,
    benches: []
  },
  {
    id: 11,
    firstName: 'P.F.',
    lastName: 'Urple',
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
  }
];

