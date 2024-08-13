import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { APIService } from '../api.service';
import { CalendarOptions } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

interface EditObj {
  evType: string;
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
  selector: 'app-poll-calendar',
  templateUrl: './poll-calendar.component.html',
  styleUrl: './poll-calendar.component.css',
})
export class PollCalendarComponent {

  token = localStorage.getItem('token')
  loggedInEmailId = localStorage.getItem('emailID' || '');
  makeDurationDisabled = false

  calendarApi: any

  formattedMeetingsHide: Array<any> = [];
  pastMeetings: Array<any> = [];
  futureMeetings: Array<any> = [];
  todaysMeetings: Array<any> = [];
  Events: any[] = [];
  id = localStorage.getItem('emailID');
  // showId = false
  showDeetsFor = '';
  idSelected = '';
  nameWhoseCalendar = '';
  selectedUserAvObj = {};

  displayTimeDiv = false;
  dateSelected = '';
  selectedDayName = '';
  selectedMonth = '';
  userAvailaibleArray: string[] = [];
  allTimesArray = [];
  showNext = false;
  selectedDateMeets = [];
  showMeets = false;
  meetId = '';
  selectedUserEmailId = '';
  eventObj = {};

  showPopUp = false;

  newObj: EditObj = {
    evType: '',
    date: '',
    startTime: '',
    endTime: '',
    name: '',
    emailId: [],
  };

  newEditObj: NewEditObj = {
    // 'evType':"",
    date: '',
    startTime: '',
    endTime: '',
    name: '',
    emailId: [],
    // 'meetId' : ""
  };

  currentDate: Date;
  currentformattedDate: string;
  workingHrStart = '';
  workingHrEnd = '';
  duration = {
    hrs: 0,
    minutes: 30,
  };
  workingHrsAsPerDays = {
    '1': {
      start: '09:00:00',
      end: '17:00:00',
    },
    '2': {
      start: '09:00:00',
      end: '17:00:00',
    },
    '3': {
      start: '09:00:00',
      end: '17:00:00',
    },
    '4': {
      start: '09:00:00',
      end: '17:00:00',
    },
    '5': {
      start: '09:00:00',
      end: '17:00:00',
    },
  };
  workingDays = [1, 2, 3, 4, 5];
  nonWorkingDays = [0, 6];

  editMeet = false;
  attendees: string[] = [''];

  removedAttendee: string[] = [];
  removedAttendeeUndo: boolean = false;
  removedAttendeeEmail = '';

  selectedTime: string = '30';
  numberOfEventsSelected = 0;

  newlySelectedEvents = [];

  calendarOptionsWeek: CalendarOptions = {
    plugins: [timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    dayHeaderFormat: { weekday: 'short', day: 'numeric' },
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: '',
    },
    views: {
      timeGridWeek: {
        buttonText: 'Week',
      },
    },
    weekends: true,
    // editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    slotDuration: '00:30:00', // Default to 30 minutes
    slotLabelInterval: '01:00:00',

    select: this.handleDateSelect.bind(this),
  };

  private subscription: Subscription;

  constructor(
    private apiService: APIService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {

    if (!this.token) {
      this.router.navigate(['/login']);
    }

    localStorage.setItem('selectedDuration', this.selectedTime);

    this.apiService.getMeetingsforUserToSee(this.id);

    this.subscription = this.apiService.getMeetingsforUserToSee$.subscribe(
      (getMeetingsforUserToSee) => {
        console.log('Meetings in ts :', getMeetingsforUserToSee);

        // this.formattedMeetingsHide = formattedMeetingsHide;
        let newArr = [];
        console.log(this.formattedMeetingsHide);

        for (let i = 0; i < getMeetingsforUserToSee.length; i++) {
          if (getMeetingsforUserToSee[i].start != '2019-01-18T09:00:00+05:30') {
            //not to push sample meeting
            newArr.push(getMeetingsforUserToSee[i]);
          }
        }

        this.formattedMeetingsHide = newArr;
        console.log('Events ', this.Events);
      }
    );

    console.log('Create Meeting Component initialized');

    const name = localStorage.getItem('userLoggedInName');
    this.nameWhoseCalendar = name;

    // const id = params['id'];
    const id = localStorage.getItem('emailID');

    console.log('ng oninit called');
    this.apiService.setUserName(name);
    this.apiService.setUserEmailId(id);
    console.log('Name:', name);
    console.log('ID:', id);

    // Fetch meetings when component initializes
    console.log('sending id ', id);

    this.apiService.getMeetingsforUserToSee(id);
    this.apiService.getSelectedUsersAvailaibilityObj();

    this.subscription = this.apiService.getMeetingsforUserToSee$.subscribe(
      (Meetings) => {
        console.log('Meetings in ts :', Meetings);
        this.formattedMeetingsHide = Meetings;
        this.Events = Meetings;

        console.log('Events ', this.Events);
      }
    );

    // this.apiService.getSelectedUsersAvailaibilityObj()

    this.subscription = this.apiService.selectedUserAvailabilityObj$.subscribe(
      (avObj) => {
        this.selectedUserAvObj = avObj;
        console.log('selectedUserAvObj ', this.selectedUserAvObj);

        this.duration = this.selectedUserAvObj['duration'];
        this.workingHrsAsPerDays = this.selectedUserAvObj['workingHrs'];

        this.workingDays = this.selectedUserAvObj['workingDays'];
        this.nonWorkingDays = this.selectedUserAvObj['nonWorkingDays'];
      }
    );

    setTimeout(() => {
      this.calendarOptionsWeek = {
        initialView: 'dayGridWeek',
        events: this.Events, //commented so that events are not shown on calendar
        // dateClick: this.onDateClick.bind(this),
        // dayCellContent: this.theDayCellContent.bind(this),
        eventClick: this.onEventClick.bind(this),
        eventDidMount: this.eventDidMount.bind(this),
      };
    }, 2500);
  }

  // ----------theDayCellContent starts----------
  // theDayCellContent(info: any) {
  //   const dayOfWeek = info.date.getDay();
  //   const date = info.date.getDate();
  //   // console.log(dayOfWeek);
  //   for (let i = 0; i < this.nonWorkingDays.length; i++) {
  //     if (dayOfWeek === this.nonWorkingDays[i]) {
  //       return { html: '<div style="color: grey">' + date + '</div>' };
  //     }
  //   }
  //   return { html: '<div>' + date + '</div>' };
  // }
  // ----------theDayCellContent ends------------

  // -----------------
  // onDateClick(res: any) {
  //   console.log('Clicked on date : ' + res.dateStr); //2024-02-13
  // }
  // ------------------

  eventDidMount(info) {
    const eventDate = new Date(info.event.start);
    const currentDate = new Date();
    if (eventDate < currentDate) {
      const el = info.el;
      el.classList.add('unavailable'); // Add a class to style as unavailable
      el.title = 'This time is unavailable'; // Tooltip message on hover
    }
  }

  // -----------------
  onEventClick(res: any) {
    console.log('event clicked ');

    this.showMeets = true;

    let response = JSON.stringify(res);
    response = JSON.parse(response);
    let event = response['event'];
    console.log('response ', response);
    console.log('event ', response['event']);

    this.meetId = event.extendedProps.Id;

    this.newObj['evType'] = event.extendedProps.evType;
    this.newEditObj['evType'] = event.extendedProps.evType;
    console.log("this.newObj['evType'] ", this.newObj['evType']);

    this.newObj['date'] = event.start.split('T')[0];
    this.newEditObj['date'] = event.start.split('T')[0];
    console.log("this.newObj['date'] ", this.newObj['date']);

    this.newObj['startTime'] = event.start.split('T')[1].split('+')[0];
    this.newEditObj['startTime'] = event.start.split('T')[1].split('+')[0];
    console.log("this.newObj['startTime'] ", this.newObj['startTime']);

    console.log('end ', event.end);

    this.newObj['endTime'] = event.end.split('T')[1].split('+')[0];
    this.newEditObj['endTime'] = event.end.split('T')[1].split('+')[0];
    console.log("this.newObj['endTime'] ", this.newObj['endTime']);

    this.newObj['name'] = event.extendedProps.name;
    this.newEditObj['name'] = event.extendedProps.name;
    console.log("this.newObj['name'] ", this.newObj['name']);

    this.newObj['emailId'] = event.extendedProps.emailId;
    this.newEditObj['emailId'] = event.extendedProps.emailId;
    console.log("this.newObj['emailId'] ", this.newObj['emailId']);

    console.log('newObj ', this.newObj);
  }

  // -------------------

  setEventId(id) {
    console.log('idSelected ', this.idSelected);
    this.idSelected = id;
    console.log('idSelected ', this.idSelected);
    // this.showId = true
    this.showDeetsFor = id;
  }

  closeDeets() {
    this.idSelected = '';
    console.log('idSelected ', this.idSelected);
    this.showDeetsFor = '';
  }

  closePopUp() {
    this.showMeets = false;
    this.editMeet = false;
    console.log(this.showMeets);
  }

  editMeetingPopUp() {
    this.showMeets = false;
    this.editMeet = true;
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
    this.newEditObj['emailId'].splice(index, 1);
    this.removedAttendeeUndo = true;
    this.removedAttendeeEmail = email;
    console.log(this.newEditObj);
  }

  editMeetingfromUserSide() {
    this.selectedUserEmailId = localStorage.getItem('emailID');
    console.log(this.selectedUserEmailId, this.meetId);
    console.log('meetId ', this.meetId);
    console.log('newEditObj ', this.newEditObj);
    console.log(
      this.newObj.date,
      this.newEditObj.date,
      this.newObj.startTime,
      `${this.newEditObj.startTime}:00`,
      this.newObj.endTime,
      `${this.newEditObj.endTime}:00`,
      this.newObj.date == this.newEditObj.date,
      this.newObj.startTime == `${this.newEditObj.startTime}:00`,
      this.newObj.endTime == `${this.newEditObj.endTime}:00`
    );

    this.newEditObj.emailId = [...this.newEditObj.emailId, ...this.attendees];

    console.log('attendees ', this.attendees);
    console.log('newEditObj ', this.newEditObj);

    this.editMeet = false;
    if (
      (this.newObj.date == this.newEditObj.date &&
        this.newObj.startTime == `${this.newEditObj.startTime}:00` &&
        this.newObj.endTime == `${this.newEditObj.endTime}:00`) ||
      (this.newObj.date == this.newEditObj.date &&
        this.newObj.startTime == this.newEditObj.startTime &&
        this.newObj.endTime == this.newEditObj.endTime)
    ) {
      alert('Date and time are same as previous.');
    } else {
      this.apiService.editMeetingfromUserSide(
        this.selectedUserEmailId,
        this.meetId,
        this.newEditObj.date,
        this.newEditObj.startTime,
        this.newEditObj.endTime,
        this.newEditObj.name,
        this.newEditObj.emailId
      );
    }
  }

  onDurationChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;
    if (value == '1') {
      this.selectedTime = '60';
    } else {
      this.selectedTime = value;
    }
    localStorage.setItem('selectedDuration', this.selectedTime);
    console.log('selectElement ', selectElement);

    console.log('value ', value);

    if (value == '1') {
      this.calendarOptionsWeek.slotDuration = `0${value}:00:00`;
    } else {
      this.calendarOptionsWeek.slotDuration = `00:${value}:00`;
    }
    console.log(
      'this.calendarOptionsWeek.slotDuration ',
      this.calendarOptionsWeek.slotDuration
    );
  }



  resetDuration() {
    this.makeDurationDisabled = false;
  
    if (this.calendarApi) {
      this.calendarApi.unselect(); // Clear any previous selections
  
      // Iterate over each calendar event
      // loggedInEmailId
      this.calendarApi.getEvents().forEach((calevent) => {
        // Iterate over each newly selected event
        this.newlySelectedEvents.forEach((event) => {
          // Compare the start and end times of calevent and event
          if (calevent.start.getTime() === new Date(event.start).getTime() &&
              calevent.end.getTime() === new Date(event.end).getTime()) {
            // Remove the calendar event if the start and end times match
            calevent.remove();
          }
        });
      });
  
      // Clear the newly created events array
      this.newlySelectedEvents = [];
      this.numberOfEventsSelected = 0
    }
  }
  

  handleDateSelect(selectInfo) {
    console.log('handle date select called ');

    const eventDate = new Date(selectInfo.start);
    console.log('selectInfo ', selectInfo);

    const currentDate = new Date();
    console.log('eventDate ', eventDate, 'currentDate ', currentDate);

    if (eventDate < currentDate) {
      console.log('satisfied ');
      alert('This date and time are not available');
      return;
    }
    if (this.numberOfEventsSelected >= 20) {
      this.calendarOptionsWeek.selectable = false;
      alert('Event count reached');
      return;
    } else {

      this.makeDurationDisabled = true

      this.calendarApi = selectInfo.view.calendar;

      this.calendarApi.unselect(); // Clear any previous selections

      let endDate = new Date(selectInfo.start);
      endDate.setMinutes(endDate.getMinutes() + parseInt(this.selectedTime));

      console.log('calendarApi ', this.calendarApi);

      let newEvent = {
        Id: Math.floor(Math.random() * 10000000000000001),
        start: selectInfo.startStr,
        end: endDate.toISOString(),
      };

      this.calendarApi.addEvent(newEvent);

      this.numberOfEventsSelected = this.numberOfEventsSelected + 1;

      // Track newly selected events
      if (!this.newlySelectedEvents) {
        this.newlySelectedEvents = [];
      }
      this.newlySelectedEvents.push(newEvent);
    }
  }

  nextBtn() {
    let events = this.newlySelectedEvents;
    console.log('events ', events);

    console.log('Selected events count:', events.length);

    // events.forEach((event) => {
    //   console.log('Event:', {
    //     id: event.id,
    //     title: event.title,
    //     start: event.start,
    //     end: event.end,
    //     allDay: event.allDay,
    //   });
    // });
    // timesForVoting
    //     this.userLoggedInEmailIdSubject.next(user.emailID);

    this.apiService.updateTimesForVoting(events);
  }
}


