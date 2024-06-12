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
  showPopup = false
  deleteUserName = ""
  deleteUserId = ""
  popUpForUserEdit = false
  editUserId = ""
  editUserName = ""
  editUserEmail = ""

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


  searchQuery: string = '';
  tempStorage = []
  filteredArr = []
  tryingToFilter = false


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
    // this.getMeetingsOfLoggedInUser()
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
        // if(this.users[i].emailID !== this.loggedInEmailId){
          usersWOloggedInUserArray.push(this.users[i])
        // }
      }
      this.usersWOloggedInUser = usersWOloggedInUserArray
      this.tempStorage = this.usersWOloggedInUser

    })
  }

  // getMeetingsOfLoggedInUser(){
  //   // let getMeetings = async ()=>{
  //   //   console.log("called");      
  //     this.apiService.getMeetingOfLoggedInUser()
  //     this.subscription = this.apiService.formattedMeetingsOfLoggedInUser$.subscribe((formattedMeetingsOfLoggedInUser) => {
  //       console.log('Formatted Meetings of loggedIn:', formattedMeetingsOfLoggedInUser);
  //       this.formattedMeetingsOfLoggedInUser = formattedMeetingsOfLoggedInUser;
  //       this.Events = formattedMeetingsOfLoggedInUser;
  //     console.log("Events ",this.Events); 
  //     });
    
  //   // }
  //   // getMeetings()
    
  //   // console.log("consoling ",this.apiService.getMeetingOfLoggedInUser())
  // }

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



deleteUser(id, userName){
  console.log("delete user called in ts file");
  this.showPopup = true
  this.deleteUserId = id
  this.deleteUserName =  userName
}


deleteUserCacelation(){
  this.showPopup = false
}

deleteUserConfirmation(){
  this.showPopup = false
  this.apiService.deleteUser(this.deleteUserId)
}


editUser(id, userName, email){
  console.log("in edit user ", id, userName, email);
  
  this.popUpForUserEdit = true
  this.editUserName = userName
  this.editUserEmail = email
  this.editUserId = id

  // console.log(this.editUserName,this.editUserEmail,this.editUserId);
  
}
editUserCacelation(){
  this.popUpForUserEdit = false
}

editUserConfirmation(){
  this.popUpForUserEdit = false
  this.apiService.editUser(this.editUserId, this.editUserName, this.editUserEmail)
}

newUserBtn(){
    this.router.navigate(['/newUserAdditionAdmin'])
}

editUserFull(editUserName, editUserEmail){
  localStorage.setItem('selectedUserName',editUserName)
  localStorage.setItem('selectedUserEmail',editUserEmail)
  localStorage.setItem('selectedUserId',  this.editUserId)

  this.router.navigate(['/entireUserAdmin'])
}

filterItems() {
  this.tryingToFilter = true
  const query = this.searchQuery.toLowerCase();  
  console.log("query",query);

  
  this.filteredArr = this.tempStorage.filter((item) => {
      console.log("item ", item);
      console.log(item.name.toLowerCase(), query, item.name.toLowerCase().includes(query));
      console.log(item.emailID.toLowerCase(), query , item.emailID.toLowerCase().includes(query));

           
      return item.name.toLowerCase().includes(query) || item.emailID.toLowerCase().includes(query) || item._id.toLowerCase().includes(query)
    });
  }

}
