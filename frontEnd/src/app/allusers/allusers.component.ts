import { Component, OnInit  } from '@angular/core';
import {APIService} from '../api.service'
import { ActivatedRoute, Router} from '@angular/router';
import { Subscription, combineLatest, take } from 'rxjs';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-allusers',
  templateUrl: './allusers.component.html',
  styleUrl: './allusers.component.css'
})
export class AllusersComponent implements OnInit{
  userName: string = ''
  public users : Array<any> = []
  public usersWOloggedInUser : Array<any> = []
  loggedInEmailId = localStorage.getItem("emailID" || "")
  // loggedInEmailId: string = '';
  // loggedInName: string = '';
  loggedInName = localStorage.getItem("userLoggedInName" || "")

  showLink : boolean = false;
  link : string = ''
  public formattedMeetingsOfLoggedInUser : object[] = []
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


  constructor(private apiService : APIService, private route:ActivatedRoute,private router:Router){
    // this.subscription = this.apiService.userLoggedInEmailId$.subscribe((userLoggedInEmailId) => {
    //   this.loggedInEmailId = userLoggedInEmailId;
    //   console.log("logged in user email is ",this.loggedInEmailId)
    // });
    // this.subscription = this.apiService.userLoggedInName$.subscribe((userLoggedInName) => {
    //   this.loggedInName = userLoggedInName;
    //   console.log("logged in user name is ",this.loggedInName)
    // });
  }

  private subscription: Subscription;

  ngOnInit(){
    this.getMeetingsOfLoggedInUser()
    this.getallusersExceptLoogedIn()  
    
    
setTimeout(() => {
  this.calendarOptions = {
    initialView: 'dayGridMonth',
    events: this.Events,
  };
}, 2500);
}





  public getallusersExceptLoogedIn(){
    const token = localStorage.getItem("token")
    // console.log(token)
    this.apiService.getallusers().subscribe((data: Array<any>) =>{
      // this.apiService.setAuthorizationHeader(token)
      this.users = data['users']
      console.log(this.users)

      let usersWOloggedInUserArray = []
      for(let i=0; i<this.users.length; i++){
        if(this.users[i].emailID !== this.loggedInEmailId){
          usersWOloggedInUserArray.push(this.users[i])
        }
      }
      this.usersWOloggedInUser = usersWOloggedInUserArray
    })
  }

  getMeetingsOfLoggedInUser(){
    // let getMeetings = async ()=>{
    //   console.log("called");      
      this.apiService.getMeetingOfLoggedInUser()
      this.subscription = this.apiService.formattedMeetingsOfLoggedInUser$.subscribe((formattedMeetingsOfLoggedInUser) => {
        console.log('Formatted Meetings of loggedIn:', formattedMeetingsOfLoggedInUser);
        this.formattedMeetingsOfLoggedInUser = formattedMeetingsOfLoggedInUser;
        this.Events = formattedMeetingsOfLoggedInUser;
      console.log("Events ",this.Events); 
      });
    
    // }
    // getMeetings()
    
    // console.log("consoling ",this.apiService.getMeetingOfLoggedInUser())
  }

  goToCalendarPage(name, emailID){
    console.log(name, emailID);  
    // console.log("I am called");      
    this.apiService.setUserName(name);
    this.apiService.setUserEmailId(emailID);
    this.router.navigate(['/calendar'])
  }

  changeShowLink(){
    console.log("called");  
    this.link = `http://localhost:3000/calendarLink?name=${this.loggedInName}&id=${this.loggedInEmailId}`  
    this.showLink = !this.showLink
  }

  // copyLink(link){
  //   console.log("link ",link);    
  //   link.select();
  //   document.execCommand('copy');
  //   link.setSelectionRange(0, 0);
  // }
 

  // goToCalendarLinkPage(name, emailID){
  //   console.log("clicked, clicked");  
  //   // console.log("I am called");      
  //   this.apiService.setUserName(name);
  //   this.apiService.setUserEmailId(emailID);
  //   this.router.navigate(['/calendarbylink'])
  // }

  // setUserName(name) {
  //   console.log(name);  
  //   console.log("I am called");      
  //   this.apiService.setUserName(name);
  // }
}
