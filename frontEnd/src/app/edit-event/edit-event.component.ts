import { Component, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../api.service';
import { FormsModule, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Calendar, CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrl: './edit-event.component.css'
})
export class EditEventComponent {

  emailID = localStorage.getItem("emailID")
  loggedInName = localStorage.getItem("userLoggedInName" || "")
  evId = localStorage.getItem("evId")

  // eventN = localStorage.getItem("eventName")
  evT = localStorage.getItem("evType")
  // evDurMins = Number(localStorage.getItem("evDurMins"))
  // evDurHrs = Number(localStorage.getItem("evDurHrs"))
  eventN = ""
  evDurMins = 0
  evDurHrs = 0
  eventLocation = localStorage.getItem("eventLocation")
  usersId = localStorage.getItem('usersUniqueID' || '')

  whenCanInviteesSchedule = JSON.parse(localStorage.getItem("whenCanInviteesSchedule"))
  minimumNotice = JSON.parse(localStorage.getItem("minimumNotice"))
  noOfMeetsAllowedPerDay = JSON.parse(localStorage.getItem("noOfMeetsAllowedPerDay"))
  startTimIncrements = JSON.parse(localStorage.getItem("startTimIncrements"))
  allowInviteesToAddGuestsStr = localStorage.getItem("allowInviteesToAddGuests")
  allowInviteesToAddGuests: Boolean
  surnameReqStr = localStorage.getItem("surnameReq")
  surnameReq: Boolean
  questionsToBeAsked = JSON.parse(localStorage.getItem("questionsToBeAsked"))
  redirectTo = {}
  redirectToValue = ""
  externalSiteUrl = ""
  showWarningForExternalUrl = false

  eventLink = this.eventN
  customisedLink = ""
  showWarning = false
  showTimeWarning = false
  showWarningToAddQuestion = false
  questionInput = ""
  required = false
  selectedValue = "Name"
  editedQuestion = false
  maxInviteesPerEvent
  displayRemainingSPotsOrNot

  loggedInEmailId = localStorage.getItem("emailID" || "")

  descriptionText = ""

  showEventDetailsSlider = false
  showHostsAndInviteesSlider = false
  bookingPageSlider = false
  schedulingPageSlider = false
  allowInviteesCheckedOrNot = true

  popUpToAddNewQuestion = false
  status = true
  makeBlur = false

  showEditOptionForNameEmail = false
  openNameQuestionPopUp = false
  showEditOptionForInvitees = false
  showEditOptionForQuestion = false
  showEditOptionForQuestionId = ''
  copied = false

  openFromAndToDates = false
  showMinNotice = false
  showDailyLimit = false
  showStartTimeIncrements = false
  // openCustom = false


  // ==========days====================================
  statusForDays = this.whenCanInviteesSchedule.status
  days = {
    status: this.whenCanInviteesSchedule.days.status,
    noOfDays: this.whenCanInviteesSchedule.days.noOfDays,
    allDays: this.whenCanInviteesSchedule.days.allDays,
    onlyWeekDays: this.whenCanInviteesSchedule.days.onlyWeekDays
  }
  withinDateRange = {
    status: this.whenCanInviteesSchedule.withinDateRange.status,
    start: this.whenCanInviteesSchedule.withinDateRange.start,
    end: this.whenCanInviteesSchedule.withinDateRange.end
  }
  indefinitely = {
    status: this.whenCanInviteesSchedule.indefinitely.status
  }

  placeholderForDays = ""
  allDaysSelectedOrExcludeWeekends = ""
  // ======================================================

  // ======minimum notice values===========================
  statusForMinimumNotice = this.minimumNotice.status

  minNoticeHrs = {
    status: this.minimumNotice.hrs.status,
    noOfHrs: this.minimumNotice.hrs.noOfHrs
  }
  minNoticeMins = {
    status: this.minimumNotice.mins.status,
    noOfMins: this.minimumNotice.hrs.noOfMins
  }
  minNoticeDays = {
    status: this.minimumNotice.days.status,
    noOfDays: this.minimumNotice.days.noOfDays
  }
  valueForMinNoticeIpBox = 0
  minsHrsOrDaysMinNotice = "minutes"
  // ======================================================

  // ============NoOfMeetsAllowedPerDay====================
  statusFornoOfMeetsAllowedPerDay = this.noOfMeetsAllowedPerDay.status
  noOfMeetsAllowed = this.noOfMeetsAllowedPerDay.noOfMeetsAllowed
  // ======================================================


  // ===========start Time Increment values==================
  statusForstartTimIncrements = this.startTimIncrements.status
  minsForstartTimIncrements = this.startTimIncrements.mins
  hrsForstartTimIncrements = this.startTimIncrements.hrs

  // custmUnit = "minutesInc"
  // custmVal = 0
  // ========================================================

  formattedMeetingsHide: object[] = [];
  selectedUserAvObj = {}
  nameWhoseCalendar = ""


  displayTimeDiv = false;
  dateSelected = ""
  selectedDayName = ""
  selectedMonth = ""
  userAvailaibleArray: string[] = []
  Events: any[] = [];
  allTimesArray = []
  showNext = false

  workingHrStart = ""
  workingHrEnd = ""

  // hardcoding--------
  duration = {
    "hrs": 0,
    "minutes": 30
  }
  workingHrsAsPerDays = {
    "1": {
      "start": "09:00:00",
      "end": "17:00:00"
    },
    "2": {
      "start": "09:00:00",
      "end": "17:00:00"
    },
    "3": {
      "start": "09:00:00",
      "end": "17:00:00"
    },
    "4": {
      "start": "09:00:00",
      "end": "17:00:00"
    },
    "5": {
      "start": "09:00:00",
      "end": "17:00:00"
    }
  }
  workingDays = [1, 2, 3, 4, 5]
  nonWorkingDays = [0, 6]

  // hardcoding ends--------

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: '',
    },
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
  };
  currentDate: Date;
  currentformattedDate: string;


  reqEventObj: Object

  allowInviteesToScheduleOn
  minTimeReqBeforeScheduling
  noOfMeetingsAllowedPerDay
  timesStartTimeIncrements

  meetingsOfOnlyThisEvent

  // ========================================================

  constructor(private route: ActivatedRoute, private router: Router, private apiService: APIService, private datePipe: DatePipe) { }

  private subscription: Subscription;

  ngOnInit() {

    console.log("days initially ", this.days);


    if (this.emailID == "") {
      this.router.navigate(['login'])
    }

    // =======================================
    this.apiService.getMeetingsHide(this.emailID);

    this.apiService.getSelectedUsersAvailaibilityObj()
    this.subscription = this.apiService.formattedMeetingsHide$.subscribe((formattedMeetingsHide) => {
      console.log('Formatted Meetings Hide in ts :', formattedMeetingsHide);
      this.formattedMeetingsHide = formattedMeetingsHide;
      this.Events = formattedMeetingsHide;
      console.log("Events ", this.Events);
    });

    this.subscription = this.apiService.selectedUserAvailabilityObj$.subscribe((avObj) => {
      this.selectedUserAvObj = avObj
      console.log("selectedUserAvObj ", this.selectedUserAvObj);


      this.duration = this.selectedUserAvObj["duration"]
      this.workingHrsAsPerDays = this.selectedUserAvObj["workingHrs"]

      this.workingDays = this.selectedUserAvObj["workingDays"]
      this.nonWorkingDays = this.selectedUserAvObj["nonWorkingDays"]

      console.log("nonWorkingDays ", this.nonWorkingDays);


    })

    setTimeout(() => {
      this.calendarOptions = {
        initialView: 'dayGridMonth',
        // events: this.Events, //commented so that events are not shown on calendar
        dateClick: this.onDateClick.bind(this),
        dayCellContent: this.theDayCellContent.bind(this)
      }
    }, 2500);
    // =======================================

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


    if (this.days.status == false) {
      this.days.allDays = true
      this.days.noOfDays = 60
      this.days.onlyWeekDays = false
    }


    if (this.days.status) {
      this.placeholderForDays = this.days.noOfDays
      if (this.days.status.allDays) {
        this.allDaysSelectedOrExcludeWeekends = "calendar days"
      }
      else {
        this.allDaysSelectedOrExcludeWeekends = "weekdays"
      }
    }
    else {
      this.allDaysSelectedOrExcludeWeekends = "calendar days"
    }

    console.log("days ", this.days);


    if (this.withinDateRange.status == false) {
      this.withinDateRange.start = "2024-06-24"
      this.withinDateRange.end = "2024-06-30"
    }

    if (this.statusForMinimumNotice) {
      if (this.minNoticeHrs.status) {
        this.valueForMinNoticeIpBox = this.minNoticeHrs.noOfHrs
        this.minsHrsOrDaysMinNotice = "hours"
      }
      else if (this.minNoticeMins.status) {
        this.valueForMinNoticeIpBox = this.minNoticeMins.noOfMins
        this.minsHrsOrDaysMinNotice = "minutes"
      }
      else if (this.minNoticeDays.status) {
        this.valueForMinNoticeIpBox = this.minNoticeDays.noOfDays
        this.minsHrsOrDaysMinNotice = "days"
      }
    }



    // ===================================

    this.getAllEventEditings()


    // ---------for only week days ends
    // ======if user has specified the active days code ends===========


    // ===================================

  }

  // // ===========customizeDayClassNames starts==============
  // customizeDayClassNames(args) {
  //   const today = new Date();         
  //   const givenDaysLater = new Date(today);
  //   givenDaysLater.setDate(today.getDate() + this.allowInviteesToScheduleOn.days.noOfDays); // Set the date to given days from today

  //   const date = new Date(args.date);    
  //   if (date < today || date > givenDaysLater) {

  //     return ['fc-day-disabled'];
  //   }
  //   return [];
  // }
  // // ===========customizeDayClassNames ends================

  // // ==========customizeDayMount starts=====================
  // customizeDayMount(args) {
  //   const today = new Date();
  //   const givenDaysLater = new Date(today);
  //   givenDaysLater.setDate(today.getDate() + this.allowInviteesToScheduleOn.days.noOfDays); // Set the date to given days from today

  //   const date = new Date(args.date);
  //   if (date < today || date > givenDaysLater) {
  //     args.el.style.pointerEvents = 'none';
  //   }
  // }
  // // ==========customizeDayMount ends=======================


  // =======getsAllEventEditedOptions starts==================

  getAllEventEditings() {

    console.log("getAllEventEditings called");

    this.apiService.getSelectedEvent(this.evId, this.loggedInEmailId)
    this.subscription = this.apiService.reqEvent$.subscribe((reqEventObj) => {
      this.reqEventObj = reqEventObj
      if (Object.keys(reqEventObj).length > 0) { // i.e. object is not empty
        console.log("got reqEventObj ", reqEventObj);

        console.log("wanted ", reqEventObj["evDuration"]["minutes"]);


        this.eventN = reqEventObj["evName"]
        this.evDurHrs = reqEventObj["evDuration"]["hrs"]
        this.evDurMins = reqEventObj["evDuration"]["minutes"]
        this.eventLink = this.eventN
        this.redirectTo = reqEventObj["redirectTo"]
        if(reqEventObj['evType']=='Group'){
          this.maxInviteesPerEvent = reqEventObj['maxInviteesPerEventForGrpEvent']
          this.displayRemainingSPotsOrNot = reqEventObj['displayRemainingSpotsOnBookingPageGrp']
        }

        if(reqEventObj["redirectTo"]["confirmationPage"]["status"]){
          this.redirectToValue = "cloduraPage"
        }
        else{
          this.redirectToValue = "externalSite"
          this.externalSiteUrl = reqEventObj["redirectTo"]["externalUrl"]["link"]
        }

        // ===========================
      }
    })

    setTimeout(() => {
      this.allowInviteesToScheduleOn = this.reqEventObj["whenCanInviteesSchedule"] //making allowInviteesToScheduleOn object
      console.log("allowInviteesToScheduleOn ", this.allowInviteesToScheduleOn);
      //   {
      //     "indefinitely": {
      //         "status": false
      //     },
      //     "status": true,
      //     "days": {
      //         "status": true,
      //         "noOfDays": 5,
      //         "_id": "66793e367d68d29c14f6d1e1"
      //     },
      //     "withinDateRange": {
      //         "status": false,
      //         "start": "2024-06-24",
      //         "end": "2024-07-03",
      //         "_id": "66793e367d68d29c14f6d1e2"
      //     },
      //     "_id": "66793e367d68d29c14f6d1e0"
      // }

      this.minTimeReqBeforeScheduling = this.reqEventObj["minimumNotice"] //making minTimeReqBeforeScheduling object
      console.log("minTimeReqBeforeScheduling ", this.minTimeReqBeforeScheduling);
      //   {
      //     "hrs": {
      //         "status": false
      //     },
      //     "mins": {
      //         "status": true
      //     },
      //     "days": {
      //         "status": false
      //     },
      //     "status": true,
      //     "_id": "66793e367d68d29c14f6d1e3"
      // }

      this.noOfMeetingsAllowedPerDay = this.reqEventObj["noOfMeetsAllowedPerDay"] //making noOfMeetingsAllowedPerDay object
      //   console.log("noOfMeetingsAllowedPerDay ", this.noOfMeetingsAllowedPerDay);
      //   {
      //     "status": true,
      //     "noOfMeetsAllowed": 4,
      //     "_id": "66793e367d68d29c14f6d1e4"
      // }

      this.timesStartTimeIncrements = this.reqEventObj["startTimIncrements"] //making timesStartTimeIncrements object
      console.log("timesStartTimeIncrements ", this.timesStartTimeIncrements);
      //   {
      //     "status": true,
      //     "mins": 20,
      //     "hrs": 0,
      //     "_id": "66793e367d68d29c14f6d1e5"
      // }

      this.meetingsOfOnlyThisEvent = this.reqEventObj["meetings"] //making meetingsOfOnlyThisEvent object

      if (this.timesStartTimeIncrements.status) {
        if (!this.timesStartTimeIncrements.hrs) {
          console.log("duration ", this.duration);

          this.duration.hrs = 0

        }
        else if (this.timesStartTimeIncrements.hrs) {
          this.duration.hrs = this.timesStartTimeIncrements.hrs
        }
        if (!this.timesStartTimeIncrements.mins) {
          this.duration.minutes = 0
        }
        else {
          this.duration.minutes = this.timesStartTimeIncrements.mins
        }
      }

      // =================do these changes later==============================
      // whenCanInviteesSchedule = JSON.parse(localStorage.getItem("whenCanInviteesSchedule"))
      // minimumNotice = JSON.parse(localStorage.getItem("minimumNotice"))
      // noOfMeetsAllowedPerDay = JSON.parse(localStorage.getItem("noOfMeetsAllowedPerDay"))
      // startTimIncrements

      // this.whenCanInviteesSchedule = this.allowInviteesToScheduleOn
      // this.minimumNotice = this.minTimeReqBeforeScheduling
      // ===============================================


      // ======if user has specified the active days code starts===========      
      this.setActiveDaysAsPerUserReq()
      //======= if user has specified date Range ends===============

      // ========setTimesAsPerMinNotice starts==================
      // this.setTimesAsPerMinNotice()
      // ========setTimesAsPerMinNotice ends====================


    }, 1000)

  }
  // =======getsAllEventEditedOptions ends====================


  // ========================================================
  // ----------theDayCellContent starts----------
  theDayCellContent(info: any) {


    // <td aria-labelledby="fc-dom-22" role="gridcell" data-date="2024-03-06" class="fc-day fc-day-wed fc-day-past fc-daygrid-day"><div class="fc-daygrid-day-frame fc-scrollgrid-sync-inner"><div class="fc-daygrid-day-top"><a aria-label="March 6, 2024" id="fc-dom-22" class="fc-daygrid-day-number"><div>6</div></a></div><div class="fc-daygrid-day-events"><div class="fc-daygrid-day-bottom" style="margin-top: 0px;"></div></div><div class="fc-daygrid-day-bg"></div></div></td>
    const dayOfWeek = info.date.getDay();
    const date = info.date.getDate();
    // console.log(dayOfWeek);
    for (let i = 0; i < this.nonWorkingDays.length; i++) {
      if (dayOfWeek === this.nonWorkingDays[i]) {
        return { html: '<div style="color: grey">' + date + '</div>' };
      }
    }
    return { html: '<div>' + date + '</div>' };
  }
  // ----------theDayCellContent ends------------
  // =======================================================


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

      let location = "Google Meet"

      console.log("in else statement ", this.eventN, this.evDurHrs, this.evDurMins);
      // evName, evType, evDuration, evLocation

      console.log("input text ", this.descriptionText);


      this.apiService.editEvent(this.evId, this.eventN, this.evDurHrs, this.evDurMins, location, this.evT, this.descriptionText)
      setTimeout(() => {
        this.showEventDetailsSlider = false
        this.getAllEventEditings()
      }, 1000)
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
    this.schedulingPageSlider = false
  }

  turnOnShowHostsAndInviteesSlider() {
    this.showHostsAndInviteesSlider = true
  }

  turnOnBookingPageSlider() {
    this.bookingPageSlider = true
  }

  turnOnSchedulingPageSlider() {
    this.schedulingPageSlider = true
  }


  checkBoxChanged() {
    this.allowInviteesCheckedOrNot = !this.allowInviteesCheckedOrNot
    console.log("allowInviteesCheckedOrNot ", this.allowInviteesCheckedOrNot);
  }


  continueInviteesFunctn() {
    console.log("continueInviteesFunctn called ");
    console.log("evId ", this.evId, "allowInviteesCheckedOrNot ", this.allowInviteesCheckedOrNot);
    console.log(this.maxInviteesPerEvent, this.displayRemainingSPotsOrNot);
    if(this.evT == 'Group'){
      if(this.maxInviteesPerEvent>1){
        this.apiService.editEventIfUserCanAddGuests(this.evId, this.allowInviteesCheckedOrNot, this.maxInviteesPerEvent, this.displayRemainingSPotsOrNot)
      }
    }
    else{
      this.apiService.editEventIfUserCanAddGuests(this.evId, this.allowInviteesCheckedOrNot, this.maxInviteesPerEvent, this.displayRemainingSPotsOrNot)
    }
    setTimeout(()=>{

      this.getAllEventEditings()
    }, 1000)
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

        console.log("questionsToBeAsked ", this.questionsToBeAsked);

      }
      else {


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


  continueBookingFunctn() {
    console.log("evId ", this.evId);
    console.log("evLinkEnd ", this.eventLink);
    console.log("lastNameNeeded ", this.surnameReq);
    console.log("allow invitees to add guests ", this.allowInviteesToAddGuests);
    console.log("questionsArr ", this.questionsToBeAsked);
    console.log("redirectToValue ", this.redirectToValue);
    
    let goAhead = true

    if(this.redirectToValue == "cloduraPage"){
      this.redirectTo = {
        confirmationPage : {status : true},
        externalUrl : {
          status : false,
          link : ""
        }
      }
    }
    else if(this.redirectToValue == "externalSite"){
      if(this.externalSiteUrl == ""){
        goAhead = false
        this.showWarningForExternalUrl = true
      }
      else{
        this.showWarningForExternalUrl = false
        this.redirectTo = {
          confirmationPage : {status : false},
          externalUrl : {
            status : true,
            link : this.externalSiteUrl
          }
        }
      }
    }

    if(goAhead == true){
      this.apiService.editUserFormForEventFnctn(this.evId, this.eventLink, this.surnameReq, this.allowInviteesToAddGuests, this.questionsToBeAsked, this.loggedInEmailId, this.redirectTo)
      setTimeout(() => {
        this.bookingPageSlider = false
        this.getAllEventEditings()
      }, 1000)
    }
  }




  makeCopiedTrue() {
    this.copied = true
    setTimeout(() => {
      this.copied = false
    }, 1000)
  }


  calendarDaysFunctn() {
    this.openFromAndToDates = false
    this.statusForDays = true
    this.withinDateRange.status = false
    this.indefinitely.status = false
    this.days.status = true

    console.log("days.noOfDays ", this.days.noOfDays);
    console.log("allDaysSelectedOrExcludeWeekends ", this.allDaysSelectedOrExcludeWeekends);

  }

  openFromAndToDatesFnctn() {
    this.openFromAndToDates = true
    this.statusForDays = true
    this.withinDateRange.status = true
    this.indefinitely.status = false
    this.days.status = false

    console.log("this.withinDateRange.status", this.withinDateRange.status);

    console.log("this.withinDateRange.start ", this.withinDateRange.start);
    console.log("this.withinDateRange.end ", this.withinDateRange.end);


  }

  dateValidatorFunctn() {
    const date1 = new Date(this.withinDateRange.start);
    const date2 = new Date(this.withinDateRange.end);
    if (date1 >= date2) {
      alert("Kindly choose a date that is after the start date.")
      return false
    }
    else {
      return true
    }
  }

  indefinitelyFunctn() {
    this.openFromAndToDates = false
    this.statusForDays = true
    this.withinDateRange.status = false
    this.indefinitely.status = true
    this.days.status = false
  }


  changeMinimumNotice() {
    this.statusForMinimumNotice = true

    if (!this.valueForMinNoticeIpBox) {
      this.statusForMinimumNotice = false
    }
    else {
      if (this.minsHrsOrDaysMinNotice == "minutes") {
        this.minNoticeMins.status = true
        this.minNoticeMins.noOfMins = this.valueForMinNoticeIpBox

        this.minNoticeHrs.status = false
        this.minNoticeDays.status = false
      }
      else if (this.minsHrsOrDaysMinNotice == "hours") {
        this.minNoticeHrs.status = true
        this.minNoticeHrs.noOfHrs = this.valueForMinNoticeIpBox

        this.minNoticeMins.status = false
        this.minNoticeDays.status = false
      }
      else {
        this.minNoticeDays.status = true
        this.minNoticeDays.noOfDays = this.valueForMinNoticeIpBox

        this.minNoticeMins.status = false
        this.minNoticeHrs.status = false
      }

    }

    console.log("statusForMinimumNotice ", this.statusForMinimumNotice);
    console.log("valueForMinNoticeIpBox ", this.valueForMinNoticeIpBox);
    console.log("minsHrsOrDaysMinNotice ", this.minsHrsOrDaysMinNotice);
  }

  noOfMeetsAllowedPerDayFunctn() {
    if (!this.noOfMeetsAllowed) {
      this.statusFornoOfMeetsAllowedPerDay = false
    }
    else {
      this.statusFornoOfMeetsAllowedPerDay = true
    }

    console.log("statusFornoOfMeetsAllowedPerDay ", this.statusFornoOfMeetsAllowedPerDay);
    console.log("noOfMeetsAllowed ", this.noOfMeetsAllowed);

  }


  startTimeIncFunctn() {
    if (!this.minsForstartTimIncrements && !this.hrsForstartTimIncrements) {
      this.statusForstartTimIncrements = false
    }
    else {
      this.statusForstartTimIncrements = true
      if (this.minsForstartTimIncrements == "1" || this.minsForstartTimIncrements == "2") {
        this.hrsForstartTimIncrements = Number(this.minsForstartTimIncrements)
        this.minsForstartTimIncrements = 0
      }
      else {
        this.minsForstartTimIncrements = Number(this.minsForstartTimIncrements)
        this.hrsForstartTimIncrements = 0

      }
    }
    console.log("status ", this.statusForstartTimIncrements, "mins ", this.minsForstartTimIncrements, "hrs ", this.hrsForstartTimIncrements);

  }



  continueSchedulingFunctn() {

    let goAhead = true
    if (this.withinDateRange.status) {
      let dateValid = this.dateValidatorFunctn()
      if (!dateValid) {
        alert("While choosing date range, kindly choose an end date that is after the start date.")
        goAhead = false
      }
      else {
        goAhead = true
      }
    }

    if (goAhead == true) {

      this.whenCanInviteesSchedule.status = true

      console.log("this.days ", this.days);
      //   {
      //     "status": true,
      //     "noOfDays": 5
      // }


      if (this.statusForDays) {
        if (this.days.status) {

          if (this.allDaysSelectedOrExcludeWeekends == "calendar days") {
            this.days.allDays = true
            this.days.onlyWeekDays = false
          }
          else if (this.allDaysSelectedOrExcludeWeekends == "weekdays") {
            this.days.onlyWeekDays = true
            this.days.allDays = false
          }

          this.whenCanInviteesSchedule.days.status = this.days.status
          this.whenCanInviteesSchedule.days.noOfDays = this.days.noOfDays
          this.whenCanInviteesSchedule.days.allDays = this.days.allDays
          this.whenCanInviteesSchedule.days.onlyWeekDays = this.days.onlyWeekDays

          this.whenCanInviteesSchedule.withinDateRange.status = false
          this.whenCanInviteesSchedule.indefinitely.status = false
        }
        else if (this.withinDateRange.status) {
          this.whenCanInviteesSchedule.withinDateRange.status = this.withinDateRange.status
          this.whenCanInviteesSchedule.withinDateRange.start = this.withinDateRange.start
          this.whenCanInviteesSchedule.withinDateRange.end = this.withinDateRange.end

          this.whenCanInviteesSchedule.days.status = false
          this.whenCanInviteesSchedule.indefinitely.status = false
        }
        else if (this.indefinitely.status) {
          this.whenCanInviteesSchedule.indefinitely.status = this.indefinitely.status

          this.whenCanInviteesSchedule.days.status = false
          this.whenCanInviteesSchedule.withinDateRange.status = false
        }

      }


      if (this.statusForMinimumNotice) {
        console.log("statusForMinimumNotice is ", this.statusForMinimumNotice);

        this.minimumNotice.status = this.statusForMinimumNotice

        if (this.minNoticeHrs.status) {
          this.minimumNotice.hrs.status = this.minNoticeHrs.status

          if (this.minNoticeHrs.noOfHrs) {
            this.minimumNotice.hrs.noOfHrs = this.minNoticeHrs.noOfHrs
          }

          this.minimumNotice.mins.status = false
          this.minimumNotice.days.status = false

        }
        else if (this.minNoticeMins.status) {
          this.minimumNotice.mins.status = this.minNoticeMins.status

          if (this.minNoticeMins.noOfMins) {
            this.minimumNotice.mins.noOfMins = this.minNoticeMins.noOfMins
          }

          this.minimumNotice.hrs.status = false
          this.minimumNotice.days.status = false

        }
        else {
          this.minimumNotice.days.status = this.minNoticeDays.status

          if (this.minNoticeDays.noOfDays) {
            this.minimumNotice.days.noOfDays = this.minNoticeDays.noOfDays
          }

          this.minimumNotice.hrs.status = false
          this.minimumNotice.mins.status = false
        }

        console.log("this.minimumNotice obj ", this.minimumNotice);
        //   {
        //     "hrs": {
        //         "status": false
        //     },
        //     "mins": {
        //         "status": true,
        //         "noOfMins": 5
        //     },
        //     "days": {
        //         "status": false
        //     },
        //     "status": true,
        //     "_id": "66793e367d68d29c14f6d1e3"
        // }
      }



      if (this.statusFornoOfMeetsAllowedPerDay) {
        this.noOfMeetsAllowedPerDay.status = this.statusFornoOfMeetsAllowedPerDay
        this.noOfMeetsAllowedPerDay.noOfMeetsAllowed = this.noOfMeetsAllowed
      }



      if (this.statusForstartTimIncrements) {
        this.startTimIncrements.status = this.statusForstartTimIncrements
        this.startTimIncrements.mins = this.minsForstartTimIncrements
        this.startTimIncrements.hrs = this.hrsForstartTimIncrements
      }


    }

    console.log("whenCanInviteesSchedule ", this.whenCanInviteesSchedule);
    console.log("minNotice ", this.minimumNotice);
    console.log("noOfMeetsAlowedPerDay ", this.noOfMeetsAllowedPerDay);
    console.log("startTime ", this.startTimIncrements);



    this.apiService.editEventCalendar(this.evId, this.whenCanInviteesSchedule, this.minimumNotice, this.noOfMeetsAllowedPerDay, this.startTimIncrements, this.loggedInEmailId)

    setTimeout(() => {
      this.schedulingPageSlider = false
      this.getAllEventEditings()
    }, 1000)
  }



  // =======================================================

  onDateClick(res: any) {

    console.log('Clicked on date : ' + res.dateStr); //2024-02-13


    this.dateSelected = res.dateStr

    let returnOffindHowManyEventsAreAlreadyBookedFnctn;

    console.log("this.noOfMeetingsAllowedPerDay.status ", this.noOfMeetingsAllowedPerDay.status);

    if (this.noOfMeetingsAllowedPerDay.status) {
      returnOffindHowManyEventsAreAlreadyBookedFnctn = this.findHowManyEventsAreAlreadyBookedOnThatDay(res.dateStr)
    }

    console.log("returnOffindHowManyEventsAreAlreadyBookedFnctn ", returnOffindHowManyEventsAreAlreadyBookedFnctn);


    if (returnOffindHowManyEventsAreAlreadyBookedFnctn) {
      this.userAvailaibleArray = []
    }
    else if (!returnOffindHowManyEventsAreAlreadyBookedFnctn) {

      this.currentDate = new Date();
      console.log("currentDate ", this.currentDate); //Mon Feb 19 2024 12:38:05 GMT+0530 (India Standard Time)create-meeting.component.ts:238 
      this.currentformattedDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd'); //2024-02-19
      console.log("currentformattedDate ", this.currentformattedDate);

      //if selected date is earlier than today's date
      if (res.dateStr < this.currentformattedDate) {
        alert('Please select a date on or after today.')
      }
      else {//if selected date is on or later than today's date
        console.log("res ", res)
        const selectedDay = res.date.getDay();

        if (selectedDay == 0) {
          this.selectedDayName = "Sunday"
        }
        else if (selectedDay == 1) {
          this.selectedDayName = "Monday"
        }
        else if (selectedDay == 2) {
          this.selectedDayName = "Tuesday"
        }
        else if (selectedDay == 3) {
          this.selectedDayName = "Wednesday"
        }
        else if (selectedDay == 4) {
          this.selectedDayName = "Thursday"
        }
        else if (selectedDay == 5) {
          this.selectedDayName = "Friday"
        }
        else if (selectedDay == 6) {
          this.selectedDayName = "Saturday"
        }

        const selectedDateis = res.dateStr;
        console.log("selectedDate ", selectedDateis);


        console.log(selectedDateis[5]);
        console.log(selectedDateis[6]);

        if (selectedDateis[5] == 0 && selectedDateis[6] == 1) { //i.e like month is 01
          this.selectedMonth = "January"
        }
        else if (selectedDateis[5] == 0 && selectedDateis[6] == 2) {//i.e like month is 02
          this.selectedMonth = "February"
        }
        else if (selectedDateis[6] == 3) {//i.e like month is 03
          this.selectedMonth = "March"
        }
        else if (selectedDateis[6] == 4) {
          this.selectedMonth = "April"
        }
        else if (selectedDateis[6] == 5) {
          this.selectedMonth = "May"
        }
        else if (selectedDateis[6] == 6) {
          this.selectedMonth = "June"
        }
        else if (selectedDateis[6] == 7) {
          this.selectedMonth = "July"
        }
        else if (selectedDateis[6] == 8) {
          this.selectedMonth = "August"
        }
        else if (selectedDateis[6] == 9) {
          this.selectedMonth = "September"
        }
        else if (selectedDateis[5] == 1 && selectedDateis[6] == 0) {
          this.selectedMonth = "October"
        }
        else if (selectedDateis[5] == 1 && selectedDateis[6] == 1) {
          this.selectedMonth = "November"
        }
        else if (selectedDateis[5] == 1 && selectedDateis[6] == 2) {
          this.selectedMonth = "December"
        }

        console.log(this.selectedDayName, this.selectedMonth, this.dateSelected);







        // start = moment.utc(start).tz('Asia/Calcutta').format();
        // let currentDateTime = new Date();
        // currentDateTime = moment.utc(currentDateTime).tz('Asia/Calcutta').format();

        // console.log(currentDateTime , start  , "and " ,start<currentDateTime)

        // if(start<currentDateTime){
        //     res.send({message: "Meetings cannot be scheduled earlier than the current date and time"})
        // }


        const selectedDate = res.dateStr;
        this.subscription = this.apiService.userUnavailabelOnArray$.subscribe((userUnavailabelOnArray$) => {
          // this.loggedInName = userLoggedInName;
          // console.log("logged in user name is ",this.loggedInName)
          console.log("array ", userUnavailabelOnArray$);
        });

        let selectedNonWorkingDay = false
        for (let i = 0; i < this.nonWorkingDays.length; i++) {
          if (selectedDay == this.nonWorkingDays[i]) {
            selectedNonWorkingDay = true
            this.displayTimeDiv = false;
            alert('User unavailable on this day!');
            return;
          }
        }
        // if (selectedDay === 1) {
        //   alert('User unavailable at this time!');
        //   return;
        // } 


        if (selectedNonWorkingDay == false) {
          this.displayTimeDiv = true;
          this.dateSelected = res.dateStr

          // workingHrsAsPerDays = {
          //   1:{start:"09:00:00",
          //   end:"17:00:00"}

          //   2:{start:"09:00:00",
          //   end:"17:00:00"}

          //   3:{start:"09:00:00",
          //   end:"17:00:00"}
          // }


          for (let key in this.workingHrsAsPerDays) {
            if (selectedDay == key) {
              this.workingHrStart = this.workingHrsAsPerDays[key].start
              this.workingHrEnd = this.workingHrsAsPerDays[key].end
            }
          }

          let workingHrStart = this.workingHrStart //09:00:00
          let workingHrEnd = this.workingHrEnd //17:00:00

          console.log("workingHrStart ", workingHrStart, "workingHrEnd ", workingHrEnd);


          let workingStartHours = Number(`${workingHrStart[0]}${workingHrStart[1]}`) //9
          let workingStartMinutes = Number(`${workingHrStart[3]}${workingHrStart[4]}`) //0
          console.log("workingStartHours ", workingStartHours, "workingStartMinutes ", workingStartMinutes);

          let workingEndHours = Number(`${workingHrEnd[0]}${workingHrEnd[1]}`) //17
          let workingEndMinutes = Number(`${workingHrEnd[3]}${workingHrEnd[4]}`) //0
          console.log("workingEndHours ", workingEndHours, "workingEndMinutes ", workingEndMinutes);

          let allTimesArray = []

          let timeStr = workingHrStart //09:00:00

          allTimesArray.push(timeStr)


          console.log("workingStartHours ", workingStartHours, typeof workingStartHours);
          console.log("workingEndHours ", workingEndHours, typeof workingEndHours);
          console.log("workingStartMinutes ", workingStartMinutes, typeof workingStartMinutes);
          console.log("workingEndMinutes ", workingEndMinutes, typeof workingEndMinutes);


          console.log(workingStartHours <= workingEndHours);
          console.log(typeof workingEndHours);


          // allTimesArray = ['09:00:00']

          //9               <    17
          while (workingStartHours < workingEndHours) {
            console.log("inside while ");

            // console.log("workingStartHours 278 ",workingStartHours, typeof workingStartHours);
            // console.log("workingEndHours 279 ",workingEndHours, typeof workingEndHours);
            // console.log("workingStartMinutes 280 ",workingStartMinutes, typeof workingStartMinutes);
            // console.log("workingEndMinutes 281 ",workingEndMinutes, typeof workingEndMinutes);

            // console.log("this.duration.minutes 283 ",this.duration["minutes"], typeof this.duration["minutes"]);
            // console.log("this.duration 284 ",this.duration, typeof this.duration);       


            workingStartHours = workingStartHours + Number(this.duration.hrs)
            workingStartMinutes = workingStartMinutes + Number(this.duration.minutes)
            console.log("workingStartHours 287 ", workingStartHours, typeof workingStartHours);
            console.log("workingStartMinutes 288 ", workingStartMinutes, typeof workingStartMinutes);

            if (workingStartMinutes >= 60) {
              workingStartHours = workingStartHours + Math.floor(workingStartMinutes / 60)
              workingStartMinutes = workingStartMinutes - 60 * (Math.floor(workingStartMinutes / 60))
            }

            // console.log("workingStartHours 295 ",workingStartHours, typeof workingStartHours);
            // console.log("workingStartMinutes 296 ",workingStartMinutes, typeof workingStartMinutes);

            // console.log("workingStartHours ",workingStartHours,"workingStartMinutes ", workingStartMinutes);


            //buulding timestring properly because it is a string
            if (workingStartHours < 10) {
              if (workingStartMinutes < 10) {
                timeStr = `0${workingStartHours}:0${workingStartMinutes}:00`
              }
              else {
                timeStr = `0${workingStartHours}:${workingStartMinutes}:00`
              }
            }
            else {
              if (workingStartMinutes < 10) {
                timeStr = `${workingStartHours}:0${workingStartMinutes}:00`
              }
              else {
                timeStr = `${workingStartHours}:${workingStartMinutes}:00`
              }
            }

            allTimesArray.push(timeStr)

          }

          console.log("allTimesArray ", allTimesArray);
          this.allTimesArray = allTimesArray



          // let allTimesArray = ['10:00:00', '10:30:00', '11:00:00', '11:30:00', '12:00:00', '12:30:00', '01:00:00', '01:30:00', '02:00:00', '02:30:00', '03:00:00', '03:30:00', '04:00:00', '04:30:00', '05:00:00', '05:30:00', '06:00:00', '06:30:00']

          let usersBookedTimes = []
          let eventDate = ""

          console.log("Checking Events after date click ", this.Events);

          //  [ {Id: "65c9c03f0766a7f15e54e04a",end: "2019-01-18T09:30:00+05:30",start: "2019-01-18T09:00:00+05:30"},
          // {Id: "65c9c03f0766a7f15e54e04a",end: "2019-01-19T09:30:00+05:30",start: "2019-01-19T09:00:00+05:30"}]



          for (let i = 0; i < this.Events.length; i++) {
            let obj = this.Events[i]
            console.log("obj ", obj);

            eventDate = obj['start'].split('T')[0] //2019-01-18
            console.log("eventDate ", eventDate);

            console.log("eventDate ", eventDate, "this.dateSelected ", this.dateSelected, eventDate == this.dateSelected);

            if (eventDate == this.dateSelected) {
              let eventStartTime = obj['start'].split('T')[1] //09:00:00
              // let eventStartTime = time.split('+')[0] //09:00:00
              console.log("eventStartTime ", eventStartTime);

              usersBookedTimes.push(eventStartTime)
            }
          }
          console.log("usersBookedTimes ", usersBookedTimes);


          let usersAvailaibleTimes = []

          for (let i = 0; i < allTimesArray.length; i++) {
            let found = false
            for (let j = 0; j < usersBookedTimes.length; j++) {
              if (allTimesArray[i] == usersBookedTimes[j]) {
                found = true
                break;
              }
            }

            if (found == false) {
              usersAvailaibleTimes.push(allTimesArray[i])
            }
          }
          if (this.minTimeReqBeforeScheduling.status == true) {
            this.setTimesAsPerMinNotice(usersAvailaibleTimes, selectedDate)
          }
          else {
            this.userAvailaibleArray = usersAvailaibleTimes
          }

          console.log("this.userAvailaibleArray ", this.userAvailaibleArray);
        }
      }
    }
  }

  // ---------------onDateClick ends---------------

  // ==========noOfMeetingsAllowedPerDayFUnctn Starts=======

  findHowManyEventsAreAlreadyBookedOnThatDay(selectedDate) {


    console.log("meetingsOfOnlyThisEvent ", this.meetingsOfOnlyThisEvent);
    let count = 0
    for (let i = 0; i < this.meetingsOfOnlyThisEvent.length; i++) {
      let oneMeet = this.meetingsOfOnlyThisEvent[i]
      let meetDate = oneMeet.start.split("T")[0]


      if (meetDate == selectedDate) {
        count++
      }
    }

    console.log("count ", count);
    console.log(count >= this.noOfMeetingsAllowedPerDay.noOfMeetsAllowed);

    if (count >= this.noOfMeetingsAllowedPerDay.noOfMeetsAllowed) {
      // this.userAvailaibleArray = []

      return true
    }
    else {
      return false
    }
  }

  // ==========noOfMeetingsAllowedPerDayFUnctn Ends=======




  // =====================setActiveDaysAsPerUserReq==================================
  setActiveDaysAsPerUserReq() {

    // =========remove this in future==================
    // this.allowInviteesToScheduleOn.withinDateRange.status = false
    // this.allowInviteesToScheduleOn.days.status = true
    // this.allowInviteesToScheduleOn.days.noOfDays = 12
    // this.allowInviteesToScheduleOn.days.allDays = false
    // this.allowInviteesToScheduleOn.days.onlyWeekDays = true
    // ===================================================

    console.log(" ffffff this.allowInviteesToScheduleOn", this.allowInviteesToScheduleOn);


    if (this.allowInviteesToScheduleOn.days.status) {

      // ----------for all days starts:
      if (this.allowInviteesToScheduleOn.days.allDays) {
        const today = new Date();
        const givenDaysLater = new Date(today);
        givenDaysLater.setDate(today.getDate() + this.allowInviteesToScheduleOn.days.noOfDays); // Set the date to given days from today

        let start, end, year, month, day;

        year = today.getFullYear();
        month = ('0' + (today.getMonth() + 1)).slice(-2);
        day = ('0' + today.getDate()).slice(-2);
        start = `${year}-${month}-${day}`;

        year = givenDaysLater.getFullYear();
        month = ('0' + (givenDaysLater.getMonth() + 1)).slice(-2);
        day = ('0' + givenDaysLater.getDate()).slice(-2);
        end = `${year}-${month}-${day}`;

        console.log("start, end ", start, end);

        this.calendarOptions.validRange = {
          start: start,
          end: end
        }
        // this.calendarOptions.dayCellClassNames = this.customizeDayClassNames.bind(this)
        // this.calendarOptions.dayCellDidMount = this.customizeDayMount.bind(this)
      }
      // ----------for all days ends:
      // ----------for only week days starts :  

      else if (this.allowInviteesToScheduleOn.days.onlyWeekDays) {
        let today = new Date();
        console.log("initial today ", today);

        const givenDaysLater = new Date(today);
        givenDaysLater.setDate(today.getDate() + this.allowInviteesToScheduleOn.days.noOfDays - 1); // Set the date to given days from today

        console.log("initial givenDaysLater ", givenDaysLater);

        let p1 = new Date()
        let p2 = givenDaysLater

        console.log("p1, p2 ", p1, p2);

        while (p1 <= p2) {

          let dayOfP1 = p1.getDay()
          if (dayOfP1 != 0 && dayOfP1 != 6) {
            p1.setDate(p1.getDate() + 1);
          }
          else {
            p1.setDate(p1.getDate() + 1);
            p2.setDate(p2.getDate() + 1);
          }
        }

        console.log("p1, p2 ", p1, p2);

        givenDaysLater.setDate(p2.getDate() + 1); // +1 coz calendar excludes the last date
        console.log("new givenDaysLater ", givenDaysLater);


        console.log("today ", today);
        today = new Date();

        console.log("ending ", givenDaysLater);
        let start, end, year, month, day;

        year = today.getFullYear();
        month = ('0' + (today.getMonth() + 1)).slice(-2);
        day = ('0' + today.getDate()).slice(-2);
        start = `${year}-${month}-${day}`;

        year = givenDaysLater.getFullYear();
        month = ('0' + (givenDaysLater.getMonth() + 1)).slice(-2);
        day = ('0' + givenDaysLater.getDate()).slice(-2);
        end = `${year}-${month}-${day}`;

        console.log("start, end ", start, end);

        this.calendarOptions.validRange = {
          start: start,
          end: end
        }
      }
    }

    //======= if user has specified date Range starts===
    else if (this.allowInviteesToScheduleOn.withinDateRange.status) {

      let end = this.allowInviteesToScheduleOn.withinDateRange.end

      console.log("endDate ", end);
      let endDateInDateForm = new Date(end)
      console.log("endDateInDateForm ", endDateInDateForm);

      endDateInDateForm.setDate(endDateInDateForm.getDate() + 1);
      console.log("endDateInDateForm ", endDateInDateForm);

      let endDateAfterAddition, year, month, day;

      year = endDateInDateForm.getFullYear();
      month = ('0' + (endDateInDateForm.getMonth() + 1)).slice(-2);
      day = ('0' + endDateInDateForm.getDate()).slice(-2);
      endDateAfterAddition = `${year}-${month}-${day}`;


      this.calendarOptions.validRange = {
        start: this.allowInviteesToScheduleOn.withinDateRange.start,
        end: endDateAfterAddition
      }

    }
  }

  // ==========setActiveDaysAsPerUserReq ends=====================


  // ===========setTimesAsPerMinNotice starts=====================
  setTimesAsPerMinNotice(userAvailaibleArray, selectedDate) {

    // this.minTimeReqBeforeScheduling = {
    //   status: t / f,
    //   hrs: {
    //     status: t/f,
    //     noOfHrs: 10
    //   },
    //   mins: {
    //     status: t/f
    //     noOfMins: 2
    //   },
    //   days: {
    //     status: t/f,
    //     noOfDays: 5
    //   }
    // }

    console.log("this.minTimeReqBeforeScheduling ", this.minTimeReqBeforeScheduling);


    if (this.minTimeReqBeforeScheduling.status) {
      console.log("this.minTimeReqBeforeScheduling.status is true ");


      if (this.minTimeReqBeforeScheduling.hrs.status) {
        console.log("this.minTimeReqBeforeScheduling.hrs.status is true ");
        console.log("asked hrs ", this.minTimeReqBeforeScheduling.hrs.noOfHrs);


        // console.log("userAvailaibleArray ", userAvailaibleArray);
        //  ['09:00:00', '09:30:00', '10:00:00', '10:30:00', '11:00:00', '11:30:00', '12:00:00', '12:30:00', '13:00:00', '13:30:00', '14:00:00', '14:30:00', '15:00:00', '15:30:00', '16:00:00', '16:30:00', '17:00:00']
        let timesArray = []
        for (let i = 0; i < userAvailaibleArray.length; i++) {
          let timeStr = userAvailaibleArray[i]
          let dateTimeStr = `${selectedDate}T${timeStr}`

          let date = new Date(dateTimeStr)
          let todasDate = new Date()
          console.log("dates ", date);
          let differenceInMilliSeconds = date.getTime() - todasDate.getTime();
          console.log("differenceInMilliSeconds ", differenceInMilliSeconds);

          // Convert the time difference to various units
          let differenceInSeconds = differenceInMilliSeconds / 1000;
          let differenceInMinutes = differenceInSeconds / 60;
          let differenceInHours = differenceInMinutes / 60;
          let differenceInDays = differenceInHours / 24;

          // console.log("date ", date);
          // console.log("todasDate ", todasDate);


          // console.log(`Difference in Seconds: ${differenceInSeconds}`);
          // console.log(`Difference in Minutes: ${differenceInMinutes}`);
          // console.log(`Difference in Hours: ${differenceInHours}`);
          // console.log(`Difference in Days: ${differenceInDays}`);

          if (differenceInHours >= this.minTimeReqBeforeScheduling.hrs.noOfHrs) {
            timesArray.push(timeStr)
          }
        }
        // console.log("timesArray ", timesArray);

        this.userAvailaibleArray = timesArray
      }
      else if (this.minTimeReqBeforeScheduling.mins.status) {

        console.log("this.minTimeReqBeforeScheduling.mins.status is true");


        let timesArray = []
        for (let i = 0; i < userAvailaibleArray.length; i++) {
          let timeStr = userAvailaibleArray[i]
          let dateTimeStr = `${selectedDate}T${timeStr}`

          let date = new Date(dateTimeStr)
          let todasDate = new Date()
          console.log("dates ", date);
          let differenceInMilliSeconds = date.getTime() - todasDate.getTime();
          console.log("differenceInMilliSeconds ", differenceInMilliSeconds);

          // Convert the time difference to various units
          let differenceInSeconds = differenceInMilliSeconds / 1000;
          let differenceInMinutes = differenceInSeconds / 60;
          let differenceInHours = differenceInMinutes / 60;
          let differenceInDays = differenceInHours / 24;

          // console.log("date ", date);
          // console.log("todasDate ", todasDate);


          // console.log(`Difference in Seconds: ${differenceInSeconds}`);
          // console.log(`Difference in Minutes: ${differenceInMinutes}`);
          // console.log(`Difference in Hours: ${differenceInHours}`);
          // console.log(`Difference in Days: ${differenceInDays}`);

          if (differenceInMinutes >= this.minTimeReqBeforeScheduling.mins.noOfMins) {
            timesArray.push(timeStr)
          }
        }
        // console.log("timesArray ", timesArray);

        this.userAvailaibleArray = timesArray
      }
      else {
        console.log("this.minTimeReqBeforeScheduling.days.status is true");

        let timesArray = []
        for (let i = 0; i < userAvailaibleArray.length; i++) {
          let timeStr = userAvailaibleArray[i]
          let dateTimeStr = `${selectedDate}T${timeStr}`

          let date = new Date(dateTimeStr)
          let todasDate = new Date()
          console.log("dates ", date);
          let differenceInMilliSeconds = date.getTime() - todasDate.getTime();
          console.log("differenceInMilliSeconds ", differenceInMilliSeconds);

          // Convert the time difference to various units
          let differenceInSeconds = differenceInMilliSeconds / 1000;
          let differenceInMinutes = differenceInSeconds / 60;
          let differenceInHours = differenceInMinutes / 60;
          let differenceInDays = differenceInHours / 24;

          // console.log("date ", date);
          // console.log("todasDate ", todasDate);


          // console.log(`Difference in Seconds: ${differenceInSeconds}`);
          // console.log(`Difference in Minutes: ${differenceInMinutes}`);
          // console.log(`Difference in Hours: ${differenceInHours}`);
          // console.log(`Difference in Days: ${differenceInDays}`);

          if (differenceInDays >= this.minTimeReqBeforeScheduling.days.noOfDays) {
            timesArray.push(timeStr)
          }
        }
        // console.log("timesArray ", timesArray);

        this.userAvailaibleArray = timesArray
      }
    }

  }
  // ===========setTimesAsPerMinNotice ends=======================

}











// startTimeIncFunctn() {
//   if (!this.minsForstartTimIncrements && !this.hrsForstartTimIncrements) {
//     this.statusForstartTimIncrements = false
//     this.openCustom = false
//     console.log("1st if");

//   }
//   else {
//     this.statusForstartTimIncrements = true
//     // this.openCustom = false


//     if (this.minsForstartTimIncrements == "custom") {
//       console.log("sayCustom");
//       this.openCustom = true
//       console.log("3rd if");


//       // custmUnit = "minutesInc"
//       // custmVal = 0
//       if(!this.custmVal){
//         this.statusForstartTimIncrements = false
//         console.log("4th if");

//       }
//       else{
//         console.log("custmUnit ", this.custmUnit);

//         if(this.custmUnit == "hoursInc"){
//           this.hrsForstartTimIncrements = this.custmVal
//           this.minsForstartTimIncrements = 0
//         }
//         else if(this.custmUnit == "minutesInc"){
//           if(this.custmVal >= 60){
//             this.hrsForstartTimIncrements = Math.floor((this.custmVal)/60)
//             this.minsForstartTimIncrements = 0
//           }
//           else{
//             this.minsForstartTimIncrements = this.custmVal
//             this.hrsForstartTimIncrements = 0
//           }
//         }
//       }

//             if (this.minsForstartTimIncrements != "custom" && this.minsForstartTimIncrements != "") {
//       console.log("2nd if");

//       this.minsForstartTimIncrements = Number(this.minsForstartTimIncrements)
//       this.hrsForstartTimIncrements = 0


//     }

//     }
//   }


//   console.log("status ",this.statusForstartTimIncrements ,"mins ", this.minsForstartTimIncrements, "hrs ", this.hrsForstartTimIncrements);

// }
