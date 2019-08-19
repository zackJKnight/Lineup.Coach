import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Period } from '../period';
import { Position } from '../../positions/position';
import { Player } from 'src/app/players/player';

@Component({
  selector: 'app-period-lineup',
  templateUrl: './period-lineup.component.html',
  styleUrls: ['./period-lineup.component.less']
})
export class PeriodLineupComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    public period: Period
  ) {
  };
  ngOnInit() {
  };

}
