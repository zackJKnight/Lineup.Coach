import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddTeamComponent } from './teams/add-team/add-team.component';
import { TeamsClient } from './lineup-coach-api';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatButtonModule, MatListModule,
MatExpansionModule,
MatCheckboxModule,
MatCommonModule,
MatToolbarModule} from '@angular/material';
import { PeriodsModule } from './periods/periods.module';
import { TeamsModule } from './teams/teams.module';

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
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatCommonModule,
    MatToolbarModule,
    PeriodsModule,
    TeamsModule
  ],
  providers: [TeamsClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
