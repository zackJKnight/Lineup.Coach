import { Injectable } from '@angular/core';
import { Player } from './player';

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

  getPresentPlayers() {
    return this.players
    .filter(player => player.isPresent);
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
        'goalie',
        'defense',
        'forward',
        'mid'
      ]

    },
    startingPositionIds: [],
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
        'goalie',
        'forward',
        'defense',
        'mid'
      ]
    },
    startingPositionIds: [],
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
        'mid',
        'forward',
        'goalie',
        'defense'
      ]
    },
    startingPositionIds: [],
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
        'forward',
        'defense',
        'goalie',
        'mid'
      ]
    },
    startingPositionIds: [],
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
        'defense',
        'forward',
        'mid',
        'goalie'
      ]
    },
    startingPositionIds: [],
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
    startingPositionIds: [],
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
        'mid',
        'forward',
        'defense',
        'goalie'
      ]
    },
    startingPositionIds: [],
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
        'goalie',
        'mid',
        'forward',
        'defense'
      ]
    },
    startingPositionIds: [],
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
        'defense',
        'goalie'
      ]
    },
    startingPositionIds: [],
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
        'goalie',
        'mid',
        'forward',
        'defense'
      ]
    },
    startingPositionIds: [],
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
        'goalie',
        'mid',
        'defense',
        'forward'
      ]
    },
    startingPositionIds: [],
    placementScore: 0,
    benches: []
  },
  {
    id: 12,
    firstName: 'Br.E.',
    lastName: 'Clear',
    isPresent: true,
    positionPreferenceRank: {
      ranking: [
        'forward',
        'goalie',
        'mid',
        'defense'
      ]
    },
    startingPositionIds: [],
    placementScore: 0,
    benches: []
  }
];

