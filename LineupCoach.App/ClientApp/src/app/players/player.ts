import { Position } from '../positions/position';
export interface Player {
  id: number;
  firstName: string;
  lastName: string;
  isPresent?: boolean;
  positionPreferenceRank: {
    ranking: string[];
  };
  startingPositions: Position[];
  placementScore: number;
  benches: Position[];
}
