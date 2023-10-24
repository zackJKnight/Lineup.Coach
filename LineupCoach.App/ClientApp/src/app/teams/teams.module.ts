import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamsRoutingModule } from './teams-routing.module';
import { ListPlayersComponent } from '../players/list-players/list-players.component';
import { TeamAttendanceComponent } from './team-attendance/team-attendance.component';
import { TeamDetailComponent } from './team-detail/team-detail.component';
import { FormsModule } from '@angular/forms';
import { EditPlayerPreferencesComponent } from '../players/edit-player-preferences/edit-player-preferences.component';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatCommonModule } from '@angular/material/core';
import { MatLegacyDialogModule as MatDialogModule, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AddTeamComponent } from './add-team/add-team.component';

@NgModule({
    declarations: [
        ListPlayersComponent,
        TeamAttendanceComponent,
        AddTeamComponent,
        TeamDetailComponent,
        EditPlayerPreferencesComponent
    ],
    imports: [
        CommonModule,
        DragDropModule,
        FormsModule,
        MatCardModule,
        MatCheckboxModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        MatListModule,
        MatExpansionModule,
        MatCommonModule,
        MatToolbarModule,
        TeamsRoutingModule
    ],
    providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
    ]
})
export class TeamsModule { }
