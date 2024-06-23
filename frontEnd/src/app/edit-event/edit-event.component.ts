import { Component, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../api.service';
import { FormsModule, NgForm } from '@angular/forms';


@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrl: './edit-event.component.css'
})
export class EditEventComponent {

  loggedInName = localStorage.getItem("userLoggedInName" || "")
  eventN = localStorage.getItem("eventName")
  evT = localStorage.getItem("evType")
  evDurMins = Number(localStorage.getItem("evDurMins"))
  evDurHrs = Number(localStorage.getItem("evDurHrs"))
  eventLocation = localStorage.getItem("eventLocation")
  evId = localStorage.getItem("evId")
  usersId = localStorage.getItem('usersUniqueID' || '')


  allowInviteesToAddGuestsStr = localStorage.getItem("allowInviteesToAddGuests")
  allowInviteesToAddGuests: Boolean
  surnameReqStr = localStorage.getItem("surnameReq")
  surnameReq: Boolean
  questions = localStorage.getItem("questionsToBeAsked")
  questionsToBeAsked = JSON.parse(this.questions)

  eventLink = this.eventN
  customisedLink = ""
  showWarning = false
  showTimeWarning = false
  showWarningToAddQuestion = false
  questionInput = ""
  required = false
  selectedValue = "Name"
  editedQuestion = false

  loggedInEmailId = localStorage.getItem("emailID" || "")

  descriptionText = ""

  showEventDetailsSlider = false
  showHostsAndInviteesSlider = false
  bookingPageSlider = false
  allowInviteesCheckedOrNot = true

  popUpToAddNewQuestion = false
  status = true
  makeBlur = false

  showEditOptionForNameEmail = false
  openNameQuestionPopUp = false
  showEditOptionForInvitees = false
  showEditOptionForQuestion = false
  showEditOptionForQuestionId = ''

  constructor(private route: ActivatedRoute, private router: Router, private apiService: APIService) { }

  ngOnInit() {
    if (this.eventLink.includes(" ")) {
      this.eventLink = this.eventLink.replace(/ /g, "-"); //g means global, i.e all spaces in string wioll be replaced with -
    }

    if (this.allowInviteesToAddGuestsStr == "true") {//because in localStorage, everything is stored in string format, so we convert it to boolean
      this.allowInviteesToAddGuests = true
    }
    else if (this.allowInviteesToAddGuestsStr == "false") {
      this.allowInviteesToAddGuests = false
    }

    if (this.surnameReqStr == "true") {//because in localStorage, everything is stored in string format, so we convert it to boolean
      this.surnameReq = true
    }
    else if (this.surnameReqStr == "false") {
      this.surnameReq = false
    }
  }


  continueEditFunctn() {
    console.log("continueEditFunctn called ", this.eventN, this.evDurHrs, this.evDurMins);

    if (!this.eventN) {
      this.showWarning = true
      console.log("Event Name not given");
    }
    if (this.evDurHrs == 0 && this.evDurMins == 0) {
      this.showTimeWarning = true
    }
    else {
      this.showWarning = false
      this.showTimeWarning = false

      // console.log("eventN ", eventN);
      // console.log("hrs ",evDurHrs);
      // console.log("min ", min);    

      // if(!this.evDurHrs){
      //  this.evDurHrs = 0
      // }
      // if(!this.evDurMins && !this.evDurHrs){
      //   this.evDurMins = 30
      // }
      let location = "Google Meet"

      console.log("in else statement ", this.eventN, this.evDurHrs, this.evDurMins);
      // evName, evType, evDuration, evLocation

      console.log("input text ", this.descriptionText);


      this.apiService.editEvent(this.evId, this.eventN, this.evDurHrs, this.evDurMins, location, this.evT, this.descriptionText)
      setTimeout(()=>{
        this.showEventDetailsSlider = false
      },1000)
    }
  }

  callOnChange() {
    console.log("change");
  }

  turnOnShowEventDetailsSlider() {
    this.showEventDetailsSlider = true
  }

  goBack() {
    this.showEventDetailsSlider = false
    this.showHostsAndInviteesSlider = false
    this.bookingPageSlider = false
    
  }

  turnOnShowHostsAndInviteesSlider() {
    this.showHostsAndInviteesSlider = true
  }

  turnOnBookingPageSlider() {
    this.bookingPageSlider = true
  }


  checkBoxChanged() {
    this.allowInviteesCheckedOrNot = !this.allowInviteesCheckedOrNot
    console.log("allowInviteesCheckedOrNot ", this.allowInviteesCheckedOrNot);
  }


  // continueEditFunctn(){
  //   console.log("continueEditFunctn called ",this.eventN,this.evDurHrs, this.evDurMins);

  //   if(!this.eventN){
  //     this.showWarning = true
  //     console.log("Event Name not given");      
  //   }
  //   if(this.evDurHrs==0 && this.evDurMins==0){
  //     this.showTimeWarning = true      
  //   }
  //   else{
  //     this.showWarning = false
  //     this.showTimeWarning = false

  //     // console.log("eventN ", eventN);
  //     // console.log("hrs ",evDurHrs);
  //     // console.log("min ", min);    

  //     // if(!this.evDurHrs){
  //     //  this.evDurHrs = 0
  //     // }
  //     // if(!this.evDurMins && !this.evDurHrs){
  //     //   this.evDurMins = 30
  //     // }
  //     let location = "Google Meet"

  //     console.log("in else statement ", this.eventN,this.evDurHrs, this.evDurMins);
  //     // evName, evType, evDuration, evLocation

  //     console.log("input text ", this.descriptionText);


  //     this.apiService.editEvent(this.evId, this.eventN, this.evDurHrs, this.evDurMins, location, this.evT, this.descriptionText)      

  //   }    
  // }

  continueInviteesFunctn() {
    console.log("continueInviteesFunctn called ");
    console.log("evId ", this.evId, "allowInviteesCheckedOrNot ", this.allowInviteesCheckedOrNot);
    this.apiService.editEventIfUserCanAddGuests(this.evId, this.allowInviteesCheckedOrNot)
  }

  openAddNewQuest() {
    this.showEditOptionForQuestion = false
    this.popUpToAddNewQuestion = true
    this.makeBlur = true

    if (!this.editedQuestion) {
      this.required = false
      this.status = true
    }

    console.log("popUpToAddNewQuestion ", this.popUpToAddNewQuestion);
  }

  closeAddNewQuest() {
    this.popUpToAddNewQuestion = false
    this.makeBlur = false
    this.showEditOptionForQuestion = false
    this.editedQuestion = false
    this.questionInput = ""
    this.showEditOptionForQuestionId = ""
  }

  typingQuestionInput() {
    console.log("i am being called");

    if (this.questionInput != "") {
      this.showWarningToAddQuestion = false
    }
  }

  doneClickedOfNewQuestionPopUp() {
    if (this.questionInput == "") {
      this.showWarningToAddQuestion = true
    }
    else {
      this.popUpToAddNewQuestion = false
      this.makeBlur = false

      console.log("this.required ", this.required);
      console.log("this.status ", this.status);
      console.log("this.questionInput ", this.questionInput);



      if (!this.editedQuestion) {
        let questionObj = {
          question: this.questionInput,
          answerRequiredOrNot: this.required,
          showThisQuestionOrNot: this.status,
          _id: (Math.floor(Math.random() * 10000000000000001).toString()),
        }
        this.questionsToBeAsked.push(questionObj)
      }
      else {
        // this.showEditOptionForQuestionId
        // this.questionsToBeAsked.find((questionObj)=>{
        //   questionObj._id == this.showEditOptionForQuestionId
        //   questionObj.question = this.questionInput
        //   questionObj.answerRequiredOrNot = this.required 
        //   questionObj.showThisQuestionOrNot = this.status
        // })


        let id = ''

        const index = this.questionsToBeAsked.findIndex((questionObj) => {
          id = questionObj._id
          return questionObj._id == this.showEditOptionForQuestionId
        }
        );

        // If the object is found, delete it
        if (index !== -1) {
          this.questionsToBeAsked.splice(index, 1);
        }

        let questionObj = {
          question: this.questionInput,
          answerRequiredOrNot: this.required,
          showThisQuestionOrNot: this.status,
          _id: id,
        }
        this.questionsToBeAsked.push(questionObj)
      }

      this.editedQuestion = false
      this.questionInput = ""
      this.showEditOptionForQuestionId = ""
      this.showEditOptionForQuestion = false

      console.log("this.questionsToBeAsked ", this.questionsToBeAsked);


      console.log("this.showEditOptionForQuestion ", this.showEditOptionForQuestion,
        "this.showEditOptionForQuestionId ", this.showEditOptionForQuestionId,
        "this.questionInput ", this.questionInput,
        "this.editedQuestion ", this.editedQuestion,
        "this.showEditOptionForQuestionId ", this.editedQuestion,
        "this.questionInput ", this.editedQuestion,
        "this.editedQuestion ", this.editedQuestion)

      // this.apiService.addQuestionToMeeting(this.questionInput, this.required, this.status, this.loggedInEmailId, this.evId)
    }
  }

  editNameEmail() {
    console.log("surNameReq ", this.surnameReq);
    this.showEditOptionForNameEmail = !this.showEditOptionForNameEmail
  }

  openEditNameQuestionPopUp() {
    this.openNameQuestionPopUp = true
    this.showEditOptionForNameEmail = false
    this.makeBlur = true

  }

  closeEditNameQuestionPopUp() {
    this.openNameQuestionPopUp = false
    this.makeBlur = false
  }

  NameSelected() {
    console.log("selected Value", this.selectedValue);
    if (this.selectedValue == "First Name, Last Name") {
      this.surnameReq = true
    }
  }


  editInvitees() {
    this.showEditOptionForInvitees = !this.showEditOptionForInvitees
  }

  allowInviteesChanged() {
    this.allowInviteesToAddGuests = !this.allowInviteesToAddGuests
  }


  editQuestion(questionId, question) {
    // this.popUpToAddNewQuestion = true
    // this.makeBlur = true

    this.showEditOptionForQuestion = !this.showEditOptionForQuestion
    this.showEditOptionForQuestionId = questionId
    this.questionInput = question
    this.editedQuestion = true

    let neededObj = this.questionsToBeAsked.find((questnObj) => {
      return questnObj._id == questionId
    })
    this.required = neededObj.answerRequiredOrNot
    this.status = neededObj.showThisQuestionOrNot

    console.log("neededObj ", neededObj);


    console.log("this.showEditOptionForQuestion ", this.showEditOptionForQuestion,
      "this.showEditOptionForQuestionId ", this.showEditOptionForQuestionId,
      "this.questionInput ", this.questionInput,
      "this.editedQuestion ", this.editedQuestion,
      "this.showEditOptionForQuestionId ", this.editedQuestion,
      "this.questionInput ", this.editedQuestion,
      "this.editedQuestion ", this.editedQuestion)

  }

  deleteQuestion(questId) {
    const index = this.questionsToBeAsked.findIndex(questionObj =>
      questionObj._id == questId
    );
    // If the object is found, delete it
    if (index !== -1) {
      this.questionsToBeAsked.splice(index, 1);
    }
  }


  continueBookingFunctn(){
    console.log("evId ", this.evId);
    console.log("evLinkEnd ", this.eventLink);
    console.log("lastNameNeeded ", this.surnameReq);
    console.log("allow invitees to add guests ", this.allowInviteesToAddGuests);
    console.log("questionsArr ", this.questionsToBeAsked);    
  
    this.apiService.editUserFormForEventFnctn(this.evId,this.eventLink,this.surnameReq,this.allowInviteesToAddGuests,this.questionsToBeAsked, this.loggedInEmailId)
    setTimeout(()=>{
      this.bookingPageSlider = false
    },1000)
  }



}
