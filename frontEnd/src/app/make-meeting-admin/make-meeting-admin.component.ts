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


  nameWhoseCalendar = localStorage.getItem("selectedUserName")
  selectedUserEmail = localStorage.getItem("selectedUserEmail")
  evName = localStorage.getItem("selectedEventName")
  evType = localStorage.getItem("evType")
  evId = localStorage.getItem('selectedEventId' || "")
  evDurHrs = localStorage.getItem("evDurHrs")
  evDurMins = localStorage.getItem("evDurMins")
  startTime = localStorage.getItem("oneTime")
  endTime = localStorage.getItem("endTime")
  day = localStorage.getItem("day")
  month = localStorage.getItem("month")
  date = localStorage.getItem("date")

  loading = false


  nameBlank = false
  emailBlank = false
  addGuests = false

  allowInviteesToAddGuests;
  questionsToBeAsked = []
  questionsWdAnswers = []

  oneOnOne = false;
  wait = false
  showWarning = false
  reqEventObj = {}


  ngOnInit() {
    if (this.evType == 'One-on-One') {
      this.oneOnOne = true;
    }



    this.apiService.getSelectedEvent(this.evId, this.selectedUserEmail)
    this.apiService.reqEvent$.subscribe((reqEventObj) => {
      this.reqEventObj = reqEventObj
      console.log("reqEventObj ", reqEventObj);

      if (Object.keys(reqEventObj).length > 0) {
        this.questionsToBeAsked = reqEventObj["questionsToBeAsked"]
        this.allowInviteesToAddGuests = reqEventObj["allowInviteesToAddGuests"]
        console.log("this.questionsToBeAsked ", this.questionsToBeAsked);
        this.questionsWdAnswers = reqEventObj["questionsToBeAsked"]
        this.questionsWdAnswers.forEach((obj) => {
          return obj["answer"] = ""
        })
        console.log("this.questionsWdAnswers ", this.questionsWdAnswers);

      }
    })
  }



  addguests() {
    this.addGuests = true
  }

  formSubmit(userForm: NgForm) {

    console.log('from submitted');
    console.log("wait before validation ", this.wait);
    let reqQuestionFieldsNotFilled = false    

    for (let i = 0; i < this.questionsWdAnswers.length; i++) {
      let obj = this.questionsWdAnswers[i]
      if (obj.answerRequiredOrNot && !obj.answer) {
        reqQuestionFieldsNotFilled = true
      }
    }

    console.log("reqQuestionFieldsNotFilled ", reqQuestionFieldsNotFilled);



    console.log(
      'userForm ',
      userForm.value.Name,
      userForm.value.Email,
      userForm.value.additional
    );


    console.log("from submitted");

    console.log("userForm ", userForm.value.Name, userForm.value.Email, userForm.value.additional);
    if (userForm.value.Name == "") {
      this.nameBlank = true
    }
    if (userForm.value.Email == "") {
      this.emailBlank = true
    }
    if (reqQuestionFieldsNotFilled == true) {
      this.showWarning = true
    }
    else {
      if (!reqQuestionFieldsNotFilled) {
        this.loading = true
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
          "questionsWdAnswers": this.questionsWdAnswers,
          "selectedUserEmail": this.selectedUserEmail
        }

        this.wait = true
        console.log("wait after validation ", this.wait);

        this.apiService.scheduleMeetByAdminPage(body).subscribe((response) => {
          console.log(response);
          this.loading = false
          this.wait = false

          alert(response['message'])
          this.router.navigate(['/meetingsCalendarAdmin'])
        })
      }
    }
  }
}
