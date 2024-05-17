import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { APIService } from '../api.service';
import { Calendar, CalendarOptions, EventContentArg, formatDate } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import multimonthPlugin from '@fullcalendar/multimonth'



import { DatePipe} from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

// "@fullcalendar/list": "^6.1.11",
// "@fullcalendar/multimonth": "^6.1.11",

interface EditObj {
  evType : string;
  date: string;
  startTime: string;
  endTime: string;
  name: string;
  emailId: string[];
}

interface NewEditObj {
  date: string;
  startTime: string;
  endTime: string;
  name: string;
  emailId: string[];
}



@Component({
  selector: 'app-scheduled-events',
  templateUrl: './scheduled-events.component.html',
  styleUrl: './scheduled-events.component.css'
})
export class ScheduledEventsComponent implements OnInit {
  formattedMeetingsHide: Array<any> = [];
  pastMeetings: Array<any> = []
  futureMeetings: Array<any> = []
  todaysMeetings: Array<any> = []
  Events: any[] = [];
  id = localStorage.getItem('emailID')
  // showId = false
  showDeetsFor = ""
  idSelected = ""
  nameWhoseCalendar = ""
  selectedUserAvObj = {}

  displayTimeDiv = false;
  dateSelected = ""
  selectedDayName = ""
  selectedMonth = ""
  userAvailaibleArray: string[] = []
  allTimesArray = []
  showNext = false
  selectedDateMeets = []
  showMeets = false
  meetId = ""
  selectedUserEmailId = ""
  eventObj = {}
  newObj : EditObj ={
    'evType':"",
    'date':"",
    'startTime':"",
    'endTime':"",
    'name' : "",
    'emailId' : []
  }



  newEditObj: NewEditObj ={
    // 'evType':"",
    'date': "",
    'startTime': "",
    'endTime': "",
    'name' : "",
    'emailId' : [],
    // 'meetId' : ""
  }


  currentDate: Date;
  currentformattedDate: string;
  workingHrStart = ""
  workingHrEnd = ""
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

  editMeet = false
  attendees:  string[] = [""];

  removedAttendee: string[] = [];
  removedAttendeeUndo: boolean = false;
  removedAttendeeEmail = ""

  calendarOptionsMonth: CalendarOptions = {
    initialView: 'dayGridMonth', 
    
    plugins: [dayGridPlugin],

    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: '',

    },
  
    

    views: {
      dayGridMonth: {
        
      },
     
    },
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
   
  };



  calendarOptionsWeek: CalendarOptions = {

    initialView: 'timeGridWeek',  
    plugins: [timeGridPlugin],
    dayHeaderFormat:{ weekday: 'short',  day: 'numeric' },

    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: '',

    },
    views: {


      timeGridWeek: {
        buttonText: 'Week'
      },

    },
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
   
  };


  calendarOptionsDay: CalendarOptions = {
    // initialView: 'dayGridMonth', 
    // initialView : 'timeline',
    initialView: 'timeGrid',  
    // plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin, multimonthPlugin],
    plugins: [timeGridPlugin],

    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      // right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek, multiMonth',
      right: '',

    },
    views: {
      dayGrid: {
        // options apply to dayGridMonth, dayGridWeek, and dayGridDay views
        // buttonText: 'Month'       
      },

      // timeGridFourDay: {
      //   // type: 'timeGrid',
      //   // duration: { days: 4 },
      //   buttonText: 'timeGrid'
      // },
      // timeGridWeek: {
      //   // options apply to dayGridWeek and timeGridWeek views
      //   buttonText: 'Week'
      // },
      // timeGridDay: {
      //   // options apply to dayGridDay and timeGridDay views
      //   buttonText: 'Day'
      // },
      // listWeek : {
      //   buttonText: 'List'
      // },
      // multiMonth:{
      //   buttonText: 'Multi month'
      // }
    },
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    // selectAllow: function (info){

    //   console.log("info", info);     

    //   const selectedDay = info.start.getDay()
    //   const selectedDate = info.start.getDate()

    //   return selectedDay !==0 && selectedDay!==6
    // }
  };


  

  constructor(private apiService: APIService, private route: ActivatedRoute, private router: Router, private datePipe: DatePipe) { }

  private subscription: Subscription;

  ngOnInit() {

    this.apiService.getMeetingsforUserToSee(this.id);

    this.subscription = this.apiService.getMeetingsforUserToSee$.subscribe((getMeetingsforUserToSee) => {
      console.log('Meetings in ts :', getMeetingsforUserToSee);

      // this.formattedMeetingsHide = formattedMeetingsHide;
      let newArr = []
      console.log(this.formattedMeetingsHide);


      for (let i = 0; i < getMeetingsforUserToSee.length; i++) {
        if (getMeetingsforUserToSee[i].start != "2019-01-18T09:00:00+05:30") {//not to push sample meeting
          newArr.push(getMeetingsforUserToSee[i])
        }
        // let today = new Date()
        // let day = today.toDateString()
        // console.log("day ",day);
        // Thu Feb 22 2024     

        // 2019-01-18T09:00:00+05:30
        // if(day > formattedMeetingsHide[i].start){
        //   this.pastMeetings.push(formattedMeetingsHide[i])
        // }
        // else if(day < formattedMeetingsHide[i].start){
        //   this.futureMeetings.push(formattedMeetingsHide[i])
        // }
        // else{
        //   this.todaysMeetings.push(formattedMeetingsHide[i])
        // }

        //today  Thu Feb 22 2024 
        //start  2019-01-18

        // console.log("Thu Feb 22 2024 11:54:17 GMT+0530 (India Standard Time)"<"Feb 25 2024");        
      }

      this.formattedMeetingsHide = newArr

      // this.Events = formattedMeetingsHide;
      console.log("Events ", this.Events);
    });


    // this.route.queryParams.subscribe(params => {
    console.log('Create Meeting Component initialized');
    // const name = params['name'];
    // this.nameWhoseCalendar = name

    const name = localStorage.getItem("userLoggedInName")
    this.nameWhoseCalendar = name

    // const id = params['id'];
    const id = localStorage.getItem("emailID")

    console.log("ng oninit called");
    this.apiService.setUserName(name);
    this.apiService.setUserEmailId(id);
    console.log('Name:', name);
    console.log('ID:', id);
    // this.evName = params['evName']
    // this.evDurHrs = Number(params['evDurHrs'])
    // this.evDurMins = Number(params['evDurMins'])


    // Fetch meetings when component initializes
    console.log("sending id ", id);

    this.apiService.getMeetingsforUserToSee(id);
    this.apiService.getSelectedUsersAvailaibilityObj()

    this.subscription = this.apiService.getMeetingsforUserToSee$.subscribe((Meetings) => {
      console.log('Meetings in ts :', Meetings);
      this.formattedMeetingsHide = Meetings;
      this.Events = Meetings;

      console.log("Events ", this.Events);
    });


    // this.apiService.getSelectedUsersAvailaibilityObj()

    this.subscription = this.apiService.selectedUserAvailabilityObj$.subscribe((avObj) => {
      this.selectedUserAvObj = avObj
      console.log("selectedUserAvObj ", this.selectedUserAvObj);


      this.duration = this.selectedUserAvObj["duration"]
      this.workingHrsAsPerDays = this.selectedUserAvObj["workingHrs"]

      this.workingDays = this.selectedUserAvObj["workingDays"]
      this.nonWorkingDays = this.selectedUserAvObj["nonWorkingDays"]

      // console.log("duration ",this.duration);

    })


    // this.subscription = this.apiService.selectedUserAvailabilityObj$.subscribe((avObj) => {
    //   console.log('Av Obj', avObj);
    //   this.selectedUserAvObj = avObj;
    //   console.log("this av obj ",this.selectedUserAvObj);
    // });

    setTimeout(() => {
      this.calendarOptionsMonth = {
        initialView: 'dayGridMonth',
        events: this.Events, //commented so that events are not shown on calendar
        dateClick: this.onDateClick.bind(this),
        // events: [
        //   {
        //     start: '2024-03-03T11:00:00',
        //     end: '2024-03-03T11:30:00',
        //     // start: '2024-03-03 10:00:00',
        //     // end: '2024-03-03 10:30:00',
        //     evName :"Trial",
        //     // display: 'background',
        //     // color : 'black',
        //     backgroundColor : 'red',

        //   },
        //   {
        //     start: '2024-03-03T10:00:00',
        //     end: '2024-03-03T10:30:00',
        //     // start: '2024-03-03',
        //     // end: '2024-03-03',
        //     evName :"Trial2",
        //     // display: 'background',
        //     // color : 'black',
        //     backgroundColor : 'green',

        //   },
        // {
        //   groupId: 'testGroupId',
        //   start: '2024-03-04T16:00:00',
        //   end: '2024-03-04T16:30:00',
        //   evName :"Trial",
        //   // display: 'background',

        //   // display: 'inverse-background',
        //   // color : 'black'
        //   backgroundColor : 'blue',

        // }
        // ],
        // contentHeight : 'auto',
        // slotDuration : '00:10:10',
        // snapDuration : '00:10:10',


        // eventMouseEnter: function(mouseEnterInfo){
        //   console.log("mouseEnterInfo ", mouseEnterInfo);
          
        // },
        
        dayMaxEvents : 100,
        eventOrder : 'start',
        displayEventTime : false, //hides time
        eventDisplay : 'block', // shows strip
        dayCellContent: this.theDayCellContent.bind(this),
        eventClick: this.onEventClick.bind(this)
        // eventDisplay : 'auto', // shows dots

        

        
        // dayMaxEventRows : true,
        
        // eventDisplay : 'list-item',
        // eventBackgroundColor : 'red',

        

      }
      this.calendarOptionsWeek = {
        initialView: 'timeGridWeek',
        events: this.Events, //commented so that events are not shown on calendar
        
        
        // events: [
        //   {
        //     start: '2024-03-04T10:00:00',
        //     end: '2024-03-04T10:30:00',
        //     evName :"Trial",
        //     display: 'background',
        //     color : 'black',
        //     backgroundColor: 'red'
        //   },
        // {
        //   groupId: 'testGroupId',
        //   start: '2024-03-04T16:00:00',
        //   end: '2024-03-04T16:30:00',
        //   evName :"Trial",
        //   display: 'background',
        //   color : 'black'
        // }
        // ],
        dateClick: this.onDateClick.bind(this),

        dayCellContent: this.theDayCellContent.bind(this),
        eventClick: this.onEventClick.bind(this),

      }
      this.calendarOptionsDay = {
        initialView: 'timeGrid',
        events: this.Events, 
        // dateClick: this.onDateClick.bind(this),
        dayCellContent: this.theDayCellContent.bind(this),
        eventClick: this.onEventClick.bind(this)
      }
    }, 2500);
    // })

  }


  // ---------------------------

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
  onDateClick(res: any) {

    console.log('Clicked on event : ' + res);
    alert(res)
    
    this.selectedDateMeets = []

    console.log('Clicked on date : ' + res.dateStr); //2024-02-13

    // console.log("res ", res);


    console.log("events after date click", this.Events);

    this.showMeets = true
    for (let i = 0; i < this.Events.length; i++) {    



      if (res.dateStr == this.Events[i].start.split('T')[0]) {
        console.log("start date",this.Events[i].start.split('T')[0]);
        console.log("meet ", this.Events[i]);
        let date = this.Events[i].start.split('T')[0]
        let startTime = this.Events[i].start.split('T')[1]
        let endTime = this.Events[i].end.split('T')[1]

        // console.log("endTime ", endTime);
        


        // this.Events[i]['date'] = this.Events[i].start.split['T'][0]
        // this.Events[i]['startTime'] = this.Events[i].start.split['T'][1]
        // this.Events[i]['endTime'] = this.Events[i].end.split['T'][1]

        let newObj = {}

        newObj['evType'] = this.Events[i].evType
        newObj['date'] = date
        newObj['startTime'] = startTime
        newObj['endTime'] = endTime
        newObj['name'] = this.Events[i].name
        newObj['emailId'] = this.Events[i].emailId
        console.log("event ", newObj);

        this.selectedDateMeets.push(newObj)
      }
    }



  }
  // ------------------


  // -----------------
  onEventClick(res: any) {
    this.showMeets = true

    let response = JSON.stringify(res)
    response = JSON.parse(response)
    let event = response['event']
    console.log("response ", response);
    console.log("event ", response['event']);

    this.meetId = event.extendedProps.Id


    this.newObj['evType'] = event.extendedProps.evType
    this.newEditObj['evType'] = event.extendedProps.evType
    console.log("this.newObj['evType'] ", this.newObj['evType']);
     
    this.newObj['date'] = event.start.split('T')[0]
    this.newEditObj['date'] = event.start.split('T')[0]
    console.log("this.newObj['date'] ", this.newObj['date']);
    
    this.newObj['startTime'] = event.start.split('T')[1].split('+')[0]
    this.newEditObj['startTime'] = event.start.split('T')[1].split('+')[0]
    console.log("this.newObj['startTime'] ", this.newObj['startTime']);
    
    console.log("end ", event.end);
    
    this.newObj['endTime'] = event.end.split('T')[1].split('+')[0]
    this.newEditObj['endTime'] = event.end.split('T')[1].split('+')[0]
    console.log("this.newObj['endTime'] ", this.newObj['endTime']);
    
    this.newObj['name'] = event.extendedProps.name
    this.newEditObj['name'] = event.extendedProps.name
    console.log("this.newObj['name'] ", this.newObj['name']);
    
    this.newObj['emailId'] = event.extendedProps.emailId
    this.newEditObj['emailId'] = event.extendedProps.emailId
    console.log("this.newObj['emailId'] ", this.newObj['emailId']);
    


    console.log('newObj ', this.newObj);  
  }

  // -------------------

  setEventId(id) {
    console.log("idSelected ", this.idSelected);
    this.idSelected = id
    console.log("idSelected ", this.idSelected);
    // this.showId = true
    this.showDeetsFor = id
  }

  closeDeets() {
    this.idSelected = ""
    console.log("idSelected ", this.idSelected);
    this.showDeetsFor = ""
  }

  closePopUp(){
    this.showMeets = false
    this.editMeet = false
    console.log(this.showMeets);    
  }
 
  editMeetingPopUp(){
    this.showMeets = false
    this.editMeet = true
  }

  addAttendee() {
    this.attendees.push('');
    console.log(this.attendees);
    
  }

  removeAttendee(index: number) {
    this.attendees.splice(index, 1);
    console.log(this.attendees);
  }

  removeExistingAttendee(index, email) {
    // this.removedAttendee = { emailId: this.newObj.emailId, name: this.newObj.name };
    // this.newEditObj.emailId = [];
    this.newEditObj.name = '';
    this.newEditObj['emailId'].splice(index, 1)
    this.removedAttendeeUndo = true;
    this.removedAttendeeEmail = email
    console.log(this.newEditObj);
    
}

// undoRemoveExistingAttendee() {
//     if (this.removedAttendee) {
//         this.newEditObj.emailId.push(this.removedAttendeeEmail)
//         this.newEditObj.name = this.removedAttendee.name;
//         this.removedAttendee = null;
//         this.removedAttendeeUndo = false;
//     }
//     console.log(this.newEditObj);

// }


  editMeetingfromUserSide(){      
    this.selectedUserEmailId = localStorage.getItem("emailID")
    console.log(this.selectedUserEmailId, this.meetId);
    console.log("meetId ", this.meetId);      
    console.log("newEditObj ",this.newEditObj);
    console.log(this.newObj.date, this.newEditObj.date, this.newObj.startTime, `${this.newEditObj.startTime}:00`, this.newObj.endTime, `${this.newEditObj.endTime}:00`, this.newObj.date==this.newEditObj.date , this.newObj.startTime==`${this.newEditObj.startTime}:00` , this.newObj.endTime==`${this.newEditObj.endTime}:00`);
    
    this.newEditObj.emailId = [...this.newEditObj.emailId, ...this.attendees]
 

    console.log("attendees ", this.attendees);
    console.log("newEditObj ", this.newEditObj);

    
    
    this.editMeet = false
    if(this.newObj.date==this.newEditObj.date && this.newObj.startTime==`${this.newEditObj.startTime}:00` && this.newObj.endTime==`${this.newEditObj.endTime}:00` || this.newObj.date==this.newEditObj.date && this.newObj.startTime==this.newEditObj.startTime && this.newObj.endTime==this.newEditObj.endTime){
      alert('Date and time are same as previous.')
    }
    else{
      this.apiService.editMeetingfromUserSide(this.selectedUserEmailId, this.meetId, this.newEditObj.date, this.newEditObj.startTime, this.newEditObj.endTime, this.newEditObj.name, this.newEditObj.emailId)  
    }    
  }


}