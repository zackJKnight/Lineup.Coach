import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddTeamComponent } from './teams/add-team/add-team.component';
import { TeamsClient } from './lineup-coach-api';
import { GameService } from './games/game.service';
import { PlayerService } from './players/player.service';
import { FormsModule } from '@angular/forms';
import { MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatListModule,
  MatExpansionModule,
  MatCommonModule,
  MatToolbarModule} from '@angular/material';
import { PeriodsModule } from './periods/periods.module';
import { TeamsModule } from './teams/teams.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { PeriodLineupResolver } from './periods/period-lineup-resolver.service';
import { TeamService } from './teams/team.service';
@NgModule({
  declarations: [
    AppComponent,
    AddTeamComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatExpansionModule,
    MatCommonModule,
    MatToolbarModule,
    PeriodsModule,
    TeamsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
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
export class AppModule { }
