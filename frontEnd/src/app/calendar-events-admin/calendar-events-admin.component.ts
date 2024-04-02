import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../api.service';
import { Subscription, combineLatest, take } from 'rxjs';
import { Calendar, CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-calendar-events-admin',
  templateUrl: './calendar-events-admin.component.html',
  styleUrl: './calendar-events-admin.component.css'
})
export class CalendarEventsAdminComponent {

  eventsArrayOfSelectedUser = []
  selectedUserName = localStorage.getItem("selectedUserName" || "")
  selectedUserEmail = localStorage.getItem("selectedUserEmail" || "")
  selectedUserId = localStorage.getItem("selectedUserId" || "")

  formattedMeetingsHide: object[] = [];
  MeetingsWOColor: any[] = [];
  Meetings: any[] = [];
  Events: any[] = [];
  colorsObj = {};
  colorsArr = []
  // finalColorsArr = []

  showMeets = false
  newObj ={
    'evType':"",
    'date':"",
    'startTime':"",
    'endTime':"",
    'name' : "",
    'emailId' : "",
    'evName' : ""
  }
  idSelected = ""
  showDeetsFor = ""
  selectedDateMeets = []




  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    // events: this.Events,
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: '',
    },
    views: {
      dayGridMonth: {}
    },
    weekends: true,
    editable: false,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    // eventOrder : 'start',
    // displayEventTime : false, //hides time
    // eventDisplay : 'block',
  };


  constructor(private route: ActivatedRoute, private router: Router, private apiService: APIService) { }


  private subscription: Subscription;


  ngOnInit() {
    //for calendar view 
    this.callCalendar()
  }


  callCalendar() {

    this.apiService.getMeetingsforUserToSee(this.selectedUserEmail);
    // this.apiService.getSelectedUsersAvailaibilityObj()

    this.subscription = this.apiService.getMeetingsforUserToSee$.subscribe((getMeetingsforUserToSee) => {
      console.log('Formatted Meetings Hide in ts :', getMeetingsforUserToSee);
      this.formattedMeetingsHide = getMeetingsforUserToSee;
      this.MeetingsWOColor = getMeetingsforUserToSee;
      console.log("Meetings ", this.formattedMeetingsHide);
    });

    this.subscription = this.apiService.getEventsforUserToSee$.subscribe((getEventsforUserToSee) => {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
      console.log('Events Hide in ts :', getEventsforUserToSee);
      // this.formattedMeetingsHide = getEventsforUserToSee;
      this.Events = getEventsforUserToSee;
      console.log("Events ", this.Events);

      const randomRgbColor = () => {
        let r = Math.floor(Math.random() * 256); // Random between 0-255
        let g = Math.floor(Math.random() * 256); // Random between 0-255
        let b = Math.floor(Math.random() * 256); // Random between 0-255
        return 'rgb(' + r + ',' + g + ',' + b + ')';
      }

      let finalmeetingsArr = []
      for (let i = 0; i < this.Events.length; i++) {
        let color = randomRgbColor()

        
        let meetingsArr = this.Events[i]['meetings']
        // console.log("meetingsArr in for loop ", meetingsArr);

        for (let j = 0; j < meetingsArr.length; j++) {
          let oneMeet = meetingsArr[j]  
          // let obj = {[this.Events[i]['evName']] : color} 

          // -------------------------------

                //           color
                // : 
                // "rgb(230,122,140)"
                // currentDateTime
                // : 
                // "date"
                // end
                // : 
                // "2019-01-18T09:30:00+05:30"
                // start
                // : 
                // "2019-01-18T09:00:00+05:30"
                // user
                // : 
                // "abc"
                // userEmail
                // :
          // --------------------------------



          let selectedColor = color    
          oneMeet['color'] = selectedColor
          oneMeet['name'] = oneMeet['user']
          oneMeet['emailId'] = oneMeet['userEmail']
          oneMeet['evName'] = this.Events[i]['evName']
          oneMeet['evType'] = this.Events[i]['evType']


          let obj = {"evName":this.Events[i]['evName'], "evColor":selectedColor}     
          console.log("obj ", obj);
          
          this.colorsArr.push(obj)
          finalmeetingsArr.push(oneMeet)
        }
      }

      console.log("finalmeetingsArr ", finalmeetingsArr);

      let finalmeetinsArrWdColor = [...finalmeetingsArr]

      setTimeout(() => {
        console.log("this.Meetings ", this.MeetingsWOColor);
        console.log("this.Meetings.length ", this.MeetingsWOColor.length);

        let color = randomRgbColor()
        for (let i = 0; i < this.MeetingsWOColor.length; i++) {
          let same = false
          for (let j = 0; j < finalmeetingsArr.length; j++) {
            // console.log(this.MeetingsWOColor[i].Id, finalmeetingsArr[j]._id);
            // console.log(this.MeetingsWOColor[i].Id == finalmeetingsArr[j]._id);
            if (this.MeetingsWOColor[i].Id == finalmeetingsArr[j]._id) {
              same = true
              break;
            }
          }
          if (same == false) {            
            let selectedColor = color 
            // console.log("selectedColor line 147 ", selectedColor);
            this.MeetingsWOColor[i]['color'] = selectedColor
            // let obj = {'meetinWOEvent' : color}   
            let obj = {"evName":'meetinWOEvent', "evColor":selectedColor}     
  
            this.colorsArr.push(obj)
            finalmeetinsArrWdColor.push(this.MeetingsWOColor[i])
          }
        }
        console.log("finalmeetinsArrWdColor ", finalmeetinsArrWdColor);
        this.Meetings = finalmeetinsArrWdColor;
        console.log("Metings with color", this.Meetings);
      }, 10)

      console.log("this.colorsArr ", this.colorsArr);

      let colorsAddedObj = {}
      for(let i=0; i<this.colorsArr.length; i++){
        let eventName = this.colorsArr[i].evName
        let event = this.colorsArr[i]
        console.log("eventName ", eventName);
        console.log("colorsAddedObj ", colorsAddedObj);
        
        
        if(colorsAddedObj[eventName] == undefined){
          let obj = {}
          obj['evName'] = eventName
          // this.finalColorsArr.push(event)
          colorsAddedObj[eventName] = true
          // console.log("colorsAddedObj[eventName] ", colorsAddedObj[eventName]);
        }
      }

      // console.log("this.finalColorsArr ", this.finalColorsArr);
      
    });




    setTimeout(() => {
      this.calendarOptions = {
        initialView: 'dayGridMonth',
        events: this.Meetings, //commented so that events are not shown on calendar
        // dateClick: this.onDateClick.bind(this),        

        dayMaxEvents: 100,
        eventOrder: 'start',
        displayEventTime: false, //hides time
        eventDisplay: 'block', // shows strip  
        eventClick: this.onEventClick.bind(this)

        // dayCellContent: this.theDayCellContent.bind(this),
        // eventClick: this.onEventClick.bind(this)
      }
    }, 2500)
  }






  // onDateClick(res: any) {

  //   console.log('Clicked on event : ' + res);
  //   alert(res)
    
  //   this.selectedDateMeets = []

  //   console.log('Clicked on date : ' + res.dateStr); //2024-02-13

  //   // console.log("res ", res);


  //   console.log("events after date click", this.Events);

  //   this.showMeets = true
  //   for (let i = 0; i < this.Events.length; i++) {    



  //     if (res.dateStr == this.Events[i].start.split('T')[0]) {
  //       console.log("start date",this.Events[i].start.split('T')[0]);
  //       console.log("meet ", this.Events[i]);
  //       let date = this.Events[i].start.split('T')[0]
  //       let startTime = this.Events[i].start.split('T')[1]
  //       let endTime = this.Events[i].end.split('T')[1]

  //       // console.log("endTime ", endTime);
        


  //       // this.Events[i]['date'] = this.Events[i].start.split['T'][0]
  //       // this.Events[i]['startTime'] = this.Events[i].start.split['T'][1]
  //       // this.Events[i]['endTime'] = this.Events[i].end.split['T'][1]

  //       let newObj = {}

  //       newObj['evType'] = this.Events[i].evType
  //       newObj['date'] = date
  //       newObj['startTime'] = startTime
  //       newObj['endTime'] = endTime
  //       newObj['name'] = this.Events[i].name
  //       newObj['emailId'] = this.Events[i].emailId
  //       console.log("event ", newObj);

  //       this.selectedDateMeets.push(newObj)
  //     }
  //   }



  // }

  onEventClick(res: any) {
    console.log("event clicked ", res);
    
    this.showMeets = true

    let response = JSON.stringify(res)
    response = JSON.parse(response)
    let event = response['event']
    console.log("response ", response);
    console.log("event ", response['event']);


    


    this.newObj['evType'] = event.extendedProps.evType
    console.log("this.newObj['evType'] ", this.newObj['evType']);

    this.newObj['evName'] = event.extendedProps.evName
    console.log("this.newObj['evName'] ", this.newObj['evName']);
     
    this.newObj['date'] = event.start.split('T')[0]
    console.log("this.newObj['date'] ", this.newObj['date']);
    
    this.newObj['startTime'] = event.start.split('T')[1].split('+')[0]
    console.log("this.newObj['startTime'] ", this.newObj['startTime']);
    
    console.log("end ", event.end);
    
    this.newObj['endTime'] = event.end.split('T')[1].split('+')[0]
    console.log("this.newObj['endTime'] ", this.newObj['endTime']);
    
    this.newObj['name'] = event.extendedProps.name
    console.log("this.newObj['name'] ", this.newObj['name']);
    
    this.newObj['emailId'] = event.extendedProps.emailId
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
    console.log(this.showMeets);
    
  }

}
