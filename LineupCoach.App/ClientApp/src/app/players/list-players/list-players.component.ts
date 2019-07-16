import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-players',
  templateUrl: './list-players.component.html',
  styleUrls: ['./list-players.component.less']
})
export class ListPlayersComponent implements OnInit {
players = [
  {
    name: 'Kid1'
  },
  {
    name: 'Kid2'
  },
  {
    name: 'Kid3'
  },
  {
    name: 'Kid4'
  }
];
  constructor() { }

  ngOnInit() {
  }

}
