import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../api.service';
import { Subscription, combineLatest, take } from 'rxjs';
import { Calendar, CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';


@Component({
  selector: 'app-entire-user-admin',
  templateUrl: './entire-user-admin.component.html',
  styleUrl: './entire-user-admin.component.css'
})
export class EntireUserAdminComponent {

  
  eventsArrayOfSelectedUser = []
  selectedUserName = localStorage.getItem("selectedUserName" || "")
  selectedUserEmail = localStorage.getItem("selectedUserEmail" || "")
  selectedUserId = localStorage.getItem("selectedUserId" || "")

  firstChar = this.selectedUserName[0]
  logOutValue = false
  filterTerm: string = '';
  showSetting: boolean = false
  showSettingFor: string = ""
  showPopup: boolean = false
  deleteEventId: string = ""
  deleteEventName: string = ""
  setCopied: string = ""

  popUpForEventEdit: boolean = false
  editEventId: string = ""
  editEventName: string = ""
  editEventType: string = ""
  editEventHrs: number = 0
  editEventMins: number = 0
  editEventLocation: string = "zoom"

  popUpForNewEvent: boolean = false
  newEventName: string = ""
  newEventType: string = ""
  newEventHrs: number = 0
  newEventMins: number = 0
  newEventLocation: string = "zoom"

  showpopUpForEventAssignment = false
  public usersWOloggedInUser: Array<any> = []
  public users: Array<any> = []
  idOfEventToBAssigned = ""
  nameOfEventToBeAssigned = ""
  assignEventToUserId = ""
  assignEventToUserName = ""
  showPopUpForEentAssignmentConfirmation = false

  tableView = true
  calendarView: boolean = false

  formattedMeetingsHide: object[] = [];
  MeetingsWOColor: any[] = [];
  Meetings: any[] = [];
  Events: any[] = [];


  // calendarOptions: CalendarOptions = {
  //   plugins: [dayGridPlugin, interactionPlugin],
  //   initialView: 'dayGridMonth',
  //   // events: this.Events,
  //   headerToolbar: {
  //     left: 'prev,next',
  //     center: 'title',
  //     right: '',
  //   },
  //   views: {
  //     dayGridMonth: {}
  //   },
  //   weekends: true,
  //   editable: false,
  //   selectable: true,
  //   selectMirror: true,
  // };

  constructor(private route: ActivatedRoute, private router: Router, private apiService: APIService) {}

  private subscription: Subscription;


  ngOnInit() {
    //for table view
    this.callTable()

    //for calendar view 
    // this.callCalendar()
  }

  // ngAfterViewInit(){
  //   this.callCalendar()

  // }


  callTable() {
    this.apiService.getEventsOfSelectedUserAdmin(this.selectedUserId)
    this.getallusersExceptLoogedIn()

    setTimeout(() => {
      this.apiService.eventsArray$.subscribe((eventsArray) => {
        console.log("events in ts ", eventsArray)
        this.eventsArrayOfSelectedUser = eventsArray
      })

    }, 1000);
  }


  public getallusersExceptLoogedIn() {
    const token = localStorage.getItem("token")
    // console.log(token)
    this.apiService.getallusers().subscribe((data: Array<any>) => {
      // this.apiService.setAuthorizationHeader(token)
      this.users = data['users']
      console.log(this.users)

      let usersWOloggedInUserArray = []
      for (let i = 0; i < this.users.length; i++) {
        // if(this.users[i].emailID !== this.loggedInEmailId){
        usersWOloggedInUserArray.push(this.users[i])
        // }
      }
      this.usersWOloggedInUser = usersWOloggedInUserArray
    })
  }


  // callCalendar() { 

  //   this.apiService.getMeetingsforUserToSee(this.selectedUserEmail);
  //   // this.apiService.getSelectedUsersAvailaibilityObj()

  //   this.subscription = this.apiService.getMeetingsforUserToSee$.subscribe((getMeetingsforUserToSee) => {
  //     console.log('Formatted Meetings Hide in ts :', getMeetingsforUserToSee);
  //     this.formattedMeetingsHide = getMeetingsforUserToSee;
  //     this.MeetingsWOColor = getMeetingsforUserToSee;
  //     console.log("Meetings ", this.MeetingsWOColor);
  //   });

  //   this.subscription = this.apiService.getEventsforUserToSee$.subscribe((getEventsforUserToSee) => {
  //     console.log('Events Hide in ts :', getEventsforUserToSee);
  //     // this.formattedMeetingsHide = getEventsforUserToSee;
  //     this.Events = getEventsforUserToSee;
  //     console.log("Events ", this.Events);

  //     const randomRgbColor = () => {
  //       let r = Math.floor(Math.random() * 256); // Random between 0-255
  //       let g = Math.floor(Math.random() * 256); // Random between 0-255
  //       let b = Math.floor(Math.random() * 256); // Random between 0-255
  //       return 'rgb(' + r + ',' + g + ',' + b + ')';
  //     }

  //     let finalmeetingsArr = []
  //     for (let i = 0; i < this.Events.length; i++) {
  //       let color = randomRgbColor()
  //       let meetingsArr = this.Events[i]['meetings']
  //       // console.log("meetingsArr in for loop ", meetingsArr);

  //       for (let j = 0; j < meetingsArr.length; j++) {
  //         let oneMeet = meetingsArr[j]
  //         oneMeet['color'] = color
  //         finalmeetingsArr.push(oneMeet)
  //       }
  //     }

  //     console.log("finalmeetingsArr ", finalmeetingsArr);

  //     let finalmeetinsArrWdColor = [...finalmeetingsArr]

  //     setTimeout(() => {
  //       console.log("this.Meetings ", this.MeetingsWOColor);
  //       console.log("this.Meetings.length ", this.MeetingsWOColor.length);

  //       let color = randomRgbColor()
  //       for (let i = 0; i < this.MeetingsWOColor.length; i++) {
  //         let same = false
  //         for (let j = 0; j < finalmeetingsArr.length; j++) {
  //           // console.log(this.MeetingsWOColor[i].Id, finalmeetingsArr[j]._id);
  //           // console.log(this.MeetingsWOColor[i].Id == finalmeetingsArr[j]._id);
  //           if (this.MeetingsWOColor[i].Id == finalmeetingsArr[j]._id) {
  //             same = true
  //             break;
  //           }
  //         }
  //         if (same == false) {
  //           this.MeetingsWOColor[i]['color'] = color
  //           finalmeetinsArrWdColor.push(this.MeetingsWOColor[i])
  //         }
  //       }
  //       console.log("finalmeetinsArrWdColor ", finalmeetinsArrWdColor);
  //       this.Meetings = finalmeetinsArrWdColor;
  //       console.log("Metings with color", this.Meetings);
  //     }, 10)
  //   });



    
  //   setTimeout(() => {
  //     this.calendarOptions = {
  //       initialView: 'dayGridMonth',
  //       events: this.Meetings, //commented so that events are not shown on calendar
  //       // dateClick: this.onDateClick.bind(this),        
  
  //       dayMaxEvents: 100,
  //       eventOrder: 'start',
  //       displayEventTime: false, //hides time
  //       eventDisplay: 'block', // shows strip  
  
  //       // dayCellContent: this.theDayCellContent.bind(this),
  //       // eventClick: this.onEventClick.bind(this)
  //     }
  //   }, 2500)
  // }


  editEventCacelation() {
    this.popUpForEventEdit = false
  }

  editEvent(id, evName, evType, hrs, mins, location) {
    // event._id, event.evName, event.evType, event.evDuration.hrs, event.evDuration.minutes, event.evLocation)
    console.log("in edit event ", id, evName, evType, hrs, mins, location);

    this.popUpForEventEdit = true
    this.editEventId = id
    this.editEventName = evName
    this.editEventType = evType
    this.editEventHrs = hrs
    this.editEventMins = mins
    this.editEventLocation = location

    // console.log(this.editUserName,this.editUserEmail,this.editUserId);

  }


  //  editEventName, editEventType, editEventHrs, editEventMins

  editEventConfirmation() {
    this.popUpForEventEdit = false
    if (this.editEventMins >= 60) {
      this.editEventHrs = this.editEventHrs + (Math.floor(this.editEventMins / 60))
      this.editEventMins = this.editEventMins % 60
    }

    console.log("editEventConfirmation ", this.selectedUserId, this.editEventId, this.editEventName, Number(this.editEventHrs), Number(this.editEventMins), this.editEventLocation, this.editEventType);

    this.apiService.editEventAdmin(this.selectedUserId, this.editEventId, this.editEventName, this.editEventHrs, this.editEventMins, this.editEventLocation, this.editEventType)

  }

  settingsCalled(id) {
    console.log("settingsCalled ", id);
    this.showSetting = !this.showSetting
    this.showSettingFor = id
  }


  deleteEventPopup(id, evName) {
    console.log(id, evName);
    this.showSetting = false

    this.showPopup = true
    // this.deleteEventConfirmation(id)
    this.deleteEventId = id
    this.deleteEventName = evName
  }

  deleteEventConfirmation() {
    this.showPopup = false
    this.deleteEventName = ""
    this.deleteEvent(this.deleteEventId, this.selectedUserId)
  }

  deleteEventCacelation() {
    this.deleteEventId = ""
    this.deleteEventName = ""
    this.showPopup = false
  }

  deleteEvent(eventId: string, UserId: string) {
    console.log("delete called id to be deleted ", eventId, UserId);
    this.apiService.deleteEventAdmin(eventId, UserId)
    // setTimeout(() => {
    //   this.apiService.eventsArray$.subscribe((eventsArray) => {
    //    console.log("events in ts ",eventsArray)
    //    this.eventsArrayOfLoggedInUser = eventsArray
    //   })

    //  }, 1000);
  }




  // copied(evName){
  //   console.log("clicked");

  //   this.setCopied = evName

  //   setTimeout(()=>{
  //       this.setCopied = ""
  //       console.log("copied 2 ",this.setCopied);
  //   }, 2000)
  // }


  // newEventPopup() {
  //   this.popUpForNewEvent = true

  // }
  // newEventCacelation() {
  //   this.popUpForNewEvent = false
  // }

  // newEventConfirmation() {
  //   console.log("create event called");

  //   console.log(this.selectedUserId, this.newEventName, this.newEventHrs, this.newEventMins, this.newEventLocation, this.newEventType);
  //   this.popUpForNewEvent = false

  //   this.apiService.createNewEventAdmin(this.selectedUserId, this.newEventName, this.newEventHrs, this.newEventMins, this.newEventLocation, this.newEventType)
  // }

  popUpForEventAssignment(idOfEventToBAssigned, nameOfEventToBeAssigned) {
    this.showpopUpForEventAssignment = true
    this.idOfEventToBAssigned = idOfEventToBAssigned
    this.nameOfEventToBeAssigned = nameOfEventToBeAssigned
  }

  AssignEventCacelation() {
    this.showpopUpForEventAssignment = false
  }

  AssignEventToUser(assignEventToUserId, assignEventToUserName) {
    this.assignEventToUserId = assignEventToUserId
    this.assignEventToUserName = assignEventToUserName

    this.showpopUpForEventAssignment = false
    this.showPopUpForEentAssignmentConfirmation = true
  }

  closePopUpForEventAssignmentConfirmation() {
    this.showPopUpForEentAssignmentConfirmation = false
  }

  assignEvent() {
    // this.assignEventToUserId
    // this.idOfEventToBAssigned
    this.showPopUpForEentAssignmentConfirmation = false
    this.apiService.assignEventAdmin(this.assignEventToUserId, this.idOfEventToBAssigned, this.selectedUserId)
  }

  showMeetings(selectedEventId, selectedEventName, selectedEvType, selectedEvHrs, selectedEvMins) {
    localStorage.setItem('selectedEventName', selectedEventName)
    localStorage.setItem('selectedEventId', selectedEventId)
    localStorage.setItem('evType', selectedEvType)
    localStorage.setItem('evDurHrs', selectedEvHrs)
    localStorage.setItem('evDurMins', selectedEvMins)

    // this.router.navigate(['/meetingsAdmin'])
    this.router.navigate(['/meetingsCalendarAdmin'])

  }

  // makeCalendarView() {
  //   this.tableView = false
  //   this.calendarView = true
  //   this.router.navigate(['/calendarEventsAdmin'])
  //   // this.callCalendar()
  // }
  // makeTableView() {
  //   this.tableView = true
  //   this.calendarView = false
  //   // this.callTable()
  //   // this.calendarInstance.destroy();
  // }

}
