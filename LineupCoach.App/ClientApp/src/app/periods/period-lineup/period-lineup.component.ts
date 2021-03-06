import { Component, HostListener, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GameService } from '../../games/game.service';
import { PlayerService } from '../../players/player.service';
import { Player } from 'src/app/players/player';
import { Period } from '../period';
import { Position } from '../../positions/position';
import { Observable } from 'rxjs';
import { PeriodService } from '../period.service';

@Component({
  selector: 'app-period-lineup',
  templateUrl: './period-lineup.component.html',
  styleUrls: ['./period-lineup.component.less']
})
export class PeriodLineupComponent implements OnInit {
  displayedColumns = [];
  public periods: Period[];
  public positions: Position[];
  public players: Player[];
  public backButtonPressed: boolean;

  constructor(
    private playerService: PlayerService,
    private periodService: PeriodService,
    private route: ActivatedRoute,
    public router: Router,
  ) {
  }

  ngOnInit() {
    this.periods = this.route.snapshot.data.periods;
    this.positions = this.periods.sort(period => period.periodNumber)
    .reduce((pos, period) => [...pos, ...period.positions], []);
    this.displayedColumns.push(`name`);
    this.displayedColumns.push(`player`);
}

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    console.log('Back button pressed');
    this.periods = [];
    this.players = [];
    this.periodService.resetPositions();
    this.playerService.removeStartingPositions();
    this.playerService.removeBenchPositions();
    this.playerService.resetPlayerAttendance();
    this.route = new ActivatedRoute();
    this.backButtonPressed = true;
  }

}
