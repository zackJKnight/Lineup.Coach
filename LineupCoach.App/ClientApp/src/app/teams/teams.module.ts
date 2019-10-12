import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamsRoutingModule } from './teams-routing.module';
import { ListPlayersComponent } from '../players/list-players/list-players.component';
import { TeamAttendanceComponent } from './team-attendance/team-attendance.component';
import { TeamDetailComponent } from './team-detail/team-detail.component';
import { FormsModule } from '@angular/forms';
import { EditPlayerPreferencesComponent } from '../players/edit-player-preferences/edit-player-preferences.component';
import {
  MatCommonModule,
  MatCardModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatCheckboxModule,
  MatButtonModule,
  MatListModule,
  MatExpansionModule,
  MatToolbarModule,
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    ListPlayersComponent,
    TeamAttendanceComponent,
    TeamDetailComponent,
    EditPlayerPreferencesComponent
  ],
  imports: [
    CommonModule,
    DragDropModule,
    FormsModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatExpansionModule,
    MatCommonModule,
    MatToolbarModule,
    TeamsRoutingModule
  ],
  entryComponents: [
    EditPlayerPreferencesComponent
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
     { provide: MatDialogRef, useValue: {} }
  ]
})
export class TeamsModule { }
