import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ListPlayersComponent} from '../../players/list-players/list-players.component';

@Component({
  selector: 'app-team-attendance',
  templateUrl: './team-attendance.component.html',
  styleUrls: ['./team-attendance.component.less']
})
export class TeamAttendanceComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    public router: Router
  ) { }

  ngOnInit() {
  }

  goToLineup() {
    this.router.navigate(['/lineup']);
  }
}
