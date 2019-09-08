import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../player.service';
import { Player } from '../player';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list-players',
  templateUrl: './list-players.component.html',
  styleUrls: ['./list-players.component.less']
})

export class ListPlayersComponent implements OnInit{
  public players: Player[];

  constructor(
    private playerService: PlayerService,
    private route: ActivatedRoute
  ) {
  }
  ngOnInit(
  ) {
    this.playerService.getPlayers()
    .subscribe(players => {
      this.players = players;
    });
  }

  onCheckboxChecked(event, element) {

    console.log(JSON.stringify(this.players));
    this.playerService.savePlayers(this.players);
  }
}
