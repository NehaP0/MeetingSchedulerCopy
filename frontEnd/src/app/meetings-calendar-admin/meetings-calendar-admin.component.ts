import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { View, EventSettingsModel, ActionEventArgs, PopupOpenEventArgs, ScheduleComponent } from '@syncfusion/ej2-angular-schedule';
import { APIService } from '../api.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Calendar, CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-meetings-calendar-admin',
  templateUrl: './meetings-calendar-admin.component.html',
  styleUrl: './meetings-calendar-admin.component.css'
})
export class MeetingsCalendarAdminComponent {

  currentDate: Date;
  currentformattedDate: string;

  token = localStorage.getItem('token')

  userName: string = '';
  emailId: string = '';
  selectedUserId = localStorage.getItem("selectedUserId" || "")
  selectedUserEmailId = localStorage.getItem("selectedUserEmail" || "")
  selectedEventId = localStorage.getItem('selectedEventId' || "")
  selectedEventName = localStorage.getItem('selectedEventName' || "")
  selectedMeetingId = ''

  evName = ""
  evDurHrs = 0
  evDurMins = 0
  evLocation = localStorage.getItem("eventLocation")
  evType = ""
  // meetingArray : any[] = [];
  formattedMeetingsHide: object[] = [];
  timeSelected = "";
  eventName = "";
  eventDesc = "";
  loading = false
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
  showNextFor = ""

  workingHrStart = ""
  workingHrEnd = ""

  editMeet = false

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

  showMeets = false
  // eventObj = {}
  newObj = {
    // 'evType':"",
    'date': "",
    'startTime': "",
    'endTime': "",
    'name': "",
    'emailId': "",
    // 'meetId' : ""
  }

  newEditObj = {
    // 'evType':"",
    'date': "",
    'startTime': "",
    'endTime': "",
    'name': "",
    'emailId': "",
    // 'meetId' : ""
  }

  // NEW====

  allowInviteesToScheduleOn
  minTimeReqBeforeScheduling
  noOfMeetingsAllowedPerDay
  timesStartTimeIncrements

  meetingsOfOnlyThisEvent
  eventN = ''
  eventLink = ''
  reqEventObj = {}
  allowInviteesToAddGuests = true


  // NEW END====

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: '',
    },
    weekends: true,
    editable: false,
    selectable: true,
    selectMirror: true,

  };


  // trialArray : Array<any> = []
  // dataSource = this.formattedMeetings


  // -------------------------------

  constructor(private apiService: APIService, private route: ActivatedRoute, private router: Router, private datePipe: DatePipe) {
    this.subscription = this.apiService.userName$.subscribe((userName) => {
      this.userName = userName;
      console.log(userName)
    });
    this.subscription = this.apiService.emailId$.subscribe((emailId) => {
      this.emailId = emailId;
      console.log("email ", emailId)
    });
  }

  private subscription: Subscription;




  ngOnInit() {

    if (!this.token) {
      this.router.navigate(['/login']);
    }

    this.apiService.getMeetingsOfParticularEventAdmin(this.selectedUserId, this.selectedEventId);
    this.apiService.getSelectedUsersAvailaibilityObjAdmin(this.selectedUserId)


    setTimeout(() => {
      this.subscription = this.apiService.getMeetingsOfParticularEventAdmin$.subscribe((getMeetingsOfParticularEventAdmin) => {
        console.log('Meetings in ts :', getMeetingsOfParticularEventAdmin);

        // this.formattedMeetingsHide = formattedMeetingsHide;
        // let newArr = []
        // console.log(this.formattedMeetingsHide);

        // for (let i = 0; i < getMeetingsOfParticularEventAdmin.length; i++) {
        //   if (getMeetingsOfParticularEventAdmin[i].start != "2019-01-18T09:00:00+05:30") {//not to push sample meeting
        //     newArr.push(getMeetingsOfParticularEventAdmin[i])
        //   }
        // }
        this.formattedMeetingsHide = getMeetingsOfParticularEventAdmin
        this.Events = this.formattedMeetingsHide
        console.log("Events ", this.Events);
      });

      // ===========================================
      console.log("got it ", this.selectedEventId, this.selectedUserEmailId);

      this.apiService.getSelectedEvent(this.selectedEventId, this.selectedUserEmailId)
      this.subscription = this.apiService.reqEvent$.subscribe((reqEventObj) => {
        this.reqEventObj = reqEventObj
        console.log("reqEventObj ", reqEventObj);

        if (Object.keys(reqEventObj).length > 0) { // i.e. object is not empty
          // ================================================
          // evName = ""
          // evDurHrs = 0
          // evDurMins = 0
          // evLocation = localStorage.getItem("eventLocation")
          // allowInviteesToAddGuests = true
          // evType = ""
          // // meetingArray : any[] = [];
          // formattedMeetingsHide: object[] = [];
          // timeSelected = "";
          // eventName = "";
          // eventDesc = "";
          // loading = false
          // selectedUserAvObj = {}
          // nameWhoseCalendar = ""
          // ================================================


          console.log("got reqEventObj ", reqEventObj);
          this.evName = reqEventObj["evName"]
          this.evDurHrs = reqEventObj["evDuration"]["hrs"]
          this.evDurMins = reqEventObj["evDuration"]["minutes"]
          this.evLocation = reqEventObj["evLocation"]
          this.allowInviteesToAddGuests = reqEventObj["allowInviteesToAddGuests"]
          this.evType = reqEventObj["evType"]

          // ===========================
        }
      })


      this.subscription = this.apiService.selectedUserAvailabilityObj$.subscribe((avObj) => {
        this.selectedUserAvObj = avObj
        console.log("selectedUserAvObj ", this.selectedUserAvObj);

        this.duration = this.selectedUserAvObj["duration"]
        this.workingHrsAsPerDays = this.selectedUserAvObj["workingHrs"]

        this.workingDays = this.selectedUserAvObj["workingDays"]
        this.nonWorkingDays = this.selectedUserAvObj["nonWorkingDays"]

      })
    }, 2500)




    setTimeout(() => {
      this.calendarOptions = {
        initialView: 'dayGridMonth',
        events: this.Events, //commented so that events are not shown on calendar
        dateClick: this.onDateClick.bind(this),

        dayMaxEvents: 100,
        eventOrder: 'start',
        displayEventTime: false, //hides time
        eventDisplay: 'block', // shows strip
        dayCellContent: this.theDayCellContent.bind(this),
        eventClick: this.onEventClick.bind(this)
      }
    }, 5000);
    // })

    this.getAllEventEditings()

  }

  // =======getsAllEventEditedOptions starts==================

  getAllEventEditings() {

    console.log("getAllEventEditings called");

    this.apiService.getSelectedEvent(this.selectedEventId, this.emailId)
    this.subscription = this.apiService.reqEvent$.subscribe((reqEventObj) => {
      this.reqEventObj = reqEventObj
      if (Object.keys(reqEventObj).length > 0) { // i.e. object is not empty
        console.log("got reqEventObj ", reqEventObj);

        console.log("wanted ", reqEventObj["evDuration"]["minutes"]);


        this.eventN = reqEventObj["evName"]
        this.evDurHrs = reqEventObj["evDuration"]["hrs"]
        this.evDurMins = reqEventObj["evDuration"]["minutes"]
        this.eventLink = this.eventN

        // ===========================
      }
    })

    setTimeout(() => {
      console.log("got reqEventObj so i can schedule ", this.reqEventObj);

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

      console.log("assigned value ", this.noOfMeetingsAllowedPerDay);

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


    }, 5000)

  }
  // =======getsAllEventEditedOptions ends====================

  // ----------theDayCellContent starts----------
  theDayCellContent(info: any) {


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



  // -----------------
  onEventClick(res: any) {
    this.showMeets = true

    let response = JSON.stringify(res)
    response = JSON.parse(response)
    let event = response['event']
    console.log("response ", response);
    console.log("event ", response['event']);


    this.selectedMeetingId = event.extendedProps.Id

    this.newObj['meetId'] = event.extendedProps.Id
    this.newObj['evType'] = event.extendedProps.evType
    console.log("this.newObj['evType'] ", this.newObj['evType']);
    this.newObj['date'] = event.start.split('T')[0]
    console.log("this.newObj['date'] ", this.newObj['date']);
    this.newObj['startTime'] = event.start.split('T')[1].split('+')[0]
    console.log("this.newObj['startTime'] ", this.newObj['startTime']);
    this.newObj['endTime'] = event.end.split('T')[1].split('+')[0]
    console.log("this.newObj['endTime'] ", this.newObj['endTime']);
    this.newObj['name'] = event.extendedProps.name
    console.log("this.newObj['name'] ", this.newObj['name']);
    this.newObj['emailId'] = event.extendedProps.emailId
    console.log("this.newObj['emailId'] ", this.newObj['emailId']);

    this.newEditObj['meetId'] = event.extendedProps.Id
    this.newEditObj['evType'] = event.extendedProps.evType
    this.newEditObj['date'] = event.start.split('T')[0]
    this.newEditObj['startTime'] = event.start.split('T')[1].split('+')[0]
    this.newEditObj['endTime'] = event.end.split('T')[1].split('+')[0]
    this.newEditObj['name'] = event.extendedProps.name
    this.newEditObj['emailId'] = event.extendedProps.emailId


    console.log("end ", event.end);
    console.log('newObj ', this.newObj);



  }


  // ---------------onDateClick starts---------------

  // onDateClick(res: any) {

  //   console.log('Clicked on date : ' + res.dateStr); //2024-02-13

  //   this.currentDate = new Date();
  //   console.log("currentDate ", this.currentDate); //Mon Feb 19 2024 12:38:05 GMT+0530 (India Standard Time)create-meeting.component.ts:238 
  //   this.currentformattedDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd'); //2024-02-19
  //   console.log("currentformattedDate ", this.currentformattedDate);

  //   //if selected date is earlier than today's date
  //   if (res.dateStr < this.currentformattedDate) {
  //     alert('Please select a date on or after today.')
  //   }
  //   else {//if selected date is on or later than today's date
  //     console.log("res ", res)
  //     const selectedDay = res.date.getDay();

  //     if (selectedDay == 0) {
  //       this.selectedDayName = "Sunday"
  //     }
  //     else if (selectedDay == 1) {
  //       this.selectedDayName = "Monday"
  //     }
  //     else if (selectedDay == 2) {
  //       this.selectedDayName = "Tuesday"
  //     }
  //     else if (selectedDay == 3) {
  //       this.selectedDayName = "Wednesday"
  //     }
  //     else if (selectedDay == 4) {
  //       this.selectedDayName = "Thursday"
  //     }
  //     else if (selectedDay == 5) {
  //       this.selectedDayName = "Friday"
  //     }
  //     else if (selectedDay == 6) {
  //       this.selectedDayName = "Saturday"
  //     }

  //     const selectedDateis = res.dateStr;
  //     console.log("selectedDate ", selectedDateis);


  //     console.log(selectedDateis[5]);
  //     console.log(selectedDateis[6]);

  //     if (selectedDateis[5] == 0 && selectedDateis[6] == 1) { //i.e like month is 01
  //       this.selectedMonth = "January"
  //     }
  //     else if (selectedDateis[5] == 0 && selectedDateis[6] == 2) {//i.e like month is 02
  //       this.selectedMonth = "February"
  //     }
  //     else if (selectedDateis[6] == 3) {//i.e like month is 03
  //       this.selectedMonth = "March"
  //     }
  //     else if (selectedDateis[6] == 4) {
  //       this.selectedMonth = "April"
  //     }
  //     else if (selectedDateis[6] == 5) {
  //       this.selectedMonth = "May"
  //     }
  //     else if (selectedDateis[6] == 6) {
  //       this.selectedMonth = "June"
  //     }
  //     else if (selectedDateis[6] == 7) {
  //       this.selectedMonth = "July"
  //     }
  //     else if (selectedDateis[6] == 8) {
  //       this.selectedMonth = "August"
  //     }
  //     else if (selectedDateis[6] == 9) {
  //       this.selectedMonth = "September"
  //     }
  //     else if (selectedDateis[5] == 1 && selectedDateis[6] == 0) {
  //       this.selectedMonth = "October"
  //     }
  //     else if (selectedDateis[5] == 1 && selectedDateis[6] == 1) {
  //       this.selectedMonth = "November"
  //     }
  //     else if (selectedDateis[5] == 1 && selectedDateis[6] == 2) {
  //       this.selectedMonth = "December"
  //     }

  //     console.log(this.selectedDayName, this.selectedMonth, this.dateSelected);




  //     const selectedDate = res.dateStr;
  //     this.subscription = this.apiService.userUnavailabelOnArray$.subscribe((userUnavailabelOnArray$) => {
  //       // this.loggedInName = userLoggedInName;
  //       // console.log("logged in user name is ",this.loggedInName)
  //       console.log("array ", userUnavailabelOnArray$);
  //     });

  //     let selectedNonWorkingDay = false
  //     for (let i = 0; i < this.nonWorkingDays.length; i++) {
  //       if (selectedDay == this.nonWorkingDays[i]) {
  //         selectedNonWorkingDay = true
  //         this.displayTimeDiv = false;
  //         alert('User unavailable on this day!');
  //         return;
  //       }
  //     }
  //     // if (selectedDay === 1) {
  //     //   alert('User unavailable at this time!');
  //     //   return;
  //     // } 


  //     if (selectedNonWorkingDay == false) {
  //       this.displayTimeDiv = true;
  //       this.dateSelected = res.dateStr

  //       // workingHrsAsPerDays = {
  //       //   1:{start:"09:00:00",
  //       //   end:"17:00:00"}

  //       //   2:{start:"09:00:00",
  //       //   end:"17:00:00"}

  //       //   3:{start:"09:00:00",
  //       //   end:"17:00:00"}
  //       // }


  //       for (let key in this.workingHrsAsPerDays) {
  //         if (selectedDay == key) {
  //           this.workingHrStart = this.workingHrsAsPerDays[key].start
  //           this.workingHrEnd = this.workingHrsAsPerDays[key].end
  //         }
  //       }

  //       let workingHrStart = this.workingHrStart //09:00:00
  //       let workingHrEnd = this.workingHrEnd //17:00:00

  //       console.log("workingHrStart ", workingHrStart, "workingHrEnd ", workingHrEnd);


  //       let workingStartHours = Number(`${workingHrStart[0]}${workingHrStart[1]}`) //9
  //       let workingStartMinutes = Number(`${workingHrStart[3]}${workingHrStart[4]}`) //0
  //       console.log("workingStartHours ", workingStartHours, "workingStartMinutes ", workingStartMinutes);

  //       let workingEndHours = Number(`${workingHrEnd[0]}${workingHrEnd[1]}`) //17

  //       let workingEndMinutes = Number(`${workingHrEnd[3]}${workingHrEnd[4]}`) //0

  //       console.log("workingEndHours ", workingEndHours, "workingEndMinutes ", workingEndMinutes);

  //       let allTimesArray = []

  //       let timeStr = workingHrStart //09:00:00

  //       allTimesArray.push(timeStr)


  //       console.log("workingStartHours ", workingStartHours, typeof workingStartHours);
  //       console.log("workingEndHours ", workingEndHours, typeof workingEndHours);
  //       console.log("workingStartMinutes ", workingStartMinutes, typeof workingStartMinutes);
  //       console.log("workingEndMinutes ", workingEndMinutes, typeof workingEndMinutes);


  //       console.log(workingStartHours <= workingEndHours);
  //       console.log(typeof workingEndHours);


  //       // allTimesArray = ['09:00:00']

  //       //9               <    17
  //       while (workingStartHours < workingEndHours) {
  //         console.log("inside while ");

  //         // console.log("workingStartHours 278 ",workingStartHours, typeof workingStartHours);
  //         // console.log("workingEndHours 279 ",workingEndHours, typeof workingEndHours);
  //         // console.log("workingStartMinutes 280 ",workingStartMinutes, typeof workingStartMinutes);
  //         // console.log("workingEndMinutes 281 ",workingEndMinutes, typeof workingEndMinutes);

  //         // console.log("this.duration.minutes 283 ",this.duration["minutes"], typeof this.duration["minutes"]);
  //         // console.log("this.duration 284 ",this.duration, typeof this.duration);       


  //         workingStartHours = workingStartHours + Number(this.duration.hrs)
  //         workingStartMinutes = workingStartMinutes + Number(this.duration.minutes)
  //         console.log("workingStartHours 287 ", workingStartHours, typeof workingStartHours);
  //         console.log("workingStartMinutes 288 ", workingStartMinutes, typeof workingStartMinutes);

  //         if (workingStartMinutes >= 60) {
  //           workingStartHours = workingStartHours + Math.abs(workingStartMinutes / 60)
  //           workingStartMinutes = workingStartMinutes - 60 * (Math.abs(workingStartMinutes / 60))
  //         }

  //         // console.log("workingStartHours 295 ",workingStartHours, typeof workingStartHours);
  //         // console.log("workingStartMinutes 296 ",workingStartMinutes, typeof workingStartMinutes);

  //         // console.log("workingStartHours ",workingStartHours,"workingStartMinutes ", workingStartMinutes);


  //         //buulding timestring properly because it is a string
  //         if (workingStartHours < 10) {
  //           if (workingStartMinutes < 10) {
  //             timeStr = `0${workingStartHours}:0${workingStartMinutes}:00`
  //           }
  //           else {
  //             timeStr = `0${workingStartHours}:${workingStartMinutes}:00`
  //           }
  //         }
  //         else {
  //           if (workingStartMinutes < 10) {
  //             timeStr = `${workingStartHours}:0${workingStartMinutes}:00`
  //           }
  //           else {
  //             timeStr = `${workingStartHours}:${workingStartMinutes}:00`
  //           }
  //         }

  //         allTimesArray.push(timeStr)

  //       }

  //       console.log("allTimesArray ", allTimesArray);
  //       this.allTimesArray = allTimesArray



  //       // let allTimesArray = ['10:00:00', '10:30:00', '11:00:00', '11:30:00', '12:00:00', '12:30:00', '01:00:00', '01:30:00', '02:00:00', '02:30:00', '03:00:00', '03:30:00', '04:00:00', '04:30:00', '05:00:00', '05:30:00', '06:00:00', '06:30:00']

  //       let usersBookedStTimes = []
  //       let usersBookedEndTimes = []
  //       let eventDate = ""

  //       console.log("Checking Events after date click ", this.Events);

  //       //  [ {Id: "65c9c03f0766a7f15e54e04a",end: "2019-01-18T09:30:00+05:30",start: "2019-01-18T09:00:00+05:30"},
  //       // {Id: "65c9c03f0766a7f15e54e04a",end: "2019-01-19T09:30:00+05:30",start: "2019-01-19T09:00:00+05:30"}]



  //       for (let i = 0; i < this.Events.length; i++) {
  //         let obj = this.Events[i]
  //         console.log("obj ", obj);

  //         eventDate = obj['start'].split('T')[0] //2019-01-18
  //         console.log("eventDate ", eventDate);

  //         console.log("eventDate ", eventDate, "this.dateSelected ", this.dateSelected, eventDate == this.dateSelected);

  //         if (eventDate == this.dateSelected) {
  //           let eventStartTime = obj['start'].split('T')[1] //09:00:00
  //           // let eventStartTime = time.split('+')[0] //09:00:00
  //           let eventEndTime = obj['end'].split('T')[1] //09:00:00
  //           console.log("eventStartTime ", eventStartTime);

  //           usersBookedStTimes.push(eventStartTime)
  //           usersBookedEndTimes.push(eventEndTime)
  //         }
  //       }
  //       console.log("usersBookedStTimes ", usersBookedStTimes);
  //       console.log("usersBookedEndTimes ", usersBookedEndTimes);


  //       let usersAvailaibleTimes = []

  //       console.log("dutration of user", this.evDurHrs, this.evDurMins);



  //       for (let i = 0; i < allTimesArray.length; i++) {//all the times
  //         console.log("allTimesArray ", allTimesArray[i]);

  //         let found = false
  //         for (let j = 0; j < usersBookedStTimes.length; j++) {
  //           if (allTimesArray[i] == usersBookedStTimes[j]) { //all times equal booked time 09:00:00
  //             console.log("satisfied allTimesArray[i] == usersBookedStTimes[j] ", allTimesArray[i], usersBookedStTimes[j]);

  //             found = true
  //             break;
  //           }
  //           else if ((usersBookedStTimes[j] < allTimesArray[i]) && (allTimesArray[i] < usersBookedEndTimes[j])) {//all times is in between booked times
  //             console.log("satisfied usersBookedStTimes[j] < allTimesArray[i] && allTimesArray[i] > usersBookedEndTimes[j] ", usersBookedStTimes[j], allTimesArray[i], usersBookedEndTimes[j]);
  //             found = true
  //             break;

  //           }
  //           else if (i == allTimesArray.length - 1) { //last time 
  //             console.log("satisfied last element ", allTimesArray[i]);

  //             found = true
  //             break;
  //           }
  //           else {
  //             let hrStr = `${allTimesArray[i][0]}${allTimesArray[i][1]}`
  //             let minStr = `${allTimesArray[i][3]}${allTimesArray[i][4]}`

  //             console.log("hrStr", hrStr, 'minStr', minStr);
  //             //                    16                30

  //             console.log("this.evDurHrs ", this.evDurHrs, "this.evDurMins ", this.evDurMins);
  //             //                                 1                                   0     


  //             let hrNum = 0
  //             let minNum = 0


  //             hrNum = Number(hrStr) + Number(this.evDurHrs)
  //             minNum = Number(minStr) + Number(this.evDurMins)

  //             console.log('hrNum ', hrNum, 'minNum ', minNum);


  //             if (minNum >= 60) {
  //               hrNum = hrNum + Math.abs(minNum / 60)
  //               minNum = minNum - 60 * (Math.abs(minNum / 60))
  //             }

  //             console.log("hrNum ", hrNum, "minNum ", minNum);

  //             let imaginaryMeetEndTime = ''
  //             if (hrNum < 10) {
  //               if (minNum < 10) {
  //                 imaginaryMeetEndTime = `0${hrNum}:0${minNum}:00`
  //               }
  //               else {
  //                 imaginaryMeetEndTime = `0${hrNum}:${minNum}:00`
  //               }
  //             }
  //             else {
  //               if (minNum < 10) {
  //                 imaginaryMeetEndTime = `${hrNum}:0${minNum}:00`
  //               }
  //               else {
  //                 imaginaryMeetEndTime = `${hrNum}:${minNum}:00`
  //               }
  //             }

  //             console.log("imaginaryMeetEndTime ", imaginaryMeetEndTime);
  //             console.log("for whome imaginaryMeetEndTime ", allTimesArray[i]);


  //             if (usersBookedStTimes[j] < imaginaryMeetEndTime && imaginaryMeetEndTime < usersBookedEndTimes[j]) {
  //               console.log("satisfied imaginary end time in between meetings ", allTimesArray[i]);
  //               console.log('usersBookedStTimes[j]<imaginaryMeetEndTime && imaginaryMeetEndTime<usersBookedEndTimes[j] ', usersBookedStTimes[j], imaginaryMeetEndTime, usersBookedEndTimes[j]);
  //               found = true
  //               break;
  //             }
  //             if (allTimesArray[i] < usersBookedStTimes[j] && usersBookedStTimes[j] < imaginaryMeetEndTime) {
  //               found = true
  //               break;
  //             }
  //             if (allTimesArray[i] < usersBookedEndTimes[j] && usersBookedEndTimes[j] < imaginaryMeetEndTime) {
  //               found = true
  //               break;
  //             }
  //             else {
  //               console.log("imaginaryMeetEndTime > allTimesArray[allTimesArray.length-1] ", imaginaryMeetEndTime, allTimesArray[allTimesArray.length - 1], imaginaryMeetEndTime > allTimesArray[allTimesArray.length - 1]);

  //               if (imaginaryMeetEndTime > allTimesArray[allTimesArray.length - 1]) {
  //                 found = true
  //                 break;
  //               }
  //             }
  //           }
  //         }

  //         if (found == false) {
  //           usersAvailaibleTimes.push(allTimesArray[i])
  //         }
  //       }

  //       this.userAvailaibleArray = usersAvailaibleTimes

  //       console.log("userAvailaibleArray ", this.userAvailaibleArray);
  //     }
  //   }


  // }

  // ---------------onDateClick ends---------------

  // ---------------onDateClick new starts---------------

  onDateClick(res: any) {

    console.log('Clicked on date : ' + res.dateStr); //2024-02-13


    this.dateSelected = res.dateStr

    let returnOffindHowManyEventsAreAlreadyBookedFnctn;
    console.log("this.noOfMeetingsAllowedPerDay ", this.noOfMeetingsAllowedPerDay);


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
          let usersBookedEndTimes = []
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
              let eventEndTime = obj['end'].split('T')[1]

              // let eventStartTime = time.split('+')[0] //09:00:00
              console.log("eventStartTime ", eventStartTime);
              console.log("eventEndTime ", eventEndTime);

              usersBookedTimes.push(eventStartTime)
              usersBookedEndTimes.push(eventEndTime)

            }
          }
          console.log("usersBookedTimes ", usersBookedTimes);
          console.log("usersBookedEndTimes ", usersBookedEndTimes);


          // let usersAvailaibleTimes = []

          // for (let i = 0; i < allTimesArray.length; i++) {
          //   let found = false
          //   for (let j = 0; j < usersBookedTimes.length; j++) {
          //     if (allTimesArray[i] == usersBookedTimes[j]) {
          //       found = true
          //       break;
          //     }
          //   }

          //   if (found == false) {
          //     usersAvailaibleTimes.push(allTimesArray[i])
          //   }
          // }

          // ===function to make userAvailaibleArray array==========================
          function filterBookedTimes(allTimesArray, userBookedStartTimesArray, userBookedEndTimesArray) {
            // Function to convert time string "HH:MM:SS" to seconds since midnight
            function timeToSeconds(time) {
              let [hours, minutes, seconds] = time.split(':').map(Number);
              return hours * 3600 + minutes * 60 + seconds;
            }

            // Convert all times to seconds
            let allTimesInSeconds = allTimesArray.map(timeToSeconds);
            let bookedStartTimesInSeconds = userBookedStartTimesArray.map(timeToSeconds);
            let bookedEndTimesInSeconds = userBookedEndTimesArray.map(timeToSeconds);

            // Function to check if a time is within any booked interval
            function isBooked(time) {
              for (let i = 0; i < bookedStartTimesInSeconds.length; i++) {
                if (time >= bookedStartTimesInSeconds[i] && time < bookedEndTimesInSeconds[i]) {
                  return true;
                }
              }
              return false;
            }

            // Filter out the times that are within the booked intervals
            let filteredTimesInSeconds = allTimesInSeconds.filter(time => !isBooked(time));

            // Convert the filtered times back to "HH:MM:SS" format
            function secondsToTime(seconds) {
              let hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
              let mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
              let secs = (seconds % 60).toString().padStart(2, '0');
              return `${hours}:${mins}:${secs}`;
            }

            return filteredTimesInSeconds.map(secondsToTime);
          }


          let usersAvailaibleTimes = filterBookedTimes(allTimesArray, usersBookedTimes, usersBookedEndTimes);
          console.log(usersAvailaibleTimes);

          // =============================


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

  // ---------------onDateClick new ends---------------

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


  // ---------------eventContent starts---------------


  // eventContent(info: any) {

  //   // setting classnames to nonworking days to style them in css
  //   const dayOfWeek = info.event.start.getDay();
  //   for(let i=0; i<this.nonWorkingDays.length; i++){
  //     if(dayOfWeek == this.nonWorkingDays[i]){
  //       const container = document.createElement('div');
  //       console.log("works");      
  //       info.el.classList.add("makeDim")
  //       return { domNodes: [container] };
  //     }
  //     return null;
  //   }
  //   // if (dayOfWeek === 0 || dayOfWeek === 1) { // Sunday or Monday
  //   //   info.el.classList.add('dim-day'); // Add a custom class for styling
  //   // }
  // }

  // ---------------eventContent ends---------------




  // ---------------changeDisplayTimeDiv starts---------------
  changeDisplayTimeDiv() {
    this.displayTimeDiv = false
  }
  // ---------------changeDisplayTimeDiv ends---------------


  // ---------------createEvent starts---------------
  createEvent(eventName) {
    this.loading = true
    console.log("called createEvent");
    console.log("event deets ", eventName, this.timeSelected, this.dateSelected);
    // df sds 10:00:00 2024-01-05
    // ---hardcoding endTime------
    // let allTimesArray = ['10:00:00', '10:30:00', '11:00:00', '11:30:00', '12:00:00', '12:30:00', '01:00:00', '01:30:00', '02:00:00', '02:30:00', '03:00:00', '03:30:00', '04:00:00', '04:30:00', '05:00:00', '05:30:00', '06:00:00', '06:30:00']
    let allTimesArray = this.allTimesArray
    let endTime = ""
    for (let i = 0; i < allTimesArray.length; i++) {
      if (allTimesArray[i] == this.timeSelected) {
        endTime = allTimesArray[i + 1]
        break;
      }

    }
    console.log("user ", this.userName, "userEmail ", this.emailId);
    if (eventName != "" && this.timeSelected != "" && this.dateSelected != "") {
      let event = {
        "title": eventName,
        "start": `${this.dateSelected}T${this.timeSelected}`,
        "end": `${this.dateSelected}T${endTime}`,
        "user": this.userName,
        "userEmail": this.emailId
      }
      this.apiService.scheduleMeetByCalendarLink(event).subscribe((response) => {
        console.log("meeting deets", response);
        console.log("response ", response);
        this.loading = false
        if (response && response['message']) {
          console.log("response ", response);
          alert(response['message']);
          window.location.reload();

          // this.apiService.getMeetingsHide(this.userName, this.emailId);
          // // meetingForm.resetForm()

          // this.subscription = this.apiService.formattedMeetingsHide$.subscribe((formattedMeetingsHide) => {
          //   console.log('Formatted Meetings Hide:', formattedMeetingsHide);
          //   this.formattedMeetingsHide = formattedMeetingsHide;
          //   this.Events = formattedMeetingsHide;
          //   console.log("Events ",this.Events);
          //   // this.trigger++;
          // })    

          // if(response['message'] == "Please login first."){
          //   this.router.navigate(['/login'])  

          // }
        }
        else {
          this.loading = false
          alert(response['message'])
          console.error('Invalid response:', response);
          // Handle the error or show an appropriate message
        }
      })
    }
    else {
      this.loading = false
      alert("PLease fill event Name and select the meeting time.")
    }
  }
  // ------createEvent ends-----------


  // ---------------setEventTime starts---------------

  setEventTime(time) {
    console.log("timeSelected ", this.timeSelected);
    this.timeSelected = time
    console.log("timeSelected ", this.timeSelected);
    this.showNext = true
    this.showNextFor = time
  }
  // ---------------setEventTime ends---------------



  // --------------------------------------------------

  nextButton(evName, oneTime) {
    localStorage.setItem("nameWhoseCalendar", this.nameWhoseCalendar)
    localStorage.setItem("evName", evName)
    let evDurHrs = localStorage.getItem("evDurHrs")//  0
    let evDurMins = localStorage.getItem("evDurMins") //30
    localStorage.setItem("oneTime", oneTime) //09:00:00
    localStorage.setItem("day", this.selectedDayName)
    localStorage.setItem("date", this.dateSelected)
    localStorage.setItem("month", this.selectedMonth)
    localStorage.setItem("evType", this.evType)

    console.log(oneTime[0], oneTime[1], oneTime[3], oneTime[4]);

    let hrs = Number(oneTime[0] + oneTime[1]) //09
    let mins = Number(oneTime[3] + oneTime[4]) //00

    console.log("hrs, mins", hrs, mins);

    // workingStartHours = workingStartHours + Math.abs(workingStartMinutes/60)
    // workingStartMinutes = workingStartMinutes - 60*(Math.abs(workingStartMinutes/60))

    let endTimeHrs = Number(hrs + Number(evDurHrs))  //9 + 0 = 9 
    let endTimeMins = Number(mins + Number(evDurMins)) //0 + 30 = 30
    console.log("endTimeHrs ", endTimeHrs, "endTimeMins ", endTimeMins);

    if (endTimeMins >= 60) {
      endTimeHrs = endTimeHrs + Math.floor(endTimeMins / 60)
      endTimeMins = endTimeMins - 60 * (Math.floor(endTimeMins / 60))
    }

    console.log("endTimeHrs ", endTimeHrs, "endTimeMins ", endTimeMins);

    let endTime;
    if (endTimeMins == 0) {
      if (endTimeHrs == 0) {
        endTime = `00:00:00`
      }
      else if (endTimeHrs < 10) {
        endTime = `0${endTimeHrs}:00:00`
      }
      else {
        endTime = `${endTimeHrs}:00:00`
      }
      // endTime = `${endTimeHrs}:00:00`
    }
    else if (endTimeMins < 10) {
      if (endTimeHrs == 0) {
        endTime = `00:0${endTimeMins}:00`
      }
      else if (endTimeHrs < 10) {
        endTime = `0${endTimeHrs}:0${endTimeMins}:00`
      }
      else {
        endTime = `${endTimeHrs}:0${endTimeMins}:00`
      }
      // endTime = `${endTimeHrs}:0${endTimeMins}:00`
    }
    else {
      if (endTimeHrs == 0) {
        endTime = `00:${endTimeMins}:00`
      }
      else if (endTimeHrs < 10) {
        endTime = `0${endTimeHrs}:${endTimeMins}:00`
      }
      else {
        endTime = `${endTimeHrs}:${endTimeMins}:00`
      }
      // endTime = `${endTimeHrs}:${endTimeMins}:00`
    }



    localStorage.setItem("endTime", endTime)
    // console.log("navigating to /makeMeeting");
    this.router.navigate(['/makeMeetingAdminComponent'])

  }


  closePopUp() {
    this.showMeets = false
    this.editMeet = false
    console.log(this.showMeets);
  }

  deleteMeeting() {
    this.showMeets = false
    this.apiService.deleteMeetByAdmin(this.selectedMeetingId, this.selectedEventId, this.selectedUserId)
  }

  editMeetingPopUp() {
    this.showMeets = false
    this.editMeet = true
  }

  editMeeting() {
    console.log(this.selectedUserId, this.selectedEventId, this.selectedMeetingId);
    console.log("newEditObj ", this.newEditObj);
    console.log(this.newObj.date, this.newEditObj.date, this.newObj.startTime, `${this.newEditObj.startTime}:00`, this.newObj.endTime, `${this.newEditObj.endTime}:00`, this.newObj.date == this.newEditObj.date, this.newObj.startTime == `${this.newEditObj.startTime}:00`, this.newObj.endTime == `${this.newEditObj.endTime}:00`);

    if (this.newObj.date == this.newEditObj.date && this.newObj.startTime == `${this.newEditObj.startTime}:00` && this.newObj.endTime == `${this.newEditObj.endTime}:00` || this.newObj.date == this.newEditObj.date && this.newObj.startTime == this.newEditObj.startTime && this.newObj.endTime == this.newEditObj.endTime) {
      alert('Date and time are same as previous.')
    }
    else {

      // newEditObj ={
      //   // 'evType':"",
      //   'date': "",
      //   'startTime': "",
      //   'endTime': "",
      //   'name' : "",
      //   'emailId' : "",
      //   // 'meetId' : ""
      // }

      this.apiService.editMeeting(this.selectedUserId, this.selectedEventId, this.selectedMeetingId, this.newEditObj.date, this.newEditObj.startTime, this.newEditObj.endTime, this.newEditObj.name, this.newEditObj.emailId)
      // this.router.navigate([''])
    }


  }



}
