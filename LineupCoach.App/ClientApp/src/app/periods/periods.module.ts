import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCommonModule,
  MatTableModule,
MatChipsModule } from '@angular/material';
import { PeriodsRoutingModule } from './periods-routing.module';
import { PeriodLineupComponent } from './period-lineup/period-lineup.component';


@NgModule({
  declarations: [
    PeriodLineupComponent
  ],
  imports: [
    CommonModule,
    PeriodsRoutingModule,
    MatCommonModule,
    MatTableModule,
    MatChipsModule
  ]
})
export class PeriodsModule { }
