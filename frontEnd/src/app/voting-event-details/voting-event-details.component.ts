import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { APIService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-voting-event-details',
  templateUrl: './voting-event-details.component.html',
  styleUrl: './voting-event-details.component.css',
})
export class VotingEventDetailsComponent {
  token = localStorage.getItem('token')
  loggedInName = localStorage.getItem('userLoggedInName');
  selectedDuration = localStorage.getItem('selectedDuration');
  meetingName = 'Meeting';
  reserveTimes = false;
  votesCheckBox = true;


  constructor(
    private apiService: APIService,
    private router: Router
  ) {}

  ngOnInit() {

    if(!this.token){
      this.router.navigate(['/login']);
    }
  }

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
    console.log("selectedDuration ", this.selectedDuration);
    
        
    this.apiService.updatePollDetails(this.meetingName, this.reserveTimes, this.votesCheckBox, this.selectedDuration)
    
  }
}
