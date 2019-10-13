import { Component, OnInit, Inject } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Player } from '../player';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-player-preferences',
  templateUrl: './edit-player-preferences.component.html',
  styleUrls: ['./edit-player-preferences.component.scss']
})

export class EditPlayerPreferencesComponent implements OnInit {

  public player: Player;
  public positions;
  constructor(
    public dialogRef: MatDialogRef<EditPlayerPreferencesComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.player = this.data.player;
    this.positions = [...new Set(this.data.positions.map(pos => pos.name))];
    if (this.player.positionPreferenceRank.ranking.length === this.positions.length) {
      this.positions = this.player.positionPreferenceRank.ranking;
    }
  }

  ngOnInit() {
  }

  public drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.positions, event.previousIndex, event.currentIndex);
    // Todo check whether map preserves order...
    this.player.positionPreferenceRank.ranking = this.positions; // .map(position => position.name);
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

  public onOKClick() {
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
