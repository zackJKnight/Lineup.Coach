import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-period-lineup',
  templateUrl: './period-lineup.component.html',
  styleUrls: ['./period-lineup.component.less']
})
export class PeriodLineupComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    public router: Router
  ) {
  };

  ngOnInit() {
  };

}
