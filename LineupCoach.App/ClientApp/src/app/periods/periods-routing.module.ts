import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PeriodLineupComponent } from './period-lineup/period-lineup.component';
import { PeriodLineupResolver } from './period-lineup-resolver.service';


const routes: Routes = [
  {path: 'lineup', component: PeriodLineupComponent, resolve:
{ periods: PeriodLineupResolver}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeriodsRoutingModule { }
