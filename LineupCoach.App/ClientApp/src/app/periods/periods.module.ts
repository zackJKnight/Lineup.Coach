import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatCommonModule } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
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
    MatBadgeModule,
    MatGridListModule,
    MatTableModule,
    MatChipsModule
  ]
})
export class PeriodsModule { }
