import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


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
  private userLoggedInSubject = new BehaviorSubject<boolean>(false);
 

  public userName$ = this.userNameSubject.asObservable();
  public emailId$ = this.emailIdSubject.asObservable();
  public eventDate$ = this.eventDateSubject.asObservable();
  public eventTime$ = this.eventTimeSubject.asObservable();
  public meetingArray$ = this.meetingArraySubject.asObservable();
  public users$ = this.usersSubject.asObservable();
  public formattedMeetings$ = this.formattedMeetingsSubject.asObservable();
  public formattedMeetingsHide$ = this.formattedMeetingsHideSubject.asObservable();
  public userLoggedIn$ = this.userLoggedInSubject.asObservable();





  API_URL = 'http://localhost:3000'
  
  private headers : HttpHeaders = new HttpHeaders()
  
  constructor(private httpClient: HttpClient) { }

 

  getallusers(){
    return this.httpClient.get(`${this.API_URL}/allUsersRoute/`)
  }

  registerUser(user){
    console.log(user);    
    return this.httpClient.post(`${this.API_URL}/user/postuser`, user)
  }

  loginUser(user){
    console.log(user);
    this.userLoggedInSubject.next(true);
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
    this.userNameSubject.next(userName);
  }

  setUserEmailId(emailId: string) {
    this.emailIdSubject.next(emailId);
  }

  setUserMeetings() {
    return this.httpClient.get(`${this.API_URL}/allUsersRoute/`)
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


   // --------------------------------------------------------
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
          Subject: "Unavailable",
          StartTime: new Date(meeting.StartTime),
          EndTime: new Date(meeting.EndTime),
        }));
  
        this.formattedMeetingsHideSubject.next(formattedMeetingsHide);
      }    
    }
}