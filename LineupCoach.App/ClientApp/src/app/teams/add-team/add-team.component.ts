import { Component, OnInit } from '@angular/core';
import { TeamsClient, TeamsListViewModel} from '../../lineup-coach-api';
@Component({
  selector: 'app-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.less']
})
export class AddTeamComponent implements OnInit {
teamsListVM: TeamsListViewModel = new TeamsListViewModel();
  constructor(client: TeamsClient) {
    client.getAll().subscribe(result => {
      this.teamsListVM = result;
    }, error => console.error(error));
  }

  ngOnInit() {
  }

}
