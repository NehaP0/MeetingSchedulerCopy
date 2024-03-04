import { Component } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { APIService } from '../api.service';


@Component({
  selector: 'app-create-new-event-type',
  templateUrl: './create-new-event-type.component.html',
  styleUrl: './create-new-event-type.component.css'
})
export class CreateNewEventTypeComponent {
  loggedInName = localStorage.getItem("userLoggedInName" || "")
  showWarning = false
  inputText = ''
  hours = 0
  minutes = 30

  loggedInEmailId = localStorage.getItem("emailID" || "")

  constructor(private route:ActivatedRoute,private router:Router, private apiService: APIService){}

  continueFunctn(eventName,hrs, min){
    console.log("continueFunctn called ",eventName,hrs, min);
    
    if(!eventName){
      this.showWarning = true
      console.log("eventName not given");
      
    }
    else{
      this.showWarning = false

      // console.log("eventName ", eventName);
      // console.log("hrs ", hrs);
      // console.log("min ", min);    
      
      if(!hrs){
        hrs = 0
      }
      if(!min && !hrs){
        min = 30
      }
      let location = "zoom"

      console.log("in else statement ", eventName, hrs, min);
      // evName, evType, evDuration, evLocation
      
      localStorage.setItem("evName",eventName)
      localStorage.setItem("evDurHrs",hrs)
      localStorage.setItem("evDurMins",min)

      this.apiService.createNewEvent(eventName, hrs, min, location)      
    
    }    
  }

  callOnChange(){
    console.log("change");
  }


}
