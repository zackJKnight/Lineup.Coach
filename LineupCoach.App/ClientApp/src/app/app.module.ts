import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TeamsClient } from './lineup-coach-api';
import { GameService } from './games/game.service';
import { PlayerService } from './players/player.service';
import { FormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatListModule,
  MatExpansionModule,
  MatCommonModule,
  MatToolbarModule,
  MatIconModule
} from '@angular/material';
import { PeriodsModule } from './periods/periods.module';
import { TeamsModule } from './teams/teams.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { PeriodLineupResolver } from './periods/period-lineup-resolver.service';
import { TeamService } from './teams/team.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DragDropModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatExpansionModule,
    MatCommonModule,
    MatToolbarModule,
    PeriodsModule,
    TeamsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    })
  ],
  providers: [
    TeamsClient,
    GameService,
    PlayerService,
    PeriodLineupResolver,
    TeamService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
