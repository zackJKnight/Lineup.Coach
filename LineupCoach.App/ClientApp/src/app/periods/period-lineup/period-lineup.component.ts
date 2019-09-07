import { Component, HostListener, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GameService } from '../../games/game.service';
import { PlayerService } from '../../players/player.service';
import { Player } from 'src/app/players/player';
import { Period } from '../period';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-period-lineup',
  templateUrl: './period-lineup.component.html',
  styleUrls: ['./period-lineup.component.less']
})
export class PeriodLineupComponent implements OnInit {
  displayedColumns = ['name', 'player', 'score'];
  public periods: Observable<Period[]>;
  players: Player[];
  public backButtonPressed: boolean;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private gameService: GameService,
    private playerService: PlayerService
  ) {
  }

  ngOnInit() {
    this.players = this.playerService.getPresentPlayers();
    this.setLineup();
  }

  setLineup() {
    this.periods = this.gameService.generateLineup(this.players);
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    console.log('Back button pressed');
    this.periods.forEach(item => item = []);
    this.backButtonPressed = true;
  }

}
