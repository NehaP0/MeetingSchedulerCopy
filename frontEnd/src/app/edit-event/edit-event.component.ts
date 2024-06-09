import { Component } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { APIService } from '../api.service';
import { FormsModule, NgForm } from '@angular/forms';


@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrl: './edit-event.component.css'
})
export class EditEventComponent {

  loggedInName = localStorage.getItem("userLoggedInName" || "")
  evT = localStorage.getItem("evType")
  eventN = localStorage.getItem("eventName")
  evDurMins = Number(localStorage.getItem("evDurMins"))
  evDurHrs = Number(localStorage.getItem("evDurHrs"))
  eventLocation = localStorage.getItem("eventLocation")
  evId = localStorage.getItem("evId")

  showWarning = false
  showTimeWarning = false

  loggedInEmailId = localStorage.getItem("emailID" || "")

  constructor(private route:ActivatedRoute,private router:Router, private apiService: APIService){}

  continueFunctn(){
    console.log("continueFunctn called ",this.eventN,this.evDurHrs, this.evDurMins);
    
    if(!this.eventN){
      this.showWarning = true
      console.log("Event Name not given");      
    }
    if(this.evDurHrs==0 && this.evDurMins==0){
      this.showTimeWarning = true      
    }
    else{
      this.showWarning = false
      this.showTimeWarning = false

      // console.log("eventN ", eventN);
      // console.log("hrs ",evDurHrs);
      // console.log("min ", min);    
      
      // if(!this.evDurHrs){
      //  this.evDurHrs = 0
      // }
      // if(!this.evDurMins && !this.evDurHrs){
      //   this.evDurMins = 30
      // }
      let location = "Google Meet"

      console.log("in else statement ", this.eventN,this.evDurHrs, this.evDurMins);
      // evName, evType, evDuration, evLocation
      
      

      this.apiService.editEvent(this.evId, this.eventN, this.evDurHrs, this.evDurMins, location, this.evT)      
    
    }    
  }

  callOnChange(){
    console.log("change");
  }

}
