import { Component , OnInit, ChangeDetectorRef } from '@angular/core';
import { View, EventSettingsModel, ActionEventArgs, PopupOpenEventArgs, ScheduleComponent} from '@syncfusion/ej2-angular-schedule';
import { APIService } from '../api.service';
import { Subscription} from 'rxjs';
import { ActivatedRoute, Router} from '@angular/router';
import { Calendar, CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DatePipe } from '@angular/common';



// <ng-container *ngIf="formattedMeetingsHide.length > 0">
// <ejs-schedule #scheduleObj height="700" width="700" [currentView]="setView" [selectedDate]='selectedDate' [eventSettings]='eventObject' (popupOpen)='onPopupOpen($event)' (actionComplete)="onActionComplete($event)"></ejs-schedule>
// </ng-container>

@Component({
  selector: 'app-calendar-by-link',
  // template:   `
  // <ng-container *ngIf="formattedMeetingsHide.length > 0">
  //   <ejs-schedule #scheduleObj height="850" width="1250" [currentView]="setView" [selectedDate]='selectedDate' [eventSettings]='eventObject' (actionComplete)="onActionComplete($event)"></ejs-schedule>
  //   </ng-container>
  // `,
  templateUrl: './calendar-by-link.component.html',
  styleUrl: './calendar-by-link.component.css'  
})
export class CalendarByLinkComponent implements OnInit {


  currentDate: Date;
  currentformattedDate: string;


  userName: string = '';
  emailId : string = '';
  loggedInName = localStorage.getItem("userLoggedInName" || "")
  token = localStorage.getItem('token')
  evName = localStorage.getItem("evName")
  evDurHrs = Number(localStorage.getItem("evDurHrs"))
  evDurMins = Number(localStorage.getItem("evDurMins"))
  evLocation = localStorage.getItem("eventLocation")
  // meetingArray : any[] = [];
  formattedMeetingsHide : object[] = [];
  timeSelected = "";
  eventName = "";
  eventDesc = "";
  loading = false
  selectedUserAvObj = {}
  nameWhoseCalendar = ""


  displayTimeDiv = false;
  dateSelected = ""
  selectedDayName= ""
  selectedMonth = ""
  userAvailaibleArray: string[] = []
  Events: any[] = [];
  allTimesArray = []
  showNext = false

  workingHrStart = ""
  workingHrEnd = ""

  // hardcoding--------
  duration = {
    "hrs" : 0,
    "minutes" : 30
  }
  workingHrsAsPerDays = {
    "1" : {
      "start" : "09:00:00",
      "end" : "17:00:00"
    },
    "2" : {
      "start" : "09:00:00",
      "end" : "17:00:00"
    },
    "3" : {
      "start" : "09:00:00",
      "end" : "17:00:00"
    },
    "4" : {
      "start" : "09:00:00",
      "end" : "17:00:00"
    },
    "5" : {
      "start" : "09:00:00",
      "end" : "17:00:00"
    }
  }
  workingDays = [1,2,3,4,5]
  nonWorkingDays = [0,6]

  // hardcoding ends--------



  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin,  interactionPlugin],
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
    // selectAllow: function (info){

    //   console.log("info", info);     

    //   const selectedDay = info.start.getDay()
    //   const selectedDate = info.start.getDate()
      
    //   return selectedDay !==0 && selectedDay!==6
    // }
  };


  // trialArray : Array<any> = []
  // dataSource = this.formattedMeetings
  

  // -------------------------------
 
  constructor(private apiService: APIService, private route:ActivatedRoute,private router:Router, private datePipe: DatePipe){
    this.subscription = this.apiService.userName$.subscribe((userName) => {
      this.userName = userName;
      console.log(userName)
    });
    this.subscription = this.apiService.emailId$.subscribe((emailId) => {
      this.emailId = emailId;
      console.log(emailId)
    });
  }

  private subscription: Subscription;




ngOnInit(){

  if(!this.token){
    this.router.navigate(['/login']);
  }


  // -----taking name and email id from query paramaters----
  this.route.queryParams.subscribe(params => {
    console.log('Create Meeting Component initialized');
    const name = params['name'];
    this.nameWhoseCalendar = name
    const id = params['id'];
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
    
    this.apiService.getMeetingsHide(id);   
    this.apiService.getSelectedUsersAvailaibilityObj()
    
    this.subscription = this.apiService.formattedMeetingsHide$.subscribe((formattedMeetingsHide) => {
      console.log('Formatted Meetings Hide in ts :', formattedMeetingsHide);
      this.formattedMeetingsHide = formattedMeetingsHide;
      this.Events = formattedMeetingsHide;
      console.log("Events ",this.Events);
    });

  
  // this.apiService.getSelectedUsersAvailaibilityObj()

  this.subscription = this.apiService.selectedUserAvailabilityObj$.subscribe((avObj)=>{
    this.selectedUserAvObj = avObj
    console.log("selectedUserAvObj ",this.selectedUserAvObj);
    
  
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
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      // events: this.Events, //commented so that events are not shown on calendar
      dateClick: this.onDateClick.bind(this),
      dayCellContent : this.theDayCellContent.bind(this)
    }
    }, 2500);
  })
}

// ----------theDayCellContent starts----------
  theDayCellContent(info: any){  


    // <td aria-labelledby="fc-dom-22" role="gridcell" data-date="2024-03-06" class="fc-day fc-day-wed fc-day-past fc-daygrid-day"><div class="fc-daygrid-day-frame fc-scrollgrid-sync-inner"><div class="fc-daygrid-day-top"><a aria-label="March 6, 2024" id="fc-dom-22" class="fc-daygrid-day-number"><div>6</div></a></div><div class="fc-daygrid-day-events"><div class="fc-daygrid-day-bottom" style="margin-top: 0px;"></div></div><div class="fc-daygrid-day-bg"></div></div></td>
    const dayOfWeek = info.date.getDay();
    const date = info.date.getDate();
    // console.log(dayOfWeek);
    for(let i=0; i<this.nonWorkingDays.length; i++){
      if (dayOfWeek === this.nonWorkingDays[i]) {
        return { html: '<div style="color: grey">' + date +'</div>' };
      }      
    }
    return { html: '<div>' + date +'</div>' };
  }
// ----------theDayCellContent ends------------


// --------------THIS-onDateClick starts---------------

  onDateClick(res: any) {

    console.log('Clicked on date : ' + res.dateStr); //2024-02-13

    this.currentDate = new Date();
    console.log("currentDate ", this.currentDate); //Mon Feb 19 2024 12:38:05 GMT+0530 (India Standard Time)create-meeting.component.ts:238 
    this.currentformattedDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd'); //2024-02-19
    console.log("currentformattedDate ", this.currentformattedDate); 

    //if selected date is earlier than today's date
    if(res.dateStr < this.currentformattedDate){
      alert('Please select a date on or after today.')
    }
    else{//if selected date is on or later than today's date
    console.log("res ", res)
    const selectedDay = res.date.getDay();

    if(selectedDay==0){
      this.selectedDayName = "Sunday"
    }
    else if(selectedDay==1){
      this.selectedDayName = "Monday"
    }
    else if(selectedDay==2){
      this.selectedDayName = "Tuesday"
    }
    else if(selectedDay==3){
      this.selectedDayName = "Wednesday"
    }
    else if(selectedDay==4){
      this.selectedDayName = "Thursday"
    }
    else if(selectedDay==5){
      this.selectedDayName = "Friday"
    }
    else if(selectedDay==6){
      this.selectedDayName = "Saturday"
    }
    
    const selectedDateis = res.dateStr;
    console.log("selectedDate ", selectedDateis);


    console.log(selectedDateis[5]);
    console.log(selectedDateis[6]);

    if(selectedDateis[5]==0 && selectedDateis[6]==1){ //i.e like month is 01
      this.selectedMonth = "January"
    }
    else if(selectedDateis[5]==0 && selectedDateis[6]==2){//i.e like month is 02
      this.selectedMonth = "February"
    }
    else if(selectedDateis[6]==3){//i.e like month is 03
      this.selectedMonth = "March"
    }
    else if(selectedDateis[6]==4){
      this.selectedMonth = "April"
    }
    else if(selectedDateis[6]==5){
      this.selectedMonth = "May"
    }
    else if(selectedDateis[6]==6){
      this.selectedMonth = "June"
    }
    else if(selectedDateis[6]==7){
      this.selectedMonth = "July"
    }
    else if(selectedDateis[6]==8){
      this.selectedMonth = "August"
    }
    else if(selectedDateis[6]==9){
      this.selectedMonth = "September"
    }
    else if(selectedDateis[5]==1 && selectedDateis[6]==0){
      this.selectedMonth = "October"
    }
    else if(selectedDateis[5]==1 && selectedDateis[6]==1){
      this.selectedMonth = "November"
    }
    else if(selectedDateis[5]==1 && selectedDateis[6]==2){
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
      console.log("array ",userUnavailabelOnArray$);
    });   

    let selectedNonWorkingDay = false
    for(let i=0; i<this.nonWorkingDays.length; i++){
      if(selectedDay == this.nonWorkingDays[i]){
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

    
    if(selectedNonWorkingDay == false){
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
      

      for(let key in this.workingHrsAsPerDays){
        if(selectedDay == key){
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

      // let timeStr = workingHrStart //09:00:00
      let timeStr = workingHrStart[0]+workingHrStart[1]+workingHrStart[2]+workingHrStart[3]+workingHrStart[4]//09:00

      console.log("pushing workinghrstrt ", timeStr);
      
      
      allTimesArray.push(timeStr)

      
      console.log("workingStartHours ",workingStartHours, typeof workingStartHours);
      console.log("workingEndHours ",workingEndHours, typeof workingEndHours);
      console.log("workingStartMinutes ",workingStartMinutes, typeof workingStartMinutes);
      console.log("workingEndMinutes ",workingEndMinutes, typeof workingEndMinutes);
      
      
      console.log(workingStartHours<=workingEndHours);
      console.log(typeof workingEndHours);
      
      
      // allTimesArray = ['09:00:00']

            //9               <    17
      while(workingStartHours < workingEndHours){    
        console.log("inside while ");

        // console.log("workingStartHours 278 ",workingStartHours, typeof workingStartHours);
        // console.log("workingEndHours 279 ",workingEndHours, typeof workingEndHours);
        // console.log("workingStartMinutes 280 ",workingStartMinutes, typeof workingStartMinutes);
        // console.log("workingEndMinutes 281 ",workingEndMinutes, typeof workingEndMinutes);

        // console.log("this.duration.minutes 283 ",this.duration["minutes"], typeof this.duration["minutes"]);
        // console.log("this.duration 284 ",this.duration, typeof this.duration);       


        workingStartHours = workingStartHours + Number(this.duration.hrs)
        workingStartMinutes = workingStartMinutes + Number(this.duration.minutes)
        console.log("workingStartHours 287 ",workingStartHours, typeof workingStartHours);
        console.log("workingStartMinutes 288 ",workingStartMinutes, typeof workingStartMinutes);

        if(workingStartMinutes>=60){
          workingStartHours = workingStartHours + Math.floor(workingStartMinutes/60)
          workingStartMinutes = workingStartMinutes - 60*(Math.floor(workingStartMinutes/60))
        }

        // console.log("workingStartHours 295 ",workingStartHours, typeof workingStartHours);
        // console.log("workingStartMinutes 296 ",workingStartMinutes, typeof workingStartMinutes);

        // console.log("workingStartHours ",workingStartHours,"workingStartMinutes ", workingStartMinutes);
        

        //buulding timestring properly because it is a string
        if(workingStartHours < 10){
          if(workingStartMinutes < 10){
            timeStr = `0${workingStartHours}:0${workingStartMinutes}`
          }
          else{
            timeStr = `0${workingStartHours}:${workingStartMinutes}`
          }
        }
        else{
          if(workingStartMinutes < 10){
            timeStr = `${workingStartHours}:0${workingStartMinutes}`
          }
          else{
            timeStr = `${workingStartHours}:${workingStartMinutes}`
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

  
      
      for(let i=0; i<this.Events.length; i++){
        let obj = this.Events[i]
        console.log("obj ", obj);
        
        eventDate = obj['start'].split('T')[0] //2019-01-18
        console.log("eventDate ", eventDate);
        
        console.log("eventDate ", eventDate, "this.dateSelected ", this.dateSelected, eventDate == this.dateSelected);
        
        if(eventDate == this.dateSelected){
          let eventStartTime = obj['start'].split('T')[1] //09:00:00
          // let eventStartTime = time.split('+')[0] //09:00:00
          console.log("eventStartTime ", eventStartTime);
          
          usersBookedTimes.push(eventStartTime)      
        }
      }
      console.log("usersBookedTimes ",usersBookedTimes);
  
      let usersAvailaibleTimes = []
  
      for(let i=0; i<allTimesArray.length; i++){
        let found = false
        for(let j=0; j<usersBookedTimes.length; j++){
          if(allTimesArray[i] == usersBookedTimes[j]){
            found = true
            break;
          }
        }
  
        if(found == false){
          console.log("alltimes of i ", allTimesArray[i]);
          
          usersAvailaibleTimes.push(allTimesArray[i])
        }
      }
      
      this.userAvailaibleArray = usersAvailaibleTimes
  
      console.log(this.userAvailaibleArray);
    }
  }
    

  }

 // ---------------onDateClick ends---------------



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
changeDisplayTimeDiv(){
  this.displayTimeDiv = false
}
// ---------------changeDisplayTimeDiv ends---------------


// ---------------createEvent starts---------------
createEvent(eventName){
  this.loading = true
  console.log("called createEvent");
  console.log("event deets ", eventName, this.timeSelected, this.dateSelected);
  // df sds 10:00:00 2024-01-05
  // ---hardcoding endTime------
  // let allTimesArray = ['10:00:00', '10:30:00', '11:00:00', '11:30:00', '12:00:00', '12:30:00', '01:00:00', '01:30:00', '02:00:00', '02:30:00', '03:00:00', '03:30:00', '04:00:00', '04:30:00', '05:00:00', '05:30:00', '06:00:00', '06:30:00']
  let allTimesArray = this.allTimesArray
  let endTime = ""
  for(let i=0; i<allTimesArray.length; i++){
    if(allTimesArray[i]==this.timeSelected){
      endTime = allTimesArray[i+1]
      break;
    }
    
  }
  console.log("user " , this.userName, "userEmail " , this.emailId);
  if(eventName!="" && this.timeSelected!="" && this.dateSelected!=""){
    let event = {
        "title"  : eventName,
        "start"  : `${this.dateSelected}T${this.timeSelected}`,
        "end" : `${this.dateSelected}T${endTime}`,
        "user" : this.userName,
        "userEmail" : this.emailId
    }
    this.apiService.scheduleMeetByCalendarLink(event).subscribe((response)=>{
      console.log("meeting deets",response); 
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
  else{
    this.loading = false
    alert("PLease fill event Name and select the meeting time.")
  }  
}
// ------createEvent ends-----------






// --------------------------------------------------

nextButton(evName, evDurHrs, evDurMins, oneTime){
  localStorage.setItem("nameWhoseCalendar", this.nameWhoseCalendar)
  localStorage.setItem("evName", evName)
  localStorage.setItem("evDurHrs", evDurHrs)
  localStorage.setItem("evDurMins", evDurMins)
  localStorage.setItem("oneTime", oneTime)
  localStorage.setItem("day", this.selectedDayName)
  localStorage.setItem("date", this.dateSelected)
  localStorage.setItem("month", this.selectedMonth)

  console.log(oneTime[0],oneTime[1], oneTime[3], oneTime[4]);
  
  let hrs = Number(oneTime[0] + oneTime[1])
  let mins = Number(oneTime[3]+ oneTime[4])

  console.log("hrs, mins",hrs, mins);
  
  // workingStartHours = workingStartHours + Math.abs(workingStartMinutes/60)
  // workingStartMinutes = workingStartMinutes - 60*(Math.abs(workingStartMinutes/60))

  let endTimeHrs = Number(hrs + Number(evDurHrs))  
  let endTimeMins = Number(mins + Number(evDurMins))
  console.log("endTimeHrs ", endTimeHrs, "endTimeMins ", endTimeMins);

  if(endTimeMins>=60){
    endTimeHrs = endTimeHrs + Math.floor(endTimeMins/60)
    endTimeMins = endTimeMins - 60*(Math.floor(endTimeMins/60))
  }

  console.log("endTimeHrs ", endTimeHrs, "endTimeMins ", endTimeMins);
  
  let endTime;
  if(endTimeMins==0){
    endTime = `${endTimeHrs}:00:00`
  }
  else if(endTimeMins<10){
    endTime = `${endTimeHrs}:0${endTimeMins}:00`
  }
  else{
    endTime = `${endTimeHrs}:${endTimeMins}:00`
  }
  
  localStorage.setItem("endTime", endTime)
  // console.log("navigating to /makeMeeting");
  this.router.navigate(['/makeMeeting'])
  
}



















//   userName: string = '';
//   emailId : string = '';
//   loggedInName = localStorage.getItem("userLoggedInName" || "")

//   evName = localStorage.getItem("eventName")
//   evDurHrs = localStorage.getItem("eventDurationHrs")
//   evDurMins = localStorage.getItem("evDurMins")
//   evLocation = localStorage.getItem("eventLocation")
//   evType = localStorage.getItem("evType")
//   // meetingArray : any[] = [];
//   formattedMeetingsHide : object[] = [];
//   timeSelected = "";
//   eventName = "";
//   eventDesc = "";
//   loading = false
//   selectedUserAvObj = {}


//   displayTimeDiv = false;
//   dateSelected = ""
//   userAvailaibleArray: string[] = []
//   Events: any[] = [];
//   allTimesArray = []

//   workingHrStart = ""
//   workingHrEnd = ""

//   // hardcoding--------
//   duration = {
//     "hrs" : 0,
//     "minutes" : 30
//   }
//   workingHrsAsPerDays = {
//     "1" : {
//       "start" : "09:00:00",
//       "end" : "17:00:00"
//     },
//     "2" : {
//       "start" : "09:00:00",
//       "end" : "17:00:00"
//     },
//     "3" : {
//       "start" : "09:00:00",
//       "end" : "17:00:00"
//     },
//     "4" : {
//       "start" : "09:00:00",
//       "end" : "17:00:00"
//     },
//     "5" : {
//       "start" : "09:00:00",
//       "end" : "17:00:00"
//     }
//   }
//   workingDays = [1,2,3,4,5]
//   nonWorkingDays = [0,6]

//   // hardcoding ends--------



//   calendarOptions: CalendarOptions = {
//     plugins: [dayGridPlugin,  interactionPlugin],
//     initialView: 'dayGridMonth',
//     headerToolbar: {
//       left: 'prev,next',
//       center: 'title',
//       right: '',
//     },
//     weekends: true,
//     editable: true,
//     selectable: true,
//     selectMirror: true,
//     dayMaxEvents: true,
//     // selectAllow: function (info){

//     //   console.log("info", info);     

//     //   const selectedDay = info.start.getDay()
//     //   const selectedDate = info.start.getDate()
      
//     //   return selectedDay !==0 && selectedDay!==6
//     // }
//   };


//   // trialArray : Array<any> = []
//   // dataSource = this.formattedMeetings
  

//   // -------------------------------
 
//   constructor(private apiService: APIService, private route:ActivatedRoute,private router:Router){
//     this.subscription = this.apiService.userName$.subscribe((userName) => {
//       this.userName = userName;
//       console.log(userName)
//     });
//     this.subscription = this.apiService.emailId$.subscribe((emailId) => {
//       this.emailId = emailId;
//       console.log(emailId)
//     });
//   }

//   private subscription: Subscription;




// ngOnInit(){



//   // -----taking name and email id from query paramaters----
//   this.route.queryParams.subscribe(params => {
//     console.log('Calendar by link Component initialized');
//     const name = params['name'];
//     const id = params['id'];
//     console.log("ng oninit called"); 
//     this.apiService.setUserName(name);
//     this.apiService.setUserEmailId(id);    
//     console.log('Name:', name);
//     console.log('ID:', id);
    
//     // Fetch meetings when component initializes
//     this.apiService.getMeetingsHide(name);   
//     this.apiService.getSelectedUsersAvailaibilityObj()
    
//     this.subscription = this.apiService.formattedMeetingsHide$.subscribe((formattedMeetingsHide) => {
//       console.log('Formatted Meetings Hide:', formattedMeetingsHide);
//       this.formattedMeetingsHide = formattedMeetingsHide;
//       this.Events = formattedMeetingsHide;
//       console.log("Events ",this.Events);
//     });

  
//   // this.apiService.getSelectedUsersAvailaibilityObj()

//   this.subscription = this.apiService.selectedUserAvailabilityObj$.subscribe((avObj)=>{
//     this.selectedUserAvObj = avObj
//     console.log("selectedUserAvObj ",this.selectedUserAvObj);
    
  
//   this.duration = this.selectedUserAvObj["duration"]
//   this.workingHrsAsPerDays = this.selectedUserAvObj["workingHrs"]

//   this.workingDays = this.selectedUserAvObj["workingDays"]
//   this.nonWorkingDays = this.selectedUserAvObj["nonWorkingDays"]

//   // console.log("duration ",this.duration);
  
//   })
  
   
//   // this.subscription = this.apiService.selectedUserAvailabilityObj$.subscribe((avObj) => {
//   //   console.log('Av Obj', avObj);
//   //   this.selectedUserAvObj = avObj;
//   //   console.log("this av obj ",this.selectedUserAvObj);
//   // });

//   setTimeout(() => {
//     this.calendarOptions = {
//       initialView: 'dayGridMonth',
//       events: this.Events,
//       dateClick: this.onDateClick.bind(this),
//       dayCellContent : this.theDayCellContent.bind(this)
//     }
//     }, 2500);
//   })
// }

// // ----------theDayCellContent starts----------
//   theDayCellContent(info: any){    
//     const dayOfWeek = info.date.getDay();
//     const date = info.date.getDate();
//     // console.log(dayOfWeek);
//     for(let i=0; i<this.nonWorkingDays.length; i++){
//       if (dayOfWeek === this.nonWorkingDays[i]) {
//         return { html: '<div style="color: grey">' + date +'</div>' };
//       }      
//     }
//     return { html: '<div>' + date +'</div>' };
//   }
// // ----------theDayCellContent ends------------


// // ---------------onDateClick starts---------------

//   onDateClick(res: any) {

//     // alert('Clicked on date : ' + res.dateStr);
//     console.log("res ", res)
//     const selectedDay = res.date.getDay();
//     const selectedDateis = res.dateStr;
//     console.log("selectedDate ", selectedDateis);

  
//     // start = moment.utc(start).tz('Asia/Calcutta').format();
//     // let currentDateTime = new Date();
//     // currentDateTime = moment.utc(currentDateTime).tz('Asia/Calcutta').format();

//     // console.log(currentDateTime , start  , "and " ,start<currentDateTime)

//     // if(start<currentDateTime){
//     //     res.send({message: "Meetings cannot be scheduled earlier than the current date and time"})
//     // }

    
//     const selectedDate = res.dateStr;
//     this.subscription = this.apiService.userUnavailabelOnArray$.subscribe((userUnavailabelOnArray$) => {
//       // this.loggedInName = userLoggedInName;
//       // console.log("logged in user name is ",this.loggedInName)
//       console.log("array ",userUnavailabelOnArray$);
//     });   

//     let selectedNonWorkingDay = false
//     for(let i=0; i<this.nonWorkingDays.length; i++){
//       if(selectedDay == this.nonWorkingDays[i]){
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

    
//     if(selectedNonWorkingDay == false){
//       this.displayTimeDiv = true;
//       this.dateSelected = res.dateStr

//       for(let key in this.workingHrsAsPerDays){
//         if(selectedDay == key){
//           this.workingHrStart = this.workingHrsAsPerDays[key].start
//           this.workingHrEnd = this.workingHrsAsPerDays[key].end
//         }
//       }

//       let workingHrStart = this.workingHrStart
//       let workingHrEnd = this.workingHrEnd

//       console.log("workingHrStart ", workingHrStart, "workingHrEnd ", workingHrEnd);
      

//       let workingStartHours = Number(`${workingHrStart[0]}${workingHrStart[1]}`)
//       let workingStartMinutes = Number(`${workingHrStart[3]}${workingHrStart[4]}`)
//       console.log("workingStartHours ", workingStartHours, "workingStartMinutes ", workingStartMinutes);
      
//       let workingEndHours = Number(`${workingHrEnd[0]}${workingHrEnd[1]}`)
//       let workingEndMinutes = Number(`${workingHrEnd[3]}${workingHrEnd[4]}`)
//       console.log("workingEndHours ", workingEndHours, "workingEndMinutes ", workingEndMinutes);

//       let allTimesArray = []

//       let timeStr = workingHrStart
      
//       allTimesArray.push(timeStr)

//       console.log("workingStartHours ",workingStartHours, typeof workingStartHours);
//       console.log("workingEndHours ",workingEndHours, typeof workingEndHours);
//       console.log("workingStartMinutes ",workingStartMinutes, typeof workingStartMinutes);
//       console.log("workingEndMinutes ",workingEndMinutes, typeof workingEndMinutes);


//       console.log(workingStartHours<=workingEndHours);
//       console.log(typeof workingEndHours);
      
      

//       while(workingStartHours < workingEndHours){    
//         console.log("inside while ");

//         // console.log("workingStartHours 278 ",workingStartHours, typeof workingStartHours);
//         // console.log("workingEndHours 279 ",workingEndHours, typeof workingEndHours);
//         // console.log("workingStartMinutes 280 ",workingStartMinutes, typeof workingStartMinutes);
//         // console.log("workingEndMinutes 281 ",workingEndMinutes, typeof workingEndMinutes);

//         // console.log("this.duration.minutes 283 ",this.duration["minutes"], typeof this.duration["minutes"]);
//         // console.log("this.duration 284 ",this.duration, typeof this.duration);

        


//         workingStartHours = workingStartHours + Number(this.duration.hrs)
//         workingStartMinutes = workingStartMinutes + Number(this.duration.minutes)
//         console.log("workingStartHours 287 ",workingStartHours, typeof workingStartHours);
//         console.log("workingStartMinutes 288 ",workingStartMinutes, typeof workingStartMinutes);

//         if(workingStartMinutes>=60){
//           workingStartHours = workingStartHours + Math.abs(workingStartMinutes/60)
//           workingStartMinutes = workingStartMinutes - 60*(Math.abs(workingStartMinutes/60))
//         }

//         // console.log("workingStartHours 295 ",workingStartHours, typeof workingStartHours);
//         // console.log("workingStartMinutes 296 ",workingStartMinutes, typeof workingStartMinutes);

//         // console.log("workingStartHours ",workingStartHours,"workingStartMinutes ", workingStartMinutes);
        

//         if(workingStartHours < 10){
//           if(workingStartMinutes < 10){
//             timeStr = `0${workingStartHours}:0${workingStartMinutes}:00`
//           }
//           else{
//             timeStr = `0${workingStartHours}:${workingStartMinutes}:00`
//           }
//         }
//         else{
//           if(workingStartMinutes < 10){
//             timeStr = `${workingStartHours}:0${workingStartMinutes}:00`
//           }
//           else{
//             timeStr = `${workingStartHours}:${workingStartMinutes}:00`
//           }
//         }

//         allTimesArray.push(timeStr)

//       }

//       console.log("allTimesArray ", allTimesArray); 
//       this.allTimesArray = allTimesArray       

  
  
//       // let allTimesArray = ['10:00:00', '10:30:00', '11:00:00', '11:30:00', '12:00:00', '12:30:00', '01:00:00', '01:30:00', '02:00:00', '02:30:00', '03:00:00', '03:30:00', '04:00:00', '04:30:00', '05:00:00', '05:30:00', '06:00:00', '06:30:00']
  
//       let usersBookedTimes = []
//       let eventDate = ""
  
//       console.log("Checking Events after date click ", this.Events);

  
      
//       for(let i=0; i<this.Events.length; i++){
//         let obj = this.Events[i]
//         eventDate = obj['start'].split('T')[0]
//         if(eventDate == this.dateSelected){
//           let eventStartTime = obj['start'].split('T')[1]
//           usersBookedTimes.push(eventStartTime)      
//         }
//       }
//       console.log(usersBookedTimes);
  
//       let usersAvailaibleTimes = []
  
//       for(let i=0; i<allTimesArray.length; i++){
//         let found = false
//         for(let j=0; j<usersBookedTimes.length; j++){
//           if(allTimesArray[i] == usersBookedTimes[j]){
//             found = true
//             break;
//           }
//         }
  
//         if(found == false){
//           usersAvailaibleTimes.push(allTimesArray[i])
//         }
//       }
      
//       this.userAvailaibleArray = usersAvailaibleTimes
  
//       console.log(this.userAvailaibleArray);
//     }
    

//   }

//  // ---------------onDateClick ends---------------



// // ---------------eventContent starts---------------


// // eventContent(info: any) {

// //   // setting classnames to nonworking days to style them in css
// //   const dayOfWeek = info.event.start.getDay();
// //   for(let i=0; i<this.nonWorkingDays.length; i++){
// //     if(dayOfWeek == this.nonWorkingDays[i]){
// //       const container = document.createElement('div');
// //       console.log("works");      
// //       info.el.classList.add("makeDim")
// //       return { domNodes: [container] };
// //     }
// //     return null;
// //   }
// //   // if (dayOfWeek === 0 || dayOfWeek === 1) { // Sunday or Monday
// //   //   info.el.classList.add('dim-day'); // Add a custom class for styling
// //   // }
// // }

// // ---------------eventContent ends---------------


// // ---------------setEventTime starts---------------

// setEventTime(time){
//   console.log("timeSelected ", this.timeSelected);  
//   this.timeSelected = time
//   console.log("timeSelected ",this.timeSelected);
// }
// // ---------------setEventTime ends---------------

// // ---------------changeDisplayTimeDiv starts---------------
// changeDisplayTimeDiv(){
//   this.displayTimeDiv = false
// }
// // ---------------changeDisplayTimeDiv ends---------------


// // ---------------createEvent starts---------------
// createEvent(eventName){
//   this.loading = true
//   console.log("called createEvent");
//   console.log("event deets ", eventName, this.timeSelected, this.dateSelected);
//   // df sds 10:00:00 2024-01-05
//   // ---hardcoding endTime------
//   // let allTimesArray = ['10:00:00', '10:30:00', '11:00:00', '11:30:00', '12:00:00', '12:30:00', '01:00:00', '01:30:00', '02:00:00', '02:30:00', '03:00:00', '03:30:00', '04:00:00', '04:30:00', '05:00:00', '05:30:00', '06:00:00', '06:30:00']
//   let allTimesArray = this.allTimesArray
//   let endTime = ""
//   for(let i=0; i<allTimesArray.length; i++){
//     if(allTimesArray[i]==this.timeSelected){
//       endTime = allTimesArray[i+1]
//       break;
//     }
    
//   }
//   console.log("user " , this.userName, "userEmail " , this.emailId);
//   if(eventName!="" && this.timeSelected!="" && this.dateSelected!=""){
//     let event = {
//         "title"  : eventName,
//         "start"  : `${this.dateSelected}T${this.timeSelected}`,
//         "end" : `${this.dateSelected}T${endTime}`,
//         "user" : this.userName,
//         "userEmail" : this.emailId
//     }
//     this.apiService.scheduleMeetByCalendarLink(event).subscribe((response)=>{
//       console.log("meeting deets",response); 
//       console.log("response ", response);
//       this.loading = false
//       if (response && response['message']) {
//         console.log("response ", response);        
//         alert(response['message']);  
//         window.location.reload();     

//         // this.apiService.getMeetingsHide(this.userName, this.emailId);
//         // // meetingForm.resetForm()
  
//         // this.subscription = this.apiService.formattedMeetingsHide$.subscribe((formattedMeetingsHide) => {
//         //   console.log('Formatted Meetings Hide:', formattedMeetingsHide);
//         //   this.formattedMeetingsHide = formattedMeetingsHide;
//         //   this.Events = formattedMeetingsHide;
//         //   console.log("Events ",this.Events);
//         //   // this.trigger++;
//         // })    
        
//         // if(response['message'] == "Please login first."){
//           //   this.router.navigate(['/login'])  
          
//           // }
//         } 
//         else {
//           this.loading = false
//           alert(response['message'])
//           console.error('Invalid response:', response);
//           // Handle the error or show an appropriate message
//         }
//     })    
//   }
//   else{
//     this.loading = false
//     alert("PLease fill event Name and select the meeting time.")
//   }  
// }
// // ------createEvent ends-----------

}

