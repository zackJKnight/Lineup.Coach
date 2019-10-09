import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../player.service';
import { Player } from '../player';
import { ActivatedRoute } from '@angular/router';
import { EditPlayerPreferencesComponent } from '../edit-player-preferences/edit-player-preferences.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-list-players',
  templateUrl: './list-players.component.html',
  styleUrls: ['./list-players.component.less']
})

export class ListPlayersComponent implements OnInit{
  public players: Player[];

  constructor(
    private playerService: PlayerService,
    private route: ActivatedRoute,
    public dialog: MatDialog
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

  openDialog(player: Player): void {
    const dialogRef = this.dialog.open(EditPlayerPreferencesComponent, {
      width: '450px',
      data: {player}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`The dialog was closed with result: ${result}`);
      // this.players = result;
    });
  }
}
