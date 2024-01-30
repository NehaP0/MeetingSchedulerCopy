import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, take } from 'rxjs';


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





  API_URL = 'http://localhost:3000'
  
  private headers : HttpHeaders = new HttpHeaders()
  
  constructor(private httpClient: HttpClient) { }

 

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

  loginUser(user){
    console.log("user ",user);
    this.userLoggedInSubject.next(true);
    this.userLoggedInEmailIdSubject.next(user.emailID);
    // this.userLoggedInNameSubject.next(user.name);

    console.log("userLoggedIn api service ts", this.userLoggedIn$);    
    return this.httpClient.post(`${this.API_URL}/user/login`, user)    
  }


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
  async getMeetingsHide(name, id) {
       
      // const response = await this.httpClient.get(`${this.API_URL}/calendarLink/`).toPromise();
  
      //  console.log("response bro",response);

       
      const usersObj = await this.httpClient.get(`${this.API_URL}/allUsersRoute/`).toPromise();
  
      const users =  usersObj["users"]
      console.log("users", users);      
      
      const userName = name
      
      
      const user = (users as any[]).find((u) => u.name === userName);
  
      if (user && user.meetings) {
        const formattedMeetingsHide = user.meetings.map(meeting => ({
          Id: meeting._id,
          title: "Unavailable",
          // title: meeting.title,
          start: meeting.start,
          end: meeting.end,
        }));
  
        this.formattedMeetingsHideSubject.next(formattedMeetingsHide);
      }    
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
    let emailID = ""
    // let userAvailability = {};
    let userAvailability = {duration :{}, workingHrs:{}, workingDays: [], nonWorkingDays: []}  

    this.userLoggedInEmailId$.subscribe((userLoggedInEmailIdValue) => {
      emailID = userLoggedInEmailIdValue;
    });

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

