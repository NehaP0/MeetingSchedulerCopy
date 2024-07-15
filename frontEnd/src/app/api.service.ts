import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, take, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class APIService {
  private userNameSubject = new BehaviorSubject<string>('');
  private emailIdSubject = new BehaviorSubject<string>('');
  private eventDateSubject = new BehaviorSubject<string>('');
  private eventTimeSubject = new BehaviorSubject<string>('');
  private meetingArraySubject = new BehaviorSubject<any[]>([]);
  private usersSubject = new BehaviorSubject<object[]>([]);
  private formattedMeetingsSubject = new BehaviorSubject<any[]>([]);
  private formattedMeetingsHideSubject = new BehaviorSubject<any[]>([]);
  private formattedMeetingsOfLoggedInUserSubject = new BehaviorSubject<any[]>(
    []
  );
  private userLoggedInSubject = new BehaviorSubject<boolean>(false);
  private userLoggedInEmailIdSubject = new BehaviorSubject<string>('');
  private userLoggedInNameSubject = new BehaviorSubject<string>('');
  // private userAvailableOnWeekendsSubject = new BehaviorSubject<boolean>(true);
  private initiallyUserUnavailabelOnArraySubject = new BehaviorSubject<
    number[]
  >([]);
  private userUnavailabelOnArraySubject = new BehaviorSubject<number[]>([0, 6]);
  private userAvailabelOnArraySubject = new BehaviorSubject<number[]>([
    1, 2, 3, 4, 5,
  ]);
  private durationSubject = new BehaviorSubject<object>({
    hrs: 0,
    minutes: 30,
  });
  private workingHrsSubject = new BehaviorSubject<object>({
    1: { start: '09:00:00', end: '17:00:00' },
    2: { start: '09:00:00', end: '17:00:00' },
    3: { start: '09:00:00', end: '17:00:00' },
    4: { start: '09:00:00', end: '17:00:00' },
    5: { start: '09:00:00', end: '17:00:00' },
  });
  private selectedUserAvailabilityObjSubject = new BehaviorSubject<object>({});
  private eventsArraySubject = new BehaviorSubject<object[]>([]);
  private eventTypeSubject = new BehaviorSubject<string>('');
  private getMeetingsforUserToSeeSubject = new BehaviorSubject<any[]>([]);
  private getEventsforUserToSeeSubject = new BehaviorSubject<any[]>([]);
  private getMeetingsOfParticularEventAdminSubject = new BehaviorSubject<any[]>(
    []
  );
  private timesForVotingSubject = new BehaviorSubject<any[]>([]);
  private meetingPollDetailsSubject = new BehaviorSubject<object>({});
  private votingLinkSubject = new BehaviorSubject<string>('');
  private votingArrSubject = new BehaviorSubject<any[]>([]);
  private reqEventSubject = new BehaviorSubject<object>({});

  public userName$ = this.userNameSubject.asObservable();
  public emailId$ = this.emailIdSubject.asObservable();
  public eventDate$ = this.eventDateSubject.asObservable();
  public eventTime$ = this.eventTimeSubject.asObservable();
  public meetingArray$ = this.meetingArraySubject.asObservable();
  public users$ = this.usersSubject.asObservable();
  public formattedMeetings$ = this.formattedMeetingsSubject.asObservable();
  public formattedMeetingsHide$ =
    this.formattedMeetingsHideSubject.asObservable();
  public userLoggedIn$ = this.userLoggedInSubject.asObservable();
  public userLoggedInEmailId$ = this.userLoggedInEmailIdSubject.asObservable();
  public formattedMeetingsOfLoggedInUser$ =
    this.formattedMeetingsOfLoggedInUserSubject.asObservable();
  public userLoggedInName$ = this.userLoggedInNameSubject.asObservable();
  // public userAvailableOnWeekends$ = this.userAvailableOnWeekendsSubject.asObservable();
  public userUnavailabelOnArray$ =
    this.userUnavailabelOnArraySubject.asObservable();
  public initiallyUserUnavailabelOnArray$ =
    this.initiallyUserUnavailabelOnArraySubject.asObservable();
  public userAvailabelOnArray$ =
    this.userAvailabelOnArraySubject.asObservable();
  public duration$ = this.durationSubject.asObservable();
  public workingHrs$ = this.workingHrsSubject.asObservable();
  public selectedUserAvailabilityObj$ =
    this.selectedUserAvailabilityObjSubject.asObservable();
  public eventsArray$ = this.eventsArraySubject.asObservable();
  public eventType$ = this.eventTypeSubject.asObservable();
  public getMeetingsforUserToSee$ =
    this.getMeetingsforUserToSeeSubject.asObservable();
  public getEventsforUserToSee$ =
    this.getEventsforUserToSeeSubject.asObservable();
  public getMeetingsOfParticularEventAdmin$ =
    this.getMeetingsOfParticularEventAdminSubject.asObservable();
  public timesForVoting$ = this.timesForVotingSubject.asObservable();
  public meetingPollDetails$ = this.meetingPollDetailsSubject.asObservable();
  public votingLink$ = this.votingLinkSubject.asObservable();
  public votingArr$ = this.votingArrSubject.asObservable();
  public reqEvent$ = this.reqEventSubject.asObservable()

  API_URL = 'http://localhost:3000';

  private headers: HttpHeaders = new HttpHeaders();

  constructor(private httpClient: HttpClient, private router: Router) { }

  getallusers() {
    return this.httpClient.get(`${this.API_URL}/allUsersRoute/`, {
      headers: {
        // Authorization: `Bearer ${token}`
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  }

  async getParticularUser(emailId){
    const response = await this.httpClient.get(`${this.API_URL}/user/getParticularUser?userEmailId=${emailId}`, {
      headers: {
        // Authorization: `Bearer ${token}`
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }).toPromise();;

    console.log("got user ", response['user']);
    return response['user']
    
  }

  async getParticularUserEventLiksArr(emailId){
    const response = await this.httpClient.get(`${this.API_URL}/user/getParticularUser?userEmailId=${emailId}`, {
      headers: {
        // Authorization: `Bearer ${token}`
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }).toPromise();;

    console.log("got user ", response['user']);
    let user = response['user']
    let eventLinksArr = user["eventLinks"]
    return eventLinksArr
  } 

  registerUser(user) {
    // console.log(user);
    user['userAvailability'] = {
      duration: '',
      workingHrs: '',
      workingDays: '',
      nonWorkingDays: '',
    };

    this.duration$.subscribe((durationValue) => {
      user.userAvailability.duration = durationValue;
    });

    this.workingHrs$.subscribe((workingHrsValue) => {
      user.userAvailability.workingHrs = workingHrsValue;
    });

    this.userAvailabelOnArray$.subscribe((userAvailabelOnArrayValue) => {
      user.userAvailability.workingDays = userAvailabelOnArrayValue;
    });

    this.userUnavailabelOnArray$.subscribe((userUnavailabelOnArrayValue) => {
      user.userAvailability.nonWorkingDays = userUnavailabelOnArrayValue;
    });

    console.log('user ', user);

    return this.httpClient.post(`${this.API_URL}/user/postuser`, user);
  }

  async findLoggedInName(email) {
    const usersObj = await this.httpClient
      .get(`${this.API_URL}/allUsersRoute/`)
      .toPromise();

    const users = usersObj['users'];
    console.log('users', users);

    const user = (users as any[]).find((u) => u.emailID === email);
    const name = user.name;
    localStorage.setItem('userLoggedInName', name);
    this.userLoggedInNameSubject.next(name);
  }

  loginUser(user) {
    console.log('user ', user);
    this.userLoggedInSubject.next(true);
    this.userLoggedInEmailIdSubject.next(user.emailID);
    // this.userLoggedInNameSubject.next(user.name);
    console.log('id value after login ', this.userLoggedInEmailIdSubject);

    this.findLoggedInName(user.emailID);

    console.log('userLoggedIn api service ts', this.userLoggedIn$);
    return this.httpClient.post(`${this.API_URL}/user/login`, user);
  }

  // loginUser(user) : Observable<{token: string}>{
  //   console.log("user ",user);
  //   // console.log("token ", token);

  //   this.userLoggedInSubject.next(true);
  //   this.userLoggedInEmailIdSubject.next(user.emailID);
  //   // this.userLoggedInNameSubject.next(user.name);
  //   console.log("id value after login ",this.userLoggedInEmailIdSubject);

  //   this.findLoggedInName(user.emailID)

  //   console.log("userLoggedIn api service ts", this.userLoggedIn$);
  //   return this.httpClient.post<{token: string}>(`${this.API_URL}/user/login`, user)
  // }

  logoutUser() {
    this.userLoggedInSubject.next(false);
  }

  // isAuth(){
  //   return this.userLoggedInSubject
  // }

  //to set Authorization header
  setAuthorizationHeader(token: string) {
    this.headers = new HttpHeaders().set('Authorization', token);
  }

  scheduleMeet(meet) {
    console.log('scheduleMeet functn called and meet details', meet);
    // console.log(meet);
    return this.httpClient.post(
      `${this.API_URL}/meeting/createMeeting`,
      {
        headers: {
          // Authorization: `Bearer ${token}`
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
      meet
    );
  }

  scheduleMeetByCalendarLink(meet) {
    console.log(
      'scheduleMeetByCalendarLink functn called and meet details',
      meet
    );
    // console.log(meet);
    return this.httpClient.post(`${this.API_URL}/calendarLink/`, meet);
  }

  scheduleMeetBymakeMeetingPage(meet) {
    console.log(
      'scheduleMeetByCalendarLink functn called and meet details',
      meet
    );
    console.log('meet from apiservice ', meet);
    // return meet
    return this.httpClient.post(
      `${this.API_URL}/calendarLink/postMeetFromMeetPage`,
      meet
    );
  }

  setUserName(userName: string) {
    console.log('username set by link ', userName);
    this.userNameSubject.next(userName);
  }

  setUserEmailId(emailId: string) {
    console.log('id set by link ', emailId);
    this.emailIdSubject.next(emailId);
  }

  // -------------------------------------------------------------------------------------

  async getMeetings() {
    const usersObj = await this.httpClient
      .get(`${this.API_URL}/allUsersRoute/`)
      .toPromise();

    const users = usersObj['users'];
    console.log('users', users);

    const userName = this.userNameSubject.getValue();
    console.log('userName', userName);

    const user = (users as any[]).find((u) => u.name === userName);

    if (user && user.meetings) {
      const formattedMeetings = user.meetings.map((meeting) => ({
        Id: meeting._id,
        Subject: meeting.Subject,
        StartTime: new Date(meeting.StartTime),
        EndTime: new Date(meeting.EndTime),
      }));

      this.formattedMeetingsSubject.next(formattedMeetings);
    }
  }

  // --------------------------------------------------------
  async getMeetingsHide(id) {

    this.emailIdSubject.next(id)
    // const usersObj = await this.httpClient.get(`${this.API_URL}/allUsersRoute/`).toPromise();

    // const users =  usersObj["users"]
    // console.log("users", users);

    // const userName = name

    // const user = (users as any[]).find((u) => u.name === userName);

    // if (user && user.meetings) {
    //   const formattedMeetingsHide = user.meetings.map(meeting => ({
    //     Id: meeting._id,
    //     title: "Unavailable",
    //     // title: meeting.title,
    //     start: meeting.start,
    //     end: meeting.end,
    //   }));

    //   this.formattedMeetingsHideSubject.next(formattedMeetingsHide);
    // }

    const usersObj = await this.httpClient
      .get(`${this.API_URL}/allUsersRoute/`)
      .toPromise();

    const users = usersObj['users'];
    console.log('users', users);

    const userId = id;

    console.log('userId ', userId);

    const user = (users as any[]).find((u) => u.emailID === userId);
    console.log('found user', user);

    const userEventsArray = user.events;

    console.log('userEventsArray ', userEventsArray);

    // let formattedMeetingsHide = []
    // for(let i=0; i<userEventsArray.length; i++){
    //   let userMeetings = userEventsArray[i]
    //   for(let j=0; j<userMeetings.length; j++){
    //     formattedMeetingsHide.push(userMeetings[j])
    //   }
    // }

    // console.log(formattedMeetingsHide);

    // if (user && user.meetings) {
    // }

    //----------- commented now-----
    // const formattedMeetingsHide = user.events[0].meetings.map(meeting => ({
    //   Id: meeting._id,
    //   // title: "Unavailable",
    //   title: meeting.title,
    //   start: meeting.start,
    //   end: meeting.end,
    // }));

    // this.formattedMeetingsHideSubject.next(formattedMeetingsHide);
    //----------  commented now

    console.log('user events ', user.events);

    let meetings = [];
    for (let i = 0; i < user.events.length; i++) {
      console.log(
        'event ',
        user.events[i],
        'particular event meetings ',
        user.events[i].meetings
      );
      let meetingsArr = user.events[i].meetings;
      // const formattedMeetingsHide = user.events[i].meetings.map(meeting => ({
      //   Id: meeting._id,
      //   // title: "Unavailable",
      //   // title: "",
      //   start: meeting.start,
      //   end: meeting.end,
      // }));

      for (let j = 0; j < meetingsArr.length; j++) {
        let oneMeetObj = {
          Id: meetingsArr[j]._id,
          // title: "Unavailable",
          // title: "",
          start: meetingsArr[j].start,
          end: meetingsArr[j].end,
        };
        meetings.push(oneMeetObj);
      }

      // meetings = [...meetings, formattedMeetingsHide]
    }
    for (let i = 0; i < user.meetingsWtOthers.length; i++) {
      let oneMeetObj = {
        Id: user.meetingsWtOthers[i]._id,
        // title: "Unavailable",
        // title: "",
        start: user.meetingsWtOthers[i].start,
        end: user.meetingsWtOthers[i].end,
      };
      meetings.push(oneMeetObj);
    }

    console.log('meetings ', meetings);

    this.formattedMeetingsHideSubject.next(meetings);
  }

  async getMeetingsforUserToSee(id) {
    const usersObj = await this.httpClient
      .get(`${this.API_URL}/allUsersRoute/`)
      .toPromise();

    const users = usersObj['users'];
    console.log('users', users);

    const userId = id;

    console.log('userId ', userId);

    const user = (users as any[]).find((u) => u.emailID === userId);
    console.log('found user', user);

    const userEventsArray = user.events;

    console.log('userEventsArray ', userEventsArray);

    this.getEventsforUserToSeeSubject.next(userEventsArray);

    console.log('userEventsArray ', userEventsArray);

    console.log('user events ', user.events);

    let allMeetings = [];
    for (let i = 0; i < user.events.length; i++) {
      console.log(
        'event ',
        user.events[i],
        'particular event meetings ',
        user.events[i].meetings
      );
      let event = user.events[i];
      let meetingsArr = user.events[i].meetings;

      // let meetInOneEvent = []
      for (let j = 0; j < meetingsArr.length; j++) {
        let oneMeetObj = {
          Id: meetingsArr[j]._id,
          name: meetingsArr[j].user,
          emailId: meetingsArr[j].userEmail,
          evName: event.evName,
          evType: event.evType,
          // currentDate: meetingsArr[j].currentDate,
          start: meetingsArr[j].start,
          end: meetingsArr[j].end,
        };
        // meetInOneEvent.push(oneMeetObj)
        // allMeetings.push(user.events[i])
        console.log('his own meet oneMeetObj ', oneMeetObj);

        allMeetings.push(oneMeetObj);
      }
      // meetings = [...meetings, formattedMeetingsHide]
    }
    for (let i = 0; i < user.meetingsWtOthers.length; i++) {
      let oneMeetObj = {
        Id: user.meetingsWtOthers[i]._id,
        name: user.meetingsWtOthers[i].user,
        emailId: user.meetingsWtOthers[i].userEmail,
        evName: user.meetingsWtOthers[i].evName,
        evType: user.meetingsWtOthers[i].evType,
        // currentDate: user.meetingsWtOthers[i].currentDate,
        // title: "Unavailable",
        // title: "",
        start: user.meetingsWtOthers[i].start,
        end: user.meetingsWtOthers[i].end,
      };

      console.log('his meet with others oneMeetObj ', oneMeetObj);

      allMeetings.push(oneMeetObj);
    }

    console.log('allMeetings ', allMeetings);

    this.getMeetingsforUserToSeeSubject.next(allMeetings);
  }

  async getMeetingOfLoggedInUser() {
    const usersObj = await this.httpClient
      .get(`${this.API_URL}/allUsersRoute/`)
      .toPromise();

    const users = usersObj['users'];
    console.log('users', users);

    // const userEmail = this.userLoggedInEmailIdSubject.getValue();
    const userEmail = localStorage.getItem('emailID' || '');
    console.log('Email of loggedIn user', userEmail);

    const user = (users as any[]).find((u) => u.emailID === userEmail);

    this.userLoggedInNameSubject.next(user.name);
    localStorage.setItem(
      'userLoggedInName',
      this.userLoggedInNameSubject.getValue()
    );

    if (user && user.meetings) {
      const formattedMeetings = user.meetings.map((meeting) => ({
        Id: meeting._id,
        title: meeting.title,
        start: meeting.start,
        end: meeting.end,
      }));

      this.formattedMeetingsOfLoggedInUserSubject.next(formattedMeetings);
      console.log(
        'this.formattedMeetingsOfLoggedInUser$ ',
        this.formattedMeetingsOfLoggedInUser$
      );
      // console.log( this.formattedMeetingsSubject);
    }
  }

  //-----------------------------------------------------------------------------------

  async initiallyUserUnavailbeOn(userId) {
    console.log('initiallyUserUnavailbeOn called ');
    const response = await this.httpClient
      .get(`${this.API_URL}/user/initialUserUnavailibility?userId=${userId}`)
      .toPromise();
    console.log('response ', response);
  }

  userUnavOn(dayNumberArray) {
    // this.userUnavailabelOnArraySubject = dayNumberArray
    this.userUnavailabelOnArraySubject.next(dayNumberArray);
    console.log('unavailable ', this.userUnavailabelOnArraySubject);
  }

  userAvOnDay(dayNumberArray) {
    // this.userAvailabelOnArraySubject = dayNumberArray
    // console.log("Available ", this.userAvailabelOnArraySubject);

    this.userAvailabelOnArraySubject.next(dayNumberArray);
    console.log('Available ', dayNumberArray);

    // this.userAvailabelOnArray$.subscribe((userAvailabelOnArrayValue) => {
    //     console.log("available value ", userAvailabelOnArrayValue);
    // });
  }

  userAvOnTime(durationObj) {
    // if(durationObj.hrs==""){
    //   durationObj.hrs = 0
    // }
    this.duration$ = durationObj;
    console.log('duration ', this.duration$);
  }

  userWorkingHrs(wrkngHrsObj) {
    this.workingHrs$ = wrkngHrsObj;
    console.log('workingHrs ', this.workingHrs$);
    this.patchUserAvailability();
  }


  patchUserAvailability() {
    console.log('pathUserAvailability called');

    //     this.userLoggedInEmailIdSubject.next(user.emailID);
    let emailID = localStorage.getItem('emailID');
    // let userAvailability = {};
    let userAvailability = {
      duration: {},
      workingHrs: {},
      workingDays: [],
      nonWorkingDays: [],
    };

    // this.userLoggedInEmailId$.subscribe((userLoggedInEmailIdValue) => {
    //   emailID = userLoggedInEmailIdValue;
    // });
    // console.log("log in id ",this.userLoggedInEmailId$);

    console.log(this.duration$, this.workingHrs$);

    userAvailability.duration = this.duration$;
    userAvailability.workingHrs = this.workingHrs$;

    this.userAvailabelOnArray$.subscribe((userAvailabelOnArrayValue) => {
      console.log('available value ', userAvailabelOnArrayValue);

      userAvailability.workingDays = userAvailabelOnArrayValue;
      console.log('available on ', userAvailabelOnArrayValue);
    });

    this.userUnavailabelOnArray$.subscribe((userUnavailabelOnArrayValue) => {
      userAvailability.nonWorkingDays = userUnavailabelOnArrayValue;
      console.log('unavailable on ', userUnavailabelOnArrayValue);
    });

    console.log(userAvailability);

    return this.httpClient
      .patch(
        `${this.API_URL}/user/patchuser`,
        { emailID, userAvailability },
        {
          headers: {
            // Authorization: `Bearer ${token}`
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      .subscribe(
        (response) => {
          console.log(response);
          alert(response['message']);
        },
        (error) => {
          console.error(error);
        }
      );
  }



  userWorkingHrsAdmin(wrkngHrsObj, selectedUserEmail) {
    this.workingHrs$ = wrkngHrsObj;
    console.log('workingHrs ', this.workingHrs$);
    this.patchUserAvailabilityAdmin(selectedUserEmail);
  }


  patchUserAvailabilityAdmin(selectedUserEmail) {
    console.log('pathUserAvailability called');

    //     this.userLoggedInEmailIdSubject.next(user.emailID);
    let emailID = selectedUserEmail;
    // let userAvailability = {};
    let userAvailability = {
      duration: {},
      workingHrs: {},
      workingDays: [],
      nonWorkingDays: [],
    };

    // this.userLoggedInEmailId$.subscribe((userLoggedInEmailIdValue) => {
    //   emailID = userLoggedInEmailIdValue;
    // });
    // console.log("log in id ",this.userLoggedInEmailId$);

    console.log(this.duration$, this.workingHrs$);

    userAvailability.duration = this.duration$;
    userAvailability.workingHrs = this.workingHrs$;

    this.userAvailabelOnArray$.subscribe((userAvailabelOnArrayValue) => {
      console.log('available value ', userAvailabelOnArrayValue);

      userAvailability.workingDays = userAvailabelOnArrayValue;
      console.log('available on ', userAvailabelOnArrayValue);
    });

    this.userUnavailabelOnArray$.subscribe((userUnavailabelOnArrayValue) => {
      userAvailability.nonWorkingDays = userUnavailabelOnArrayValue;
      console.log('unavailable on ', userUnavailabelOnArrayValue);
    });

    console.log(userAvailability);

    return this.httpClient
      .patch(
        `${this.API_URL}/user/patchuser`,
        { emailID, userAvailability },
        {
          headers: {
            // Authorization: `Bearer ${token}`
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      .subscribe(
        (response) => {
          console.log(response);
          alert(response['message']);
        },
        (error) => {
          console.error(error);
        }
      );
  }

  async getSelectedUsersAvailaibilityObj() {
    console.log('called for Av Obj');

    const usersObj = await this.httpClient
      .get(`${this.API_URL}/allUsersRoute/`)
      .toPromise();

    const users = usersObj['users'];
    console.log('users', users);

    let emailIDofSelectedUser = '';

    this.emailId$.subscribe((emailIdValue) => {
      emailIDofSelectedUser = emailIdValue;
    });

    console.log('email ', emailIDofSelectedUser);

    for (let i = 0; i < users.length; i++) {
      if (users[i]['emailID'] == emailIDofSelectedUser) {
        // this.selectedUserAvailabilityObj$ = users[i]["userAvailability"]
        this.selectedUserAvailabilityObjSubject.next(
          users[i]['userAvailability']
        );
        // console.log("selectedUserAvailabilityObj ",this.selectedUserAvailabilityObj$);
        break;
      }
    }
  }

  async getEvents() {
    console.log('get events called');

    const response = await this.httpClient
      .get(`${this.API_URL}/event/getEvents`)
      .toPromise();
    console.log('events ', response['message']);
    const events = response['message'];
    this.eventsArraySubject.next(events);
  }

  updateEventType(evType) {
    //tells the type of event, like one-on-one
    console.log('called updateEventType');
    console.log('evType ', evType);
    this.eventTypeSubject.next(evType);
    this.eventType$.subscribe((eventTypeValue) => {
      console.log('eventTypeValue in updateEventType is ', eventTypeValue);
    });
  }

  async createNewEvent(
    eventName: string,
    hrs: string,
    min: string,
    location: string,
    inviteesPerEvent: number,
    displayRemainingSpots: boolean
  ) {
    // let {evName, evType, evDuration, evLocation} = req.body

    let loggedInName = localStorage.getItem('userLoggedInName' || '');
    let loggedInEmailId = localStorage.getItem('emailID' || '');

    let evType = localStorage.getItem('evType');
    // this.eventType$.subscribe((eventTypeValue)=>{
    //   evType = eventTypeValue
    // })
    // evType = this.eventType$

    console.log('createNewEvtn called', eventName, hrs, min, location, evType);

    let event = {
      evName: eventName,
      evType: evType,
      evDuration: { hrs: hrs, minutes: min },
      evLocation: location,
      inviteesPerEvent,
      displayRemainingSpots
    };
    // let event = {evName:"eventName", evType:"evType", evDuration:{"hrs": 0,"minutes":0}, evLocation: "location" }

    console.log(event);

    const response = await this.httpClient
      .post(`${this.API_URL}/event/createEvent`, event, {
        headers: {
          // Authorization: `Bearer ${token}`
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .toPromise();
    console.log('gotten response ', response['message']);
    if (response['message'] == 'Event created') {
      localStorage.setItem('eventName', eventName);
      localStorage.setItem('evDurHrs', hrs);
      localStorage.setItem('evDurMins', min);
      localStorage.setItem('eventLocation', location);
      // console.log(loggedInName, loggedInEmailId);

      // console.log(`http://localhost:3000/calendarLink?name=${loggedInName}&id=${loggedInEmailId}`);

      window.open(
        `http://localhost:3000/calendarLink?name=${loggedInName}&id=${loggedInEmailId}`
      );
    } else {
      alert(response['message']);
    }
  }

  deleteEvent(id: string) {
    console.log('delete called in api');

    return this.httpClient
      .delete(`${this.API_URL}/event/deleteEvent?id=${id}`, {
        headers: {
          // Authorization: `Bearer ${token}`
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .subscribe(
        (response) => {
          console.log(response);
          alert(response['message']);
          window.location.reload();
        },
        (error) => {
          console.error(error);
        }
      );
  }

  async editEvent(
    id: string,
    eventName: string,
    hrs: number,
    min: number,
    location: string,
    evType: string,
    description: string
  ) {
    // let {evName, evType, evDuration, evLocation} = req.body


    console.log(
      'editEvtn called in apiService',
      eventName,
      hrs,
      min,
      location,
      evType,
      description
    );

    let event = {
      evId: id,
      evName: eventName,
      evType: evType,
      evDuration: { hrs: hrs, minutes: min },
      evLocation: location,
      description
    };
    // let event = {evName:"eventName", evType:"evType", evDuration:{"hrs": 0,"minutes":0}, evLocation: "location" }

    console.log(event);

    const response = await this.httpClient
      .patch(`${this.API_URL}/event/editEvent`, event, {
        headers: {
          // Authorization: `Bearer ${token}`
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .toPromise();
    console.log('gotten response ', response['message']);
    alert(response['message']);
    if (response['message'] == 'Event edited') {
      window.open('/home', '_self');
    }
  }

  async editEventIfUserCanAddGuests(evId: string, allowInviteesToAddGuests: boolean, maxInviteesPerEvent: number, displayRemainingSPotsOrNot: boolean) {

    console.log('editEventIfUserCanAddGuests called in apiService', evId, allowInviteesToAddGuests, maxInviteesPerEvent, displayRemainingSPotsOrNot);

    let objToSend = {
      evId, allowInviteesToAddGuests, maxInviteesPerEvent, displayRemainingSPotsOrNot
    }

    const response = await this.httpClient
      .patch(`${this.API_URL}/event/editEventIfUserCanAddGuests`, objToSend, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .toPromise();
    console.log('gotten response ', response['message']);
    alert(response['message']);
    // if (response['message'] == 'Event edited') {
    //   window.open('/home', '_self');
    // }


  }

  // setDateAndTime(eventDate: string, eventTime: string) {
  //   this.eventDateSubject.next(eventDate);
  //   this.eventTimeSubject.next(eventTime);
  // }

  // getallusers(){
  //   this.apiService.getallusers().subscribe((data: Array<any>) =>{
  //     this.users = data['users']
  //     console.log(this.users)

  //     for(let i=0; i<this.users.length; i++){
  //       if(this.users[i].name==this.userName){
  //         this.meetingArray = this.users[i].meetings
  //       }
  //     }
  //     console.log("selected username",this.userName)

  //     console.log(this.meetingArray);

  //     this.formattedMeetings = this.meetingArray.map(meeting => ({
  //       Id: meeting._id,
  //       Subject: meeting.Subject,
  //       StartTime: new Date(2023, 12, 16, 9, 30),
  //       EndTime:new Date(2023, 12, 17, 10, 0),
  //     }));

  //     // console.log(this.formattedMeetings);

  //     console.log("formattedMeetings", this.formattedMeetings);
  //     // this.eventObject.dataSource = this.formattedMeetings;

  //   })
  // }

  //Admin part:-

  deleteUser(id: string) {
    console.log('delete user called in api');

    return this.httpClient
      .delete(`${this.API_URL}/user/deleteUser?id=${id}`)
      .subscribe(
        (response) => {
          console.log(response);
          alert(response['message']);
          window.location.reload();
        },
        (error) => {
          console.error(error);
        }
      );
  }

  async editUser(id: string, userName: string, email: string) {
    console.log(id, userName, email);

    let user = { userName, email };

    const response = await this.httpClient
      .patch(`${this.API_URL}/user/editUserNameAndEmail/${id}`, user)
      .toPromise();
    console.log('gotten response ', response['message']);
    alert(response['message']);
    if (response['message'] == 'User Updated') {
      window.location.reload();
    }
  }

  async getEventsOfSelectedUserAdmin(selectedUserId) {
    console.log('get events called');

    const response = await this.httpClient
      .get(
        `${this.API_URL}/event/getEventsOfSelectedUserAdmin/${selectedUserId}`
      )
      .toPromise();
    console.log('events ', response['message']);
    const events = response['message'];
    this.eventsArraySubject.next(events);
  }

  async editEventAdmin(
    selectedUsersId: string,
    id: string,
    eventName: string,
    hrs: number,
    min: number,
    location: string,
    evType: string
  ) {
    // let {evName, evType, evDuration, evLocation} = req.body

    console.log(
      'editEvtn called in apiService',
      eventName,
      hrs,
      min,
      location,
      evType
    );

    let event = {
      evId: id,
      evName: eventName,
      evType: evType,
      evDuration: { hrs: Number(hrs), minutes: Number(min) },
      evLocation: location,
    };
    // let event = {evName:"eventName", evType:"evType", evDuration:{"hrs": 0,"minutes":0}, evLocation: "location" }

    console.log(event);

    const response = await this.httpClient
      .patch(`${this.API_URL}/event/editEventAdmin/${selectedUsersId}`, event)
      .toPromise();
    console.log('gotten response ', response['message']);
    alert(response['message']);
    if (response['message'] == 'Event edited') {
      window.location.reload();
    }
  }

  async createNewEventAdmin(
    selectedUserId,
    eventName,
    eventHrs,
    eventMins,
    eventLocation,
    eventType
  ) {
    console.log(
      'createNewEvtnAdmin called',
      selectedUserId,
      eventName,
      eventHrs,
      eventMins,
      eventLocation,
      eventType
    );

    let event = {
      selectedUserId,
      evName: eventName,
      evType: eventType,
      evDuration: { hrs: eventHrs, minutes: eventMins },
      evLocation: eventLocation,
    };
    console.log(event);

    const response = await this.httpClient
      .post(`${this.API_URL}/event/createEventAdmin`, event)
      .toPromise();
    console.log('gotten response ', response['message']);
    if (response['message'] == 'Event created') {
      alert(response['message']);
      window.location.reload();
    } else {
      alert(response['message']);
    }
  }

  async assignEventAdmin(
    assignEventToThisUserId,
    idOfEventToBAssigned,
    userIdToWhomEventBelongs
  ) {
    let details = {
      assignEventToThisUserId,
      idOfEventToBAssigned,
      userIdToWhomEventBelongs,
    };
    const response = await this.httpClient
      .post(`${this.API_URL}/event/assignEventAdmin`, details)
      .toPromise();
    console.log('gotten response ', response['message']);
    if (response['message'] == 'Event assignment succesfull.') {
      alert(response['message']);
      window.location.reload();
    } else {
      alert(response['message']);
    }
  }

  async deleteEventAdmin(eventId: string, userId: string) {
    console.log('delete called in api');

    let details = { eventId, userId };
    const options = {
      body: details,
    };
    const response = await this.httpClient
      .delete(
        `${this.API_URL}/event/deleteEventAdmin?eventId=${eventId}&userId=${userId}`
      )
      .toPromise();
    // const response = await this.httpClient.delete(`${this.API_URL}/event/deleteEventAdmin`, options).toPromise()

    if (response['message'] == 'Event deleted.') {
      console.log(response);
      alert(response['message']);
      window.location.reload();
    } else {
      alert(response['message']);
    }
  }

  async getMeetingsOfParticularEventAdmin(userId, eventId) {
    const usersObj = await this.httpClient
      .get(`${this.API_URL}/allUsersRoute/`)
      .toPromise();

    const users = usersObj['users'];
    console.log('users', users);

    const user = (users as any[]).find((u) => u._id === userId);
    console.log('found user', user);

    const userEventsArray = user.events;
    console.log('userEventsArray ', userEventsArray);

    let thatEvent = (userEventsArray as any[]).find(
      (oneEvent) => oneEvent._id === eventId
    );

    console.log('thatEvent ', thatEvent);

    let meetingsOfThatEvent = thatEvent.meetings;

    console.log('meetingsOfThatEvent ', meetingsOfThatEvent);

    let finalMeetingsArray = [];
    for (let j = 0; j < meetingsOfThatEvent.length; j++) {
      let oneMeetObj = {
        Id: meetingsOfThatEvent[j]._id,
        name: meetingsOfThatEvent[j].user,
        emailId: meetingsOfThatEvent[j].userEmail,
        // evName: meetingsOfThatEvent[j].evName,
        // currentDate: meetingsOfThatEvent[j].currentDate,
        start: meetingsOfThatEvent[j].start,
        end: meetingsOfThatEvent[j].end,
      };
      // meetInOneEvent.push(oneMeetObj)
      // allMeetings.push(user.events[i])
      finalMeetingsArray.push(oneMeetObj);
    }

    console.log('finalMeetingsArray ', finalMeetingsArray);

    this.getMeetingsOfParticularEventAdminSubject.next(finalMeetingsArray);
  }

  async getSelectedUsersAvailaibilityObjAdmin(userId: string) {
    console.log('called for Av Obj');

    const usersObj = await this.httpClient
      .get(`${this.API_URL}/allUsersRoute/`)
      .toPromise();

    const users = usersObj['users'];
    console.log('users', users);

    const user = (users as any[]).find((u) => u._id === userId);
    this.selectedUserAvailabilityObjSubject.next(user['userAvailability']);
  }

  scheduleMeetByAdminPage(body) {
    console.log('scheduleMeetFromAdmin functn called and meet details', body);
    console.log('meet from apiservice ', body);

    return this.httpClient.post(
      `${this.API_URL}/calendarLink/postMeetFromAdminSide`,
      body
    );

  }

  async deleteMeetByAdmin(selectedMeetId, selectedEventId, selectedUserId) {
    console.log('delete Meet called in api');

    // let details = { selectedMeetId, selectedEventId, selectedUserId };
    // const options = {
    //   body: details,
    // };
    const response = await this.httpClient
      .delete(
        `${this.API_URL}/calendarLink/deleteMeetFromAdminSide?selectedEventId=${selectedEventId}&selectedUserId=${selectedUserId}&selectedMeetId=${selectedMeetId}`
      )
      .toPromise();
    // const response = await this.httpClient.delete(`${this.API_URL}/event/deleteEventAdmin`, options).toPromise()

    if (response['message'] == 'Meeting deleted.') {
      console.log(response);
      alert(response['message']);
      window.location.reload();
    } else {
      alert(response['message']);
    }
  }

  async editMeeting(
    selectedUserId,
    selectedEventId,
    selectedMeetingId,
    date,
    startTime,
    endTime,
    name,
    emailId
  ) {
    let deets = {
      selectedEventId,
      selectedMeetingId,
      date,
      startTime,
      endTime,
      name,
      emailId,
    };
    const response = await this.httpClient
      .patch(`${this.API_URL}/event/editMeet/${selectedUserId}`, deets)
      .toPromise();

    console.log('response ', response);
    alert(response['message']);
    if (response['message'] == 'Meeting edited.') {
      window.location.reload();
    }
  }

  async editMeetingfromUserSide(
    selectedUserEmailId,
    meetId,
    date,
    startTime,
    endTime,
    name,
    emailId
  ) {
    let deets = { meetId, date, startTime, endTime, name, emailId };
    const response = await this.httpClient
      .patch(
        `${this.API_URL}/event/editMeetFromUserSide/${selectedUserEmailId}`,
        deets
      )
      .toPromise();
    console.log('response ', response);
    alert(response['message']);
    if (response['message'] == 'Meeting edited.') {
      window.location.reload();
    }
  }

  // async uploadAvatar(formData) {
  //   console.log('uploadAvatar called in api.service ', formData);

  //   const response = await this.httpClient
  //     // .patch(
  //     //   `${this.API_URL}/user/uploadAvatar/${localStorage.getItem('emailID')}`,
  //     //   formData,
  //     // )
  //     .patch(
  //       `${this.API_URL}/user/uploadAvatar/${localStorage.getItem('emailID')}`,
  //       {formDataInfo: formData},
  //     )
  //     .toPromise();
  //     console.log('response ', response);
  //     alert(response['message']);
  //     // .subscribe(
  //     //   (response) => {
  //     //     // console.log('Image uploaded successfully');
  //     //     // Handle success
  //     //     console.log('message', response['message']);
  //     //     alert(response['message']);
  //     //   },
  //     //   (error) => {
  //     //     console.error('Error uploading image:', error);
  //     //     // Handle error
  //     //     console.log('error', error);
  //     //     alert(error);
  //     //   }
  //     // );

  //     console.log("response ", response);

  // }

  // uploadAvatar(image: any) {
  //   const formData = new FormData();
  //   formData.append("image", image);

  //   console.log('formData in apiService', formData);
  //   console.log('image ', image);
  //   console.log(formData.get('image'));

  //   return this.httpClient.post<any>(
  //     `${this.API_URL}/user/uploadAvatar/${localStorage.getItem('emailID')}`,
  //     // formData, { headers: { 'Content-Type': 'multipart/form-data' } }
  //     image
  //   );
  // }

  uploadAvatar(imageData: FormData): Observable<any> {
    return this.httpClient.patch<any>(
      `${this.API_URL}/user/uploadAvatar/${localStorage.getItem('emailID')}`,
      imageData
    );
  }

  async deleteAvatar(userEmail){
    let response =  await this.httpClient.patch<any>(
      `${this.API_URL}/user/deleteAvatar`,
      {userEmail}
    ).toPromise();
    console.log("response ", response);
    if(response['message'] == "Image deleted"){
      alert("Image deleted")
    }
  }

  async cloduraBrandingOnOff(userEmail, cloduraBrandingReq){
    let response =  await this.httpClient.patch<any>(
      `${this.API_URL}/user/cloduraBrandingOnOff`, {userEmail, cloduraBrandingReq}
    ).toPromise();
    console.log("response ", response);
    if(response['message'] == "cloduraBranding set"){
      alert("Changes Saved")
    }
  }

  async fetchImageURL() {
    console.log('fetchImageURL called');

    // let emailId = localStorage.getItem('emailID')
    //   this.httpClient.get(emailId, { responseType: 'blob' }).subscribe(

    //   (imageBlob: Blob) => {
    //     // Create a blob URL from the image blob
    //     console.log("imageBlob ", imageBlob);

    //     const objectURL = URL.createObjectURL(imageBlob);
    //     let toShowImg = objectURL; // Set the image URL to display
    //     console.log("show image ", toShowImg);
    //     // return toShowImg
    //   },
    //   (error) => {
    //     console.error('Error fetching image URL:', error);
    //     return error
    //   }
    // );

    // console.log(`${this.API_URL}/user/getImage/${localStorage.getItem('emailID')}`);
    //return this.httpClient.get(`${this.API_URL}/allUsersRoute/`, {

    try {
      const emailId = localStorage.getItem('emailID');
      const response = await this.httpClient
        .get(`${this.API_URL}/user/getImage/${emailId}`)
        .toPromise();
      console.log('Response:', response['message']);
      return response['message'];
    } catch (err) {
      console.error('Error fetching image URL:', err);
      return err;
    }
    // let url = `${this.API_URL}/user/getImage/${localStorage.getItem('emailID')}`
    // const response = await this.httpClient.get(url)
    // console.log("response message ", response['message']);
  }

  updateTimesForVoting(events: any[]) {
    this.timesForVotingSubject.next(events);
    console.log('times ', this.timesForVotingSubject.value);
    //[
    // { Id: 8711775288493731
    // end: "2024-05-25T06:30:00.000Z"
    // start: "2024-05-25T11:30:00+05:30"
    //},

    //{ Id: 8711775288493731
    // end: "2024-05-25T06:30:00.000Z"
    // start: "2024-05-25T11:30:00+05:30"}
    //]
    if (this.timesForVotingSubject.value.length == 0) {
      alert('Please pick 1 or more times to continue.');
    } else {
      this.router.navigate(['votingEventDetails']);
    }
  }

  async updatePollDetails(meetingName, reserveTimes, votesCheckBox) {
    console.log('updatePollDetails called ');

    let deets = {
      evName: meetingName,
      reserveTimes: reserveTimes,
      showVotes: votesCheckBox,
      link: '',
      location: 'Google Meet',
      details: this.timesForVotingSubject.value,
    };
    console.log('deets ', deets);

    const response = await this.httpClient
      .patch<any>(
        `${this.API_URL}/user/updatePoll/${localStorage.getItem('emailID')}`,
        deets
      )
      .toPromise();
    console.log('response ', response);
    if (response['message'] == 'User data updated successfully') {
      this.votingLinkSubject.next(response['link']);
      console.log('link in apiservice ', this.votingLinkSubject.value);

      this.router.navigate(['/pollLinkPopUp']);
    } else {
      alert(response['message']);
    }
    // if (response['message'] == 'Meeting edited.') {
    //   window.location.reload();
    // }
  }

  async getVotingArrOfloggedInUser() {
    const response = await this.httpClient
      .get(`${this.API_URL}/user/getVotingEvents`)
      .toPromise();

    const responseMsg = response['msg'];

    if (responseMsg == 'voting arr not found') {
      this.votingArrSubject.next([]);
    } else {
      this.votingArrSubject.next(responseMsg);
    }
  }

  meetingByPollConfirmed(meetingId: string, detailObjId: string) {
    console.log('meetingByPollConfirmed functn called and meet details ids', meetingId, detailObjId);
    let body = { meetingId, detailObjId };
    return this.httpClient.post(`${this.API_URL}/user/votingMeetConfirmed`, body).toPromise();
  }

  // async addQuestionToMeeting(question, isRequired, showThisQuestion, loggedInEmailId, eventId){    
  //   console.log('id value after login ', loggedInEmailId);
  //   let body = {question, isRequired, showThisQuestion, eventId}    


  //   const response = await this.httpClient.patch(`${this.API_URL}/event/addQuestionToMeet/${loggedInEmailId}`, body).toPromise();
  //   alert(response['message'])
  // }

  async editUserFormForEventFnctn(evId, eventLink, surnameReq, allowInviteesToAddGuests, questionsToBeAsked, loggedInEmailId, redirectTo) {
    let body = { evId, eventLink, surnameReq, allowInviteesToAddGuests, questionsToBeAsked, redirectTo }

    console.log("editUserFormForEventFnctn called ",evId, eventLink, surnameReq, allowInviteesToAddGuests, questionsToBeAsked, redirectTo);
    
    console.log("loggedInEmailId ", loggedInEmailId);
    
    const response = await this.httpClient.patch(`${this.API_URL}/event/addQuestionForForm/${loggedInEmailId}`, body).toPromise();
    alert(response['message'])
    return response['message']
  }

  async editEventCalendar(evId, whenCanInviteesSchedule, minimumNotice, noOfMeetsAllowedPerDay, startTimIncrements, loggedInEmailId) {
    let body = { evId, whenCanInviteesSchedule, minimumNotice, noOfMeetsAllowedPerDay, startTimIncrements }


    const response = await this.httpClient.patch(`${this.API_URL}/event/editEvCalendar/${loggedInEmailId}`, body).toPromise();
    alert(response['message'])
    return response['message']
  }


  async getSelectedEvent(evId, loggedInEmailId) {
    console.log("getSelectedEvent called in api ", evId, loggedInEmailId);

    let reqEvent = {}
    let response = await this.httpClient
      .get(`${this.API_URL}/event/getParticularEvent/${loggedInEmailId}/${evId}`)
      .toPromise();
    console.log("sending response ", response);

    if (response['message'] == "Found") {
      reqEvent = response['reqEvent']
      console.log("reqEvent ", reqEvent);
      this.reqEventSubject.next(reqEvent)
    }
    else {
      console.log(response['message']);

    }
  }

  async changeEvntClrs(loggedInEmailId, evId, backGroundcolor, textColor, btnAndLinkColor){
    return this.httpClient
    .patch(
      `${this.API_URL}/event/editEventClrs`,
      { loggedInEmailId, evId, backGroundcolor, textColor, btnAndLinkColor },
    )
    .subscribe(
      (response) => {
        console.log(response);
        alert(response['message']);
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
