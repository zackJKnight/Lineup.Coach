import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { PlayerService } from '../../players/player.service';
import { ListPlayersComponent } from '../../players/list-players/list-players.component';
import { GameService } from '../../games/game.service';

@Component({
  selector: 'app-team-attendance',
  templateUrl: './team-attendance.component.html',
  styleUrls: ['./team-attendance.component.less']
})
export class TeamAttendanceComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    // private gameService: GameService,
    // private playerService: PlayerService,
    private listPlayersComponent: ListPlayersComponent
  ) { }

  ngOnInit() {
  }

  goToLineup() {
    // this.gameService.generateLineup(this.playerService.getPlayerList());
    this.router.navigate(['/lineup']);
  }
}
