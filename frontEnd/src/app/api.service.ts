import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, take, Observable } from 'rxjs';
import { ActivatedRoute, Router} from '@angular/router';


@Injectable({
  providedIn: 'root'
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
  private formattedMeetingsOfLoggedInUserSubject = new BehaviorSubject<any[]>([]);
  private userLoggedInSubject = new BehaviorSubject<boolean>(false);
  private userLoggedInEmailIdSubject = new BehaviorSubject<string>('');
  private userLoggedInNameSubject = new BehaviorSubject<string>('');
  // private userAvailableOnWeekendsSubject = new BehaviorSubject<boolean>(true);
  private userUnavailabelOnArraySubject = new BehaviorSubject<number[]>([0,6]);
  private userAvailabelOnArraySubject = new BehaviorSubject<number[]>([1,2,3,4,5]);
  private durationSubject = new BehaviorSubject<object>({"hrs":0, "minutes":30});
  private workingHrsSubject = new BehaviorSubject<object>({1:{start: '09:00:00', end: '17:00:00'}, 2:{start: '09:00:00', end: '17:00:00'}, 3:{start: '09:00:00', end: '17:00:00'}, 4:{start: '09:00:00', end: '17:00:00'}, 5:{start: '09:00:00', end: '17:00:00'}});
  private selectedUserAvailabilityObjSubject = new BehaviorSubject<object>({});
  private eventsArraySubject = new BehaviorSubject<object[]>([]);
  private eventTypeSubject = new BehaviorSubject<string>(''); 
  private getMeetingsforUserToSeeSubject = new BehaviorSubject<any[]>([]);

  public userName$ = this.userNameSubject.asObservable();
  public emailId$ = this.emailIdSubject.asObservable();
  public eventDate$ = this.eventDateSubject.asObservable();
  public eventTime$ = this.eventTimeSubject.asObservable();
  public meetingArray$ = this.meetingArraySubject.asObservable();
  public users$ = this.usersSubject.asObservable();
  public formattedMeetings$ = this.formattedMeetingsSubject.asObservable();
  public formattedMeetingsHide$ = this.formattedMeetingsHideSubject.asObservable();
  public userLoggedIn$ = this.userLoggedInSubject.asObservable();
  public userLoggedInEmailId$ = this.userLoggedInEmailIdSubject.asObservable();
  public formattedMeetingsOfLoggedInUser$ = this.formattedMeetingsOfLoggedInUserSubject.asObservable();
  public userLoggedInName$ = this.userLoggedInNameSubject.asObservable();
  // public userAvailableOnWeekends$ = this.userAvailableOnWeekendsSubject.asObservable();
  public userUnavailabelOnArray$ = this.userUnavailabelOnArraySubject.asObservable()
  public userAvailabelOnArray$ = this.userAvailabelOnArraySubject.asObservable()
  public duration$ = this.durationSubject.asObservable()
  public workingHrs$ = this.workingHrsSubject.asObservable()
  public selectedUserAvailabilityObj$ = this.selectedUserAvailabilityObjSubject.asObservable()
  public eventsArray$ = this.eventsArraySubject.asObservable()
  public eventType$ = this.eventTypeSubject.asObservable()
  public getMeetingsforUserToSee$ = this.getMeetingsforUserToSeeSubject.asObservable()
  

  API_URL = 'http://localhost:3000'
  
  private headers : HttpHeaders = new HttpHeaders()
  
  constructor(private httpClient: HttpClient, private router:Router) { }

 

  getallusers(){
    return this.httpClient.get(`${this.API_URL}/allUsersRoute/`)
  }

  registerUser(user){
    // console.log(user);  
    user["userAvailability"] = {"duration" :"", "workingHrs":"", "workingDays": "", "nonWorkingDays": ""}  
    
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
    
    console.log("user ",user);   
    
    return this.httpClient.post(`${this.API_URL}/user/postuser`, user)
  }

  async findLoggedInName(email){
    const usersObj = await this.httpClient.get(`${this.API_URL}/allUsersRoute/`).toPromise();
  
    const users =  usersObj["users"]
    console.log("users", users); 
    
    
    const user = (users as any[]).find((u) => u.emailID === email);
    const name = user.name
    localStorage.setItem("userLoggedInName", name)
    this.userLoggedInNameSubject.next(name)
    
  }

  loginUser(user){
    console.log("user ",user);
    this.userLoggedInSubject.next(true);
    this.userLoggedInEmailIdSubject.next(user.emailID);
    // this.userLoggedInNameSubject.next(user.name); 
    console.log("id value after login ",this.userLoggedInEmailIdSubject);
      

    this.findLoggedInName(user.emailID)

    console.log("userLoggedIn api service ts", this.userLoggedIn$);    
    return this.httpClient.post(`${this.API_URL}/user/login`, user)    
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


  logoutUser(){ 
    this.userLoggedInSubject.next(false);  
  }

  // isAuth(){ 
  //   return this.userLoggedInSubject
  // }


  //to set Authorization header
  setAuthorizationHeader(token : string){
    this.headers = new HttpHeaders().set('Authorization', token)
  }

  scheduleMeet(meet){
    console.log("scheduleMeet functn called and meet details", meet);    
    // console.log(meet);    
    return this.httpClient.post(`${this.API_URL}/meeting/createMeeting`, meet)     
  }

  scheduleMeetByCalendarLink(meet){
    console.log("scheduleMeetByCalendarLink functn called and meet details", meet);    
    // console.log(meet);    
    return this.httpClient.post(`${this.API_URL}/calendarLink/`, meet)     
  }

  scheduleMeetBymakeMeetingPage(meet){
    console.log("scheduleMeetByCalendarLink functn called and meet details", meet);    
    console.log("meet from apiservice ",meet); 
    // return meet   
    return this.httpClient.post(`${this.API_URL}/calendarLink/postMeetFromMeetPage`, meet)     
  }

  setUserName(userName: string) {
    console.log("username set by link ",userName);
    this.userNameSubject.next(userName);    
  }

  setUserEmailId(emailId: string) {
    console.log("id set by link ",emailId);
    this.emailIdSubject.next(emailId);
  }
  




  // -------------------------------------------------------------------------------------

  async getMeetings() {
    const usersObj = await this.httpClient.get(`${this.API_URL}/allUsersRoute/`).toPromise();

    const users =  usersObj["users"]
    console.log("users", users);       
    
    const userName = this.userNameSubject.getValue();
    console.log("userName", userName);
    
    
    const user = (users as any[]).find((u) => u.name === userName);

    if (user && user.meetings) {
      const formattedMeetings = user.meetings.map(meeting => ({
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



      const usersObj = await this.httpClient.get(`${this.API_URL}/allUsersRoute/`).toPromise();
  
      const users =  usersObj["users"]
      console.log("users", users);      
      
      const userId = id

      console.log("userId ", userId);
      
      
      
      const user = (users as any[]).find((u) => u.emailID === userId);
      console.log("found user", user);
      
      const userEventsArray = user.events

      console.log("userEventsArray ", userEventsArray);
      
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

        console.log("user events ", user.events);
        
        let meetings = []
        for(let i=0; i<user.events.length; i++){
          console.log("event ",user.events[i],"particular event meetings ", user.events[i].meetings);
          let meetingsArr = user.events[i].meetings
          // const formattedMeetingsHide = user.events[i].meetings.map(meeting => ({
          //   Id: meeting._id,
          //   // title: "Unavailable",
          //   // title: "",
          //   start: meeting.start,
          //   end: meeting.end,
          // }));

          for(let j=0; j<meetingsArr.length; j++){
            let oneMeetObj = {
              Id: meetingsArr[j]._id,
              // title: "Unavailable",
              // title: "",
              start: meetingsArr[j].start,
              end: meetingsArr[j].end,
            }
            meetings.push(oneMeetObj)
          }

          
          // meetings = [...meetings, formattedMeetingsHide]
          
        }
        for(let i=0; i<user.meetingsWtOthers.length; i++){
          let oneMeetObj = {
            Id: user.meetingsWtOthers[i]._id,
            // title: "Unavailable",
            // title: "",
            start: user.meetingsWtOthers[i].start,
            end: user.meetingsWtOthers[i].end,
          }
          meetings.push(oneMeetObj)
        }
        
        console.log("meetings ", meetings)

        this.formattedMeetingsHideSubject.next(meetings);
      

}



async getMeetingsforUserToSee(id) {

  const usersObj = await this.httpClient.get(`${this.API_URL}/allUsersRoute/`).toPromise();

  const users =  usersObj["users"]
  console.log("users", users);      
  
  const userId = id

  console.log("userId ", userId);
  
  
  
  const user = (users as any[]).find((u) => u.emailID === userId);
  console.log("found user", user);
  
  const userEventsArray = user.events

  console.log("userEventsArray ", userEventsArray);


    console.log("user events ", user.events);
    
    let allMeetings = []
    for(let i=0; i<user.events.length; i++){
      console.log("event ",user.events[i],"particular event meetings ", user.events[i].meetings);
      let meetingsArr = user.events[i].meetings

      // let meetInOneEvent = []
      for(let j=0; j<meetingsArr.length; j++){
        let oneMeetObj = {
          Id: meetingsArr[j]._id,
          name: meetingsArr[j].user, 
          emailId: meetingsArr[j].userEmail,
          evName: meetingsArr[j].evName,
          evType : user.events[i].evType,
          currentDate: meetingsArr[j].currentDate,
          start: meetingsArr[j].start,
          end: meetingsArr[j].end,
        }
        // meetInOneEvent.push(oneMeetObj)
        // allMeetings.push(user.events[i])
        allMeetings.push(oneMeetObj)
      }      
      // meetings = [...meetings, formattedMeetingsHide]      
    }
    for(let i=0; i<user.meetingsWtOthers.length; i++){
      let oneMeetObj = {
        Id: user.meetingsWtOthers[i]._id,
        name:  user.meetingsWtOthers[i].user,
        emailId: user.meetingsWtOthers[i].userEmail,
        evName : user.meetingsWtOthers[i].evName,
        evType: user.meetingsWtOthers[i].evType,
        currentDate : user.meetingsWtOthers[i].currentDate,
        // title: "Unavailable",
        // title: "",
        start: user.meetingsWtOthers[i].start,
        end: user.meetingsWtOthers[i].end,
      }
      allMeetings.push(oneMeetObj)
    }
    
    console.log("allMeetings ", allMeetings)

    this.getMeetingsforUserToSeeSubject.next(allMeetings);
  
  
}


    

async getMeetingOfLoggedInUser() {
      const usersObj = await this.httpClient.get(`${this.API_URL}/allUsersRoute/`).toPromise();
  
      const users =  usersObj["users"]
      console.log("users", users);       
      
      // const userEmail = this.userLoggedInEmailIdSubject.getValue();
      const userEmail = localStorage.getItem("emailID" || "")
      console.log("Email of loggedIn user", userEmail);
      
      
      const user = (users as any[]).find((u) => u.emailID === userEmail);

      this.userLoggedInNameSubject.next(user.name);
      localStorage.setItem("userLoggedInName", this.userLoggedInNameSubject.getValue())
  
      if (user && user.meetings) {
        const formattedMeetings = user.meetings.map(meeting => ({
          Id: meeting._id,
          title: meeting.title,
          start: meeting.start,
          end: meeting.end,
        }));
        
  
        this.formattedMeetingsOfLoggedInUserSubject.next(formattedMeetings);
        console.log("this.formattedMeetingsOfLoggedInUser$ ", this.formattedMeetingsOfLoggedInUser$);        
        // console.log( this.formattedMeetingsSubject);        
      }    
}


// ----------------------------------------------------------------------------------

userUnavOn(dayNumberArray){
      // this.userUnavailabelOnArraySubject = dayNumberArray
      this.userUnavailabelOnArraySubject.next(dayNumberArray);
      console.log("unavailable ", this.userUnavailabelOnArraySubject);             
}

userAvOnDay(dayNumberArray){
    // this.userAvailabelOnArraySubject = dayNumberArray
    // console.log("Available ", this.userAvailabelOnArraySubject);

    this.userAvailabelOnArraySubject.next(dayNumberArray);
    console.log("Available ", dayNumberArray);

    // this.userAvailabelOnArray$.subscribe((userAvailabelOnArrayValue) => {
    //     console.log("available value ", userAvailabelOnArrayValue);
    // });
}



userAvOnTime(durationObj){
    // if(durationObj.hrs==""){
    //   durationObj.hrs = 0
    // }
    this.duration$ = durationObj
    console.log("duration ", this.duration$); 
}

userWorkingHrs(wrkngHrsObj){
    this.workingHrs$ = wrkngHrsObj
    console.log("workingHrs ", this.workingHrs$);
    this.patchUserAvailability()
}

patchUserAvailability(){
    console.log("pathUserAvailability called");
    
    //     this.userLoggedInEmailIdSubject.next(user.emailID);
    let emailID = localStorage.getItem('emailID')
    // let userAvailability = {};
    let userAvailability = {duration :{}, workingHrs:{}, workingDays: [], nonWorkingDays: []}  

    
    // this.userLoggedInEmailId$.subscribe((userLoggedInEmailIdValue) => {
    //   emailID = userLoggedInEmailIdValue;
    // });
    // console.log("log in id ",this.userLoggedInEmailId$);

    console.log(this.duration$, this.workingHrs$);
    
    userAvailability.duration = this.duration$;
    userAvailability.workingHrs = this.workingHrs$




    this.userAvailabelOnArray$.subscribe((userAvailabelOnArrayValue) => {
      console.log("available value ", userAvailabelOnArrayValue);
      
      userAvailability.workingDays = userAvailabelOnArrayValue;
      console.log("available on ",userAvailabelOnArrayValue);
    });

    this.userUnavailabelOnArray$.subscribe((userUnavailabelOnArrayValue) => {
      userAvailability.nonWorkingDays = userUnavailabelOnArrayValue;
      console.log("unavailable on ",userUnavailabelOnArrayValue);

    }); 

    console.log(userAvailability);    

    return this.httpClient.patch(`${this.API_URL}/user/patchuser`, {emailID,userAvailability})
      .subscribe(
      (response) => {
        console.log(response);
        alert(response["message"])
      },
      (error) => {
        console.error(error);
      }
    );

}

async getSelectedUsersAvailaibilityObj(){
    console.log("called for Av Obj");
    
    const usersObj = await this.httpClient.get(`${this.API_URL}/allUsersRoute/`).toPromise();
  
    const users =  usersObj["users"]
    console.log("users", users);  
    
    let emailIDofSelectedUser = ""
    
    this.emailId$.subscribe((emailIdValue) => {
      emailIDofSelectedUser = emailIdValue;
    });
    
    console.log("email ",emailIDofSelectedUser); 

    for(let i=0; i<users.length; i++){
      if(users[i]["emailID"] == emailIDofSelectedUser){
        // this.selectedUserAvailabilityObj$ = users[i]["userAvailability"]
        this.selectedUserAvailabilityObjSubject.next(users[i]["userAvailability"]);
        // console.log(this.selectedUserAvailabilityObj$);        
        break;
      }
    }
  
}



async getEvents(){
  console.log("get events called");
  
  const response = await this.httpClient.get(`${this.API_URL}/event/getEvents`).toPromise();
  console.log("events ",response["message"]);
  const events = response["message"]
  this.eventsArraySubject.next(events)
}

updateEventType(evType){//tells the type of event, like one-on-one
  console.log("called updateEventType");
  console.log("evType ",evType);  
  this.eventTypeSubject.next(evType)
  this.eventType$.subscribe((eventTypeValue)=>{
    console.log( "eventTypeValue in updateEventType is ",  eventTypeValue);    
  })
}

async createNewEvent(eventName:string,hrs:string,min:string, location:string){
  // let {evName, evType, evDuration, evLocation} = req.body
  
  let loggedInName = localStorage.getItem("userLoggedInName" || "")
  let loggedInEmailId = localStorage.getItem("emailID" || "")

  let evType = localStorage.getItem("evType")
  // this.eventType$.subscribe((eventTypeValue)=>{
  //   evType = eventTypeValue
  // })
  // evType = this.eventType$
  
  
  console.log("createNewEvtn called", eventName,hrs,min, location, evType);
  
  let event = {evName:eventName, evType:evType, evDuration:{"hrs": hrs,"minutes":min}, evLocation: location }
  // let event = {evName:"eventName", evType:"evType", evDuration:{"hrs": 0,"minutes":0}, evLocation: "location" }

  console.log(event);


  const response = await this.httpClient.post(`${this.API_URL}/event/createEvent`, event).toPromise();      
  console.log("gotten response ",response["message"]);
  if(response["message"]=="Event created"){
    localStorage.setItem("eventName", eventName)
    localStorage.setItem("evDurHrs", hrs)
    localStorage.setItem("evDurMins", min)
    localStorage.setItem("eventLocation", location)
    // console.log(loggedInName, loggedInEmailId);
    
    // console.log(`http://localhost:3000/calendarLink?name=${loggedInName}&id=${loggedInEmailId}`);
    
    window.open(`http://localhost:3000/calendarLink?name=${loggedInName}&id=${loggedInEmailId}`)

  }
  else{
    alert(response["message"])
  }

}


deleteEvent(id : string){
  console.log("delete called in api");
  
  return this.httpClient.delete(`${this.API_URL}/event/deleteEvent?id=${id}`)
  .subscribe(
  (response) => {
    console.log(response);
    alert(response["message"])
    window.location.reload()

  },
  (error) => {
    console.error(error);
  }
);

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
}

