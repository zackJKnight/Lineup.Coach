import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../player.service';
import { Player } from '../player';
import { ActivatedRoute } from '@angular/router';
import { EditPlayerPreferencesComponent } from '../edit-player-preferences/edit-player-preferences.component';
import { MatDialog, MatIconRegistry } from '@angular/material';
import { TeamService } from 'src/app/teams/team.service';
import { Position } from 'src/app/positions/position';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-list-players',
  templateUrl: './list-players.component.html',
  styleUrls: ['./list-players.component.less']
})

export class ListPlayersComponent implements OnInit {
  public players: Player[];
  public positions: Position[];
  constructor(
    private playerService: PlayerService,
    private teamService: TeamService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    iconRegistry: MatIconRegistry, sanitizer: DomSanitizer
  ) {
  }
  ngOnInit(
  ) {
    this.playerService.getPlayers()
    .subscribe(players => {
      this.players = players;
    });
    this.positions = this.teamService.getPositions();
  }

  onCheckboxChecked(event, element) {

    // console.log(`${JSON.stringify(element)}`);
    this.playerService.savePlayers(this.players);
  }

  openDialog(player: Player, positions: Position[]): void {
    const dialogRef = this.dialog.open(EditPlayerPreferencesComponent, {
      data: {
        player,
        positions
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`The dialog was closed with result: ${result}`);
      this.players[result.player] = result.player;
      this.playerService.savePlayers(this.players);
    });
  }
}
