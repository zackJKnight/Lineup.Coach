import { TestBed } from '@angular/core/testing';

import { PeriodService } from './period.service';
import { Player } from '../players/player';
import { PlayerService } from '../players/player.service';

describe('PeriodService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PeriodService = TestBed.get(PeriodService);
    expect(service).toBeTruthy();
  });

  it('should be truthy when player is placed in a given period', () => {
    const service: PeriodService = TestBed.get(PeriodService);
    //service.getPeriods.
    const player : Player = {};
    expect(service.playerIsStartingThisPeriod(1, player));
  });
});
