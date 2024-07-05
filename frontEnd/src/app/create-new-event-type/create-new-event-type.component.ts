import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { APIService } from '../api.service';


@Component({
  selector: 'app-create-new-event-type',
  templateUrl: './create-new-event-type.component.html',
  styleUrl: './create-new-event-type.component.css'
})
export class CreateNewEventTypeComponent {
  loggedInName = localStorage.getItem("userLoggedInName" || "")
  eventType = localStorage.getItem("evType")
  showWarning = false
  inputText = ''
  hours = 0
  minutes = 30
  inviteesPerEvent: number = 2
  showEnterInviteesWarning = false
  displayRemainingSpots = false

  loggedInEmailId = localStorage.getItem("emailID" || "")

  constructor(private route: ActivatedRoute, private router: Router, private apiService: APIService) { }

  continueFunctn() {
    console.log("continueFunctn called ", this.inputText, this.hours, this.minutes);

    if(!this.hours){
      this.hours = 0
    }
    if(!this.minutes){
      this.minutes=0
    }
    if (!this.inputText) {
      this.showWarning = true
      console.log("inputText not given");
      console.log("can't go ahead since evName not given");
    }
    else {
      let showingWarnings = false
      if (this.eventType == 'Group') {
        if (!this.inviteesPerEvent) {
          this.showEnterInviteesWarning = true
          console.log("since invitees not added");
          console.log("can't go ahead since inviteesPerEvent not given");
          showingWarnings = true
        }
        else if (this.inviteesPerEvent < 2) {
          console.log("cant go ahead since invitees less than 2");
          showingWarnings = true
        }
      }
      if (showingWarnings == false) {
        this.showWarning = false
        console.log("not showing warnings");
        if (!this.hours) {
          this.hours = 0
        }
        if (!this.minutes && !this.hours) {
          this.minutes = 30
        }
        let location = "Google Meet"

        console.log("in else statement ", this.inputText, this.hours, this.minutes);
        // evName, evType, evDuration, evLocation

        localStorage.setItem("evName", this.inputText)
        localStorage.setItem("evDurHrs", this.hours.toString())
        localStorage.setItem("evDurMins", this.minutes.toString())

        this.apiService.createNewEvent(this.inputText, this.hours.toString(), this.minutes.toString(), location, this.inviteesPerEvent, this.displayRemainingSpots)
      }

    }
  }

  callOnChange() {
    console.log("change");
  }


}
