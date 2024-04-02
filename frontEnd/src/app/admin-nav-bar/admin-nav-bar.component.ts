import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../api.service';


@Component({
  selector: 'app-admin-nav-bar',
  templateUrl: './admin-nav-bar.component.html',
  styleUrl: './admin-nav-bar.component.css'
})
export class AdminNavBarComponent {

  // loggedInName = localStorage.getItem("userLoggedInName" || "")
  // loggedInEmailId = localStorage.getItem("emailID" || "")
  // firstChar = this.loggedInName[0]
  // eventsArrayOfLoggedInUser = []
  // logOutValue = false
  // filterTerm : string = '';
  // showSetting: boolean = false
  // showSettingFor : string = ""
  // showPopup : boolean = false
  // deleteEventId : string = ""
  // deleteEventName : string = ""
  // setCopied : string = ""


  constructor(private route:ActivatedRoute,private router:Router,private apiService: APIService){}


ngOnInit(){
    console.log("calling getEvents ");
    
    // this.apiService.getEvents()

    
    // setTimeout(() => {
    //  this.apiService.eventsArray$.subscribe((eventsArray) => {
    //   console.log("events in ts ",eventsArray)
    //   this.eventsArrayOfLoggedInUser = eventsArray
    //  })

    // }, 2500);
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




}
