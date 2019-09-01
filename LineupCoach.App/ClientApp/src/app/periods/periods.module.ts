import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PeriodsRoutingModule } from './periods-routing.module';
import { PeriodLineupComponent } from './period-lineup/period-lineup.component';


@NgModule({
  declarations: [
    PeriodLineupComponent
  ],
  imports: [
    CommonModule,
    PeriodsRoutingModule
  ]
})
export class PeriodsModule { }