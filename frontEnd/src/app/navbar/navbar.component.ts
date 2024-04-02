import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../api.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {


  loggedInName = localStorage.getItem("userLoggedInName" || "")
  loggedInEmailId = localStorage.getItem("emailID" || "")
  firstChar = this.loggedInName[0]
  eventsArrayOfLoggedInUser = []
  logOutValue = false
  filterTerm : string = '';
  showSetting: boolean = false
  showSettingFor : string = ""
  showPopup : boolean = false
  deleteEventId : string = ""
  deleteEventName : string = ""
  setCopied : string = ""


  constructor(private route:ActivatedRoute,private router:Router,private apiService: APIService){}


ngOnInit(){
    console.log("calling getEvents ");
    
    this.apiService.getEvents()

    
    setTimeout(() => {
     this.apiService.eventsArray$.subscribe((eventsArray) => {
      console.log("events in ts ",eventsArray)
      this.eventsArrayOfLoggedInUser = eventsArray
     })

    }, 2500);
  }
  

  // openModal() {
  //   alert("opened")
  //   // Code to open the Bootstrap modal (You might want to use a Bootstrap JavaScript method or a library)
  // }

  // closeModal() {
  //   alert("closed")
  //   // Code to close the Bootstrap modal
  // }

goToCreateNewEventPage(){
  this.router.navigate(['/createNewEventType'])
}

logoutCalled(){
    console.log(this.logOutValue);
    this.logOutValue = !this.logOutValue
}

logOut(){
    localStorage.clear()
    this.router.navigate(['/login'])
}

copied(evName){
  console.log("clicked");
  
  this.setCopied = evName
  
  setTimeout(()=>{
      this.setCopied = ""
      console.log("copied 2 ",this.setCopied);
  }, 2000)
}

settingsCalled(id){
  console.log("settingsCalled ", id);  
  this.showSetting = !this.showSetting
  this.showSettingFor = id
}

editEvent(id: string){
  this.showSetting = false

}

deleteEventPopup(id, evName){
  this.showSetting = false
  this.showPopup = true
  // this.deleteEventConfirmation(id)
  this.deleteEventId = id
  this.deleteEventName = evName
}

deleteEventConfirmation(){
    this.showPopup = false
    this.deleteEventName = ""
    this.deleteEvent(this.deleteEventId)
}

deleteEventCacelation(){
  this.deleteEventId = ""
  this.deleteEventName = ""
  this.showPopup = false
}

deleteEvent(id : string){
  console.log("delete called id to be deleted ",id);   
  this.apiService.deleteEvent(id)
  // setTimeout(() => {
  //   this.apiService.eventsArray$.subscribe((eventsArray) => {
  //    console.log("events in ts ",eventsArray)
  //    this.eventsArrayOfLoggedInUser = eventsArray
  //   })

  //  }, 1000);
}

}
