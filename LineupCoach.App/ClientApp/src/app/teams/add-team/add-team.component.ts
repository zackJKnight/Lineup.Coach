import { Component, OnInit } from '@angular/core';
import { Team } from '../team';
import { TeamsClient, CreateTeamCommand} from '../../lineup-coach-api';

@Component({
  selector: 'app-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.less']
})
export class AddTeamComponent implements OnInit {
team = new Team();
client: TeamsClient;
command: CreateTeamCommand;

  constructor(client: TeamsClient) {
    this.client = client;
  }

  ngOnInit() {
  }

  addName(name: string) {
    if (name) {
      this.team.name = name;
    }
  }

  onSave() {
    this.command.name = this.team.name;
    this.client.create(this.command);
    this.team = null;
    this.team = new Team();
  }
}
