import { Period } from '../periods/period';
import { Team } from '../teams/team';

export class Game {
  _startingPositionPerPlayerCount: number;
  _benchCount: number;
  NUMBER_OF_PERIODS: number;

  GameId: string;
  PlayDate: Date | string;
  Periods: Period[];
  BenchCount: number;
  MaxPlayersOnFieldCount: number;
  AvailablePlayerCount: number;
  Opponent: Team;
  IsHomeGame: boolean;
  RefereeName: string;
}
