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


  userName: string = '';
  emailId: string = '';
  selectedUserId = localStorage.getItem("selectedUserId" || "")
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
  newObj ={
    // 'evType':"",
    'date':"",
    'startTime':"",
    'endTime':"",
    'name' : "",
    'emailId' : "",
    // 'meetId' : ""
  }

  newEditObj ={
    // 'evType':"",
    'date': "",
    'startTime': "",
    'endTime': "",
    'name' : "",
    'emailId' : "",
    // 'meetId' : ""
  }



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
      console.log(emailId)
    });
  }

  private subscription: Subscription;




  ngOnInit() {

    this.apiService.getMeetingsOfParticularEventAdmin(this.selectedUserId, this.selectedEventId);
    this.apiService.getSelectedUsersAvailaibilityObjAdmin(this.selectedUserId)

    
    setTimeout(()=>{
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
  
  
  
      this.subscription = this.apiService.selectedUserAvailabilityObj$.subscribe((avObj) => {
        this.selectedUserAvObj = avObj
        console.log("selectedUserAvObj ", this.selectedUserAvObj); 
  
        this.duration = this.selectedUserAvObj["duration"]
        this.workingHrsAsPerDays = this.selectedUserAvObj["workingHrs"]
  
        this.workingDays = this.selectedUserAvObj["workingDays"]
        this.nonWorkingDays = this.selectedUserAvObj["nonWorkingDays"]
  
      })
    }, 1000)




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
    }, 2500);
    // })

  }

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

  onDateClick(res: any) {

    console.log('Clicked on date : ' + res.dateStr); //2024-02-13

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
            workingStartHours = workingStartHours + Math.abs(workingStartMinutes / 60)
            workingStartMinutes = workingStartMinutes - 60 * (Math.abs(workingStartMinutes / 60))
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

        let usersBookedStTimes = []
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
            // let eventStartTime = time.split('+')[0] //09:00:00
            let eventEndTime = obj['end'].split('T')[1] //09:00:00
            console.log("eventStartTime ", eventStartTime);

            usersBookedStTimes.push(eventStartTime)
            usersBookedEndTimes.push(eventEndTime)
          }
        }
        console.log("usersBookedStTimes ", usersBookedStTimes);
        console.log("usersBookedEndTimes ", usersBookedEndTimes);


        let usersAvailaibleTimes = []

        console.log("dutration of user", this.evDurHrs, this.evDurMins);

        

        for (let i = 0; i < allTimesArray.length; i++) {//all the times
          console.log("allTimesArray ", allTimesArray[i]);
          
          let found = false
          for (let j = 0; j < usersBookedStTimes.length; j++) {
            if (allTimesArray[i] == usersBookedStTimes[j]) { //all times equal booked time 09:00:00
              console.log("satisfied allTimesArray[i] == usersBookedStTimes[j] ", allTimesArray[i], usersBookedStTimes[j]);

              found = true
              break;
            }
            else if ((usersBookedStTimes[j] < allTimesArray[i]) && (allTimesArray[i] < usersBookedEndTimes[j])) {//all times is in between booked times
              console.log("satisfied usersBookedStTimes[j] < allTimesArray[i] && allTimesArray[i] > usersBookedEndTimes[j] ", usersBookedStTimes[j], allTimesArray[i], usersBookedEndTimes[j]);
              found = true
              break;
            
            }
            else if (i == allTimesArray.length - 1) { //last time 
              console.log("satisfied last element ", allTimesArray[i]);

              found = true
              break;
            }
            else {
              let hrStr = `${allTimesArray[i][0]}${allTimesArray[i][1]}`
              let minStr = `${allTimesArray[i][3]}${allTimesArray[i][4]}`

              console.log("hrStr", hrStr, 'minStr', minStr);
              //                    16                30

              console.log("this.evDurHrs ", this.evDurHrs, "this.evDurMins ", this.evDurMins);
              //                                 1                                   0     


              let hrNum = 0
              let minNum = 0


              hrNum = Number(hrStr) + Number(this.evDurHrs)
              minNum = Number(minStr) + Number(this.evDurMins)

              console.log('hrNum ', hrNum, 'minNum ', minNum);


              if (minNum >= 60) {
                hrNum = hrNum + Math.abs(minNum / 60)
                minNum = minNum - 60 * (Math.abs(minNum / 60))
              }

              console.log("hrNum ", hrNum, "minNum ", minNum);

              let imaginaryMeetEndTime = ''
              if (hrNum < 10) {
                if (minNum < 10) {
                  imaginaryMeetEndTime = `0${hrNum}:0${minNum}:00`
                }
                else {
                  imaginaryMeetEndTime = `0${hrNum}:${minNum}:00`
                }
              }
              else {
                if (minNum < 10) {
                  imaginaryMeetEndTime = `${hrNum}:0${minNum}:00`
                }
                else {
                  imaginaryMeetEndTime = `${hrNum}:${minNum}:00`
                }
              }

              console.log("imaginaryMeetEndTime ", imaginaryMeetEndTime);
              console.log("for whome imaginaryMeetEndTime ", allTimesArray[i]);


              if (usersBookedStTimes[j] < imaginaryMeetEndTime && imaginaryMeetEndTime < usersBookedEndTimes[j]) {
                console.log("satisfied imaginary end time in between meetings ", allTimesArray[i]);
                console.log('usersBookedStTimes[j]<imaginaryMeetEndTime && imaginaryMeetEndTime<usersBookedEndTimes[j] ', usersBookedStTimes[j], imaginaryMeetEndTime, usersBookedEndTimes[j]);
                found = true
                break;
              }
              if (allTimesArray[i] < usersBookedStTimes[j] && usersBookedStTimes[j] < imaginaryMeetEndTime) {
                found = true
                break;
              }
              if (allTimesArray[i] < usersBookedEndTimes[j] && usersBookedEndTimes[j] < imaginaryMeetEndTime) {
                found = true
                break;
              }
              else {
                console.log("imaginaryMeetEndTime > allTimesArray[allTimesArray.length-1] ", imaginaryMeetEndTime, allTimesArray[allTimesArray.length - 1], imaginaryMeetEndTime > allTimesArray[allTimesArray.length - 1]);

                if (imaginaryMeetEndTime > allTimesArray[allTimesArray.length - 1]) {
                  found = true
                  break;
                }
              }
            }
          }

          if (found == false) {
            usersAvailaibleTimes.push(allTimesArray[i])
          }
        }

        this.userAvailaibleArray = usersAvailaibleTimes

        console.log("userAvailaibleArray ", this.userAvailaibleArray);
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
      endTimeHrs = endTimeHrs + Math.abs(endTimeMins / 60)
      endTimeMins = endTimeMins - 60 * (Math.abs(endTimeMins / 60))
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


  closePopUp(){
    this.showMeets = false
    this.editMeet = false
    console.log(this.showMeets);    
  }

  deleteMeeting(){
    this.showMeets = false
    this.apiService.deleteMeetByAdmin(this.selectedMeetingId, this.selectedEventId, this.selectedUserId)
  }

  editMeetingPopUp(){
    this.showMeets = false
    this.editMeet = true
  }

  editMeeting(){
    console.log(this.selectedUserId, this.selectedEventId, this.selectedMeetingId);
    
    console.log("newEditObj ",this.newEditObj);
    
    // if(){

    // }

    this.apiService.editMeeting(this.selectedUserId, this.selectedEventId, this.selectedMeetingId)  
    
        
    // this.router.navigate([''])
  }



}
