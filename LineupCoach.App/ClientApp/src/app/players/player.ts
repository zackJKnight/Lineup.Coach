import { Position } from '../positions/position';
export interface Player {
  firstName: string;
  lastName: string;
  isPresent: boolean;
  positionPreferenceRank: {
    ranking: {};
  };
  startingPositions: Position[];
  placementScore: number;
  benches: Position[];
}
