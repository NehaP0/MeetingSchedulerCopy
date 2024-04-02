import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { APIService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-make-meeting-admin',
  templateUrl: './make-meeting-admin.component.html',
  styleUrl: './make-meeting-admin.component.css'
})
export class MakeMeetingAdminComponent implements OnInit {

  constructor(private apiService: APIService, private router: Router) { }

  ngOnInit() { }

  nameWhoseCalendar = localStorage.getItem("selectedUserName")
  evName = localStorage.getItem("selectedEventName")  
  evType = localStorage.getItem("evType")  
  evDurHrs = localStorage.getItem("evDurHrs")
  evDurMins = localStorage.getItem("evDurMins")
  startTime = localStorage.getItem("oneTime")
  endTime = localStorage.getItem("endTime")
  day = localStorage.getItem("day")
  month = localStorage.getItem("month")
  date = localStorage.getItem("date")

  loading = false

  selectedUserEmail = localStorage.getItem("selectedUserEmail")

  nameBlank = false
  emailBlank = false
  addGuests = false







  addguests() {
    this.addGuests = true
  }

  formSubmit(userForm: NgForm) {


    this.loading = true

    console.log("from submitted");

    console.log("userForm ", userForm.value.Name, userForm.value.Email, userForm.value.additional);
    if (userForm.value.Name == "") {
      this.nameBlank = true
    }
    if (userForm.value.Email == "") {
      this.emailBlank = true
    }
    else {
      let otherEmails = []
      console.log("Guests ", userForm.value.Guests);
      if (userForm.value.Guests) {
        let otherEmailsString = userForm.value.Guests
        otherEmails = otherEmailsString.split(/,| /) //splits wherever there is comma or space
        // console.log("should include space and comma",otherEmails);
        // console.log(otherEmails[1]);    
      }

      let body = {
        "title": this.evName,
        "start": `${this.date}T${this.startTime}`,
        "end": `${this.date}T${this.endTime}`,
        "user": userForm.value.Name,
        "userEmail": userForm.value.Email,
        "otherEmails": otherEmails,
        "additionalInfo": userForm.value.additional,
        "evType": this.evType,
        "selectedUserEmail": this.selectedUserEmail  
      }
      this.apiService.scheduleMeetByAdminPage(body).subscribe((response) => {
        console.log(response);
        this.loading = false
        alert(response['message'])
        this.router.navigate(['/meetingsCalendarAdmin'])
      })
      // this.apiService.scheduleMeetBymakeMeetingPage(meet)

    }
  }
}
