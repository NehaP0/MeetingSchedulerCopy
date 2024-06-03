import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { APIService } from '../api.service';


@Component({
  selector: 'app-voting-event-details',
  templateUrl: './voting-event-details.component.html',
  styleUrl: './voting-event-details.component.css',
})
export class VotingEventDetailsComponent {
  loggedInName = localStorage.getItem('userLoggedInName');
  selectedDuration = localStorage.getItem('selectedDuration');
  meetingName = 'Meeting';
  reserveTimes = false;
  votesCheckBox = true;


  constructor(
    private apiService: APIService,
  ) {}

  changeReserveCheckBox() {
    this.reserveTimes = !this.reserveTimes;
    console.log('this.reserveTimes ', this.reserveTimes);
  }

  changeVoteCheckBox() {
    this.votesCheckBox = !this.votesCheckBox;
    console.log('this.votesCheckBox ', this.votesCheckBox);
  }

  shareMeetingPollBtn(){
    console.log("meetingName ", this.meetingName);
    console.log("reserveTimes ", this.reserveTimes);
    console.log("votesCheckBox ", this.votesCheckBox);
        
    this.apiService.updatePollDetails(this.meetingName, this.reserveTimes, this.votesCheckBox)
    
  }
}
