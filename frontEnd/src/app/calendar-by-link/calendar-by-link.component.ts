import { Component , OnInit, ChangeDetectorRef } from '@angular/core';
import { View, EventSettingsModel, ActionEventArgs, PopupOpenEventArgs, ScheduleComponent} from '@syncfusion/ej2-angular-schedule';
import { APIService } from '../api.service';
import { Subscription, combineLatest, take } from 'rxjs';
import { ActivatedRoute, Router} from '@angular/router';
import { Calendar, CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';


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

  userName: string = '';
  emailId : string = '';
  // meetingArray : any[] = [];
  formattedMeetingsHide : object[] = [];
  timeSelected = "";
  eventName = "";
  eventDesc = "";
  loading = false
  selectedUserAvObj = {}


  displayTimeDiv = false;
  dateSelected = ""
  userAvailaibleArray: string[] = []
  Events: any[] = [];
  allTimesArray = []

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
 
  constructor(private apiService: APIService, private route:ActivatedRoute,private router:Router){
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



  // -----taking name and email id from query paramaters----
  this.route.queryParams.subscribe(params => {
    console.log('Calendar by link Component initialized');
    const name = params['name'];
    const id = params['id'];
    console.log("ng oninit called"); 
    this.apiService.setUserName(name);
    this.apiService.setUserEmailId(id);    
    console.log('Name:', name);
    console.log('ID:', id);
    
    // Fetch meetings when component initializes
    this.apiService.getMeetingsHide(name, id);   
    this.apiService.getSelectedUsersAvailaibilityObj()
    
    this.subscription = this.apiService.formattedMeetingsHide$.subscribe((formattedMeetingsHide) => {
      console.log('Formatted Meetings Hide:', formattedMeetingsHide);
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
      events: this.Events,
      dateClick: this.onDateClick.bind(this),
      dayCellContent : this.theDayCellContent.bind(this)
    }
    }, 2500);
  })
}

// ----------theDayCellContent starts----------
  theDayCellContent(info: any){    
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


// ---------------onDateClick starts---------------

  onDateClick(res: any) {

    // alert('Clicked on date : ' + res.dateStr);
    console.log("res ", res)
    const selectedDay = res.date.getDay();
    const selectedDateis = res.dateStr;
    console.log("selectedDate ", selectedDateis);

  
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

      for(let key in this.workingHrsAsPerDays){
        if(selectedDay == key){
          this.workingHrStart = this.workingHrsAsPerDays[key].start
          this.workingHrEnd = this.workingHrsAsPerDays[key].end
        }
      }

      let workingHrStart = this.workingHrStart
      let workingHrEnd = this.workingHrEnd

      console.log("workingHrStart ", workingHrStart, "workingHrEnd ", workingHrEnd);
      

      let workingStartHours = Number(`${workingHrStart[0]}${workingHrStart[1]}`)
      let workingStartMinutes = Number(`${workingHrStart[3]}${workingHrStart[4]}`)
      console.log("workingStartHours ", workingStartHours, "workingStartMinutes ", workingStartMinutes);
      
      let workingEndHours = Number(`${workingHrEnd[0]}${workingHrEnd[1]}`)
      let workingEndMinutes = Number(`${workingHrEnd[3]}${workingHrEnd[4]}`)
      console.log("workingEndHours ", workingEndHours, "workingEndMinutes ", workingEndMinutes);

      let allTimesArray = []

      let timeStr = workingHrStart
      
      allTimesArray.push(timeStr)

      console.log("workingStartHours ",workingStartHours, typeof workingStartHours);
      console.log("workingEndHours ",workingEndHours, typeof workingEndHours);
      console.log("workingStartMinutes ",workingStartMinutes, typeof workingStartMinutes);
      console.log("workingEndMinutes ",workingEndMinutes, typeof workingEndMinutes);


      console.log(workingStartHours<=workingEndHours);
      console.log(typeof workingEndHours);
      
      

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
          workingStartHours = workingStartHours + Math.abs(workingStartMinutes/60)
          workingStartMinutes = workingStartMinutes - 60*(Math.abs(workingStartMinutes/60))
        }

        // console.log("workingStartHours 295 ",workingStartHours, typeof workingStartHours);
        // console.log("workingStartMinutes 296 ",workingStartMinutes, typeof workingStartMinutes);

        // console.log("workingStartHours ",workingStartHours,"workingStartMinutes ", workingStartMinutes);
        

        if(workingStartHours < 10){
          if(workingStartMinutes < 10){
            timeStr = `0${workingStartHours}:0${workingStartMinutes}:00`
          }
          else{
            timeStr = `0${workingStartHours}:${workingStartMinutes}:00`
          }
        }
        else{
          if(workingStartMinutes < 10){
            timeStr = `${workingStartHours}:0${workingStartMinutes}:00`
          }
          else{
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

  
      
      for(let i=0; i<this.Events.length; i++){
        let obj = this.Events[i]
        eventDate = obj['start'].split('T')[0]
        if(eventDate == this.dateSelected){
          let eventStartTime = obj['start'].split('T')[1]
          usersBookedTimes.push(eventStartTime)      
        }
      }
      console.log(usersBookedTimes);
  
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
          usersAvailaibleTimes.push(allTimesArray[i])
        }
      }
      
      this.userAvailaibleArray = usersAvailaibleTimes
  
      console.log(this.userAvailaibleArray);
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


// ---------------setEventTime starts---------------

setEventTime(time){
  console.log("timeSelected ", this.timeSelected);  
  this.timeSelected = time
  console.log("timeSelected ",this.timeSelected);
}
// ---------------setEventTime ends---------------

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

}

