import { Component, OnInit, Input, Inject } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Position } from '../../positions/position';
import { Player } from '../player';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-edit-player-preferences',
  templateUrl: './edit-player-preferences.component.html',
  styleUrls: ['./edit-player-preferences.component.scss']
})

export class EditPlayerPreferencesComponent implements OnInit {
  public positions = ['goalie', 'defense', 'mid', 'forward'];
  @Input() player: Player;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ['goalie', 'defense', 'mid', 'forward']
  ) { }

ngOnInit() {
}

  public drop(event: CdkDragDrop<Position[]>) {
  moveItemInArray(this.positions, event.previousIndex, event.currentIndex);
  this.player.positionPreferenceRank.ranking = this.positions;
  }

  public addFirst(first: string) {
  if (first) {
    this.player.firstName = first;
  }
}

  public addLast(last: string) {
  if (last) {
    this.player.lastName = last;
  }
}

  public onSave() {
  this.player = null;
}

onNoClick(): void {
  // this.dialogRef.close();
}

}
