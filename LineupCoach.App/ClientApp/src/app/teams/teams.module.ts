import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamsRoutingModule } from './teams-routing.module';
import { ListPlayersComponent } from '../players/list-players/list-players.component';
import { TeamAttendanceComponent } from './team-attendance/team-attendance.component';
import { FormsModule } from '@angular/forms';
import {
  MatCommonModule,
  MatFormFieldModule,
  MatInputModule,
  MatCheckboxModule,
  MatButtonModule,
  MatListModule,
  MatExpansionModule,
  MatToolbarModule
} from '@angular/material';

@NgModule({
  declarations: [
    ListPlayersComponent,
    TeamAttendanceComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatExpansionModule,
    MatCommonModule,
    MatToolbarModule,
    TeamsRoutingModule
  ]
})
export class TeamsModule { }
