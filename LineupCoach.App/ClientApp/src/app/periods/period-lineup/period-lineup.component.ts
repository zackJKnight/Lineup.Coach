import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GameService } from '../../games/game.service';
import { PlayerService } from '../../players/player.service';
import { Player } from 'src/app/players/player';
import { Period } from '../period';

@Component({
  selector: 'app-period-lineup',
  templateUrl: './period-lineup.component.html',
  styleUrls: ['./period-lineup.component.less']
})
export class PeriodLineupComponent implements OnInit {

  public periods: Period[];

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private gameService: GameService,
    private playerService: PlayerService
  ) {
  }

  ngOnInit() {
    let players: Player[];
    players = this.playerService.getPlayers();
    this.periods = this.gameService.generateLineup(players);
  }

}
