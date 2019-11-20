import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Team } from '../team';

@Component({
  selector: 'app-team-attendance',
  templateUrl: './team-attendance.component.html',
  styleUrls: ['./team-attendance.component.less']
})
export class TeamAttendanceComponent implements OnInit {
public team: Team;
  constructor(
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit() {
    this.team = new Team();
    this.team.name = 'My Team';

  }

  goToLineup() {
    this.router.navigate(['/lineup']);
  }
}
