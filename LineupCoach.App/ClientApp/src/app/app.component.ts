import { Component } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AddTeamComponent } from './teams/add-team/add-team.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'Lineup';
  constructor(
    private route: ActivatedRoute,
    public router: Router
  ) {}

}
