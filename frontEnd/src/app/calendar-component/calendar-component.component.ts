import {  Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APIService } from '../api.service';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Subscription, combineLatest, take } from 'rxjs';


@Component({
  selector: 'app-calendar-component',
  templateUrl: './calendar-component.component.html',
  styleUrl: './calendar-component.component.css'
})
export class CalendarComponentComponent {
  title = 'frontEnd';

  userName: string = '';
  emailId : string = '';
  formattedMeetingsHide : object[] = [];

  timeSelected = "";
  eventName = "";
  eventDesc = "";
  loading = false
  // public trigger: number = 1;


  displayTimeDiv = false;
  dateSelected = ""
  userAvailaibleArray: string[] = []
  Events: any[] = [];
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
  };
  constructor(private apiService: APIService,private httpClient: HttpClient) {
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





  onDateClick(res: any) {
    // alert('Clicked on date : ' + res.dateStr);
    // Clicked on date : 2024-01-06
    console.log("res ",res)
    this.displayTimeDiv = true;
    this.dateSelected = res.dateStr

    let allTimesArray = ['10:00:00', '10:30:00', '11:00:00', '11:30:00', '12:00:00', '12:30:00', '01:00:00', '01:30:00', '02:00:00', '02:30:00', '03:00:00', '03:30:00', '04:00:00', '04:30:00', '05:00:00', '05:30:00', '06:00:00', '06:30:00']

    let usersBookedTimes = []
    let eventDate = ""

    console.log("Checking Events after date click ", this.Events);

      // end
      // : 
      // "2024-01-13T11:30:00"
      // start
      // : 
      // "2024-01-12T11:00:00"
      // title
      // : 

    
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


  ngOnInit() {
    
    // this.Events.push({
    //   "title"  : 'event1',
    //   "start"  : '2024-01-05T11:00:00',
    //   "end"   : '2024-01-05T11:30:00'
    // })

    console.log("this.userName, this.emailId", this.userName, this.emailId);
    
    // setTimeout(()=>{
      this.apiService.getMeetingsHide(this.userName, this.emailId);

      this.subscription = this.apiService.formattedMeetingsHide$.subscribe((formattedMeetingsHide) => {
        console.log('Formatted Meetings Hide:', formattedMeetingsHide);
      this.formattedMeetingsHide = formattedMeetingsHide;
      this.Events = formattedMeetingsHide;
      console.log("Events ",this.Events);
      })

    // },2000)


setTimeout(() => {
this.calendarOptions = {
  initialView: 'dayGridMonth',
  events: this.Events,
  dateClick: this.onDateClick.bind(this),
};
}, 2500);
}






setEventTime(time){
  console.log("timeSelected ", this.timeSelected);
  
  this.timeSelected = time

  console.log("timeSelected ",this.timeSelected);
}

changeDisplayTimeDiv(){
  this.displayTimeDiv = false
}


createEvent(eventName){

  this.loading = true

  console.log("called createEvent");
  console.log("event deets ", eventName, this.timeSelected, this.dateSelected);
  // df sds 10:00:00 2024-01-05

  // ---hardcoding endTime------

  let allTimesArray = ['10:00:00', '10:30:00', '11:00:00', '11:30:00', '12:00:00', '12:30:00', '01:00:00', '01:30:00', '02:00:00', '02:30:00', '03:00:00', '03:30:00', '04:00:00', '04:30:00', '05:00:00', '05:30:00', '06:00:00', '06:30:00']
  let endTime = ""
  for(let i=0; i<allTimesArray.length; i++){
    if(allTimesArray[i]==this.timeSelected){
      endTime = allTimesArray[i+1]
      break;
    }
  }
  

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
        // window.location.reload(); 

        

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
          alert(response)
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





}
