import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PeriodLineupComponent } from './period-lineup/period-lineup.component';


const routes: Routes = [
  {path: 'lineup', component: PeriodLineupComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeriodsRoutingModule { }
