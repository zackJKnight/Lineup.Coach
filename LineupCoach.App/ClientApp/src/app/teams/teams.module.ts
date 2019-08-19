import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamsRoutingModule } from './teams-routing.module';
import { TeamAttendanceComponent } from './team-attendance/team-attendance.component';
import { ListPlayersComponent } from '../players/list-players/list-players.component';
// import { ListPlayersResolver } from '../players/list-players/list-players-resolver.service';
import { MatFormFieldModule, MatInputModule, MatButtonModule, MatListModule,
  MatExpansionModule,
  MatCheckboxModule,
  MatCommonModule,
  MatToolbarModule} from '@angular/material';
// import { PlayerService } from '../players/player.service';

@NgModule({
  declarations: [
    TeamAttendanceComponent,
    ListPlayersComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatCommonModule,
    MatToolbarModule,
    TeamsRoutingModule
  ],
  providers: [
    // PlayerService
   // ListPlayersResolver
   ]
})
export class TeamsModule { }
