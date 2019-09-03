import { Component, OnInit, Input } from '@angular/core';
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

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private gameService: GameService,
    private playerService: PlayerService
  ) {
  }

  ngOnInit() {
    this.players = this.playerService.getPlayers();
    this.setLineup();
  }

  setLineup() {
    this.periods = this.gameService.generateLineup(this.players);
  }

}
