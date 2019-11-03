import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeamAttendanceComponent } from './teams/team-attendance/team-attendance.component';
import { PeriodLineupComponent } from './periods/period-lineup/period-lineup.component';
import { PeriodLineupResolver } from './periods/period-lineup-resolver.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/team',
    pathMatch: 'full'
  },
  {
    path: 'lineup',
    component: PeriodLineupComponent,
    resolve: {
      periods: PeriodLineupResolver
    }
    // loadChildren: () =>
    //   import('./periods/period-lineup/period-lineup.component').then(
    //     m => m.PeriodLineupComponent
    //   )
  },
  {
    path: 'team',
    component: TeamAttendanceComponent
    // loadChildren: () =>
    //   import('./teams/team-attendance/team-attendance.component').then(
    //     m => m.TeamAttendanceComponent
    //   )
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
