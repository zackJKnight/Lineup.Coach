import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeamAttendanceComponent } from './team-attendance/team-attendance.component';


const routes: Routes = [
  {path: 'team', component: TeamAttendanceComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamsRoutingModule { }
