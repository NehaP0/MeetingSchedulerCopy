import { Component } from '@angular/core';
import { APIService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, combineLatest, take } from 'rxjs';

@Component({
  selector: 'app-upcoming-meetings',
  templateUrl: './upcoming-meetings.component.html',
  styleUrl: './upcoming-meetings.component.css'
})
export class UpcomingMeetingsComponent {

  userMeetings: object[] = []
  emailId = localStorage.getItem("emailID")
  upcomingMeets: object[] = []
  futureMeets: object[] = []


  constructor(private route: ActivatedRoute, private router: Router, private apiService: APIService) { }


  private subscription: Subscription;


  ngOnInit() {
    //for calendar view 
    this.getMeetings()

    setTimeout(()=>{
      this.sortFutureMeets()
    }, 1000)
    
  }

  getMeetings() {
    this.apiService.getMeetingsforUserToSee(this.emailId);
    // this.apiService.getSelectedUsersAvailaibilityObj()

    this.subscription = this.apiService.getMeetingsforUserToSee$.subscribe((getMeetingsforUserToSee) => {
      console.log('Meetings in ts :', getMeetingsforUserToSee);
      this.userMeetings = getMeetingsforUserToSee;
      console.log("Meetings ", this.userMeetings);
    });
  }

  sortFutureMeets() {
    let today = new Date()
    console.log("logging");
    // Parse the date string to a Date object
    const date = new Date(today);

    // Format the date to the desired format
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Combine into the desired format
    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

    console.log(formattedDate);

    // console.log("2019-01-18T09:00:00">today.toDateString());
    // console.log("2019-01-18T09:00:00"<today.toDateString());
    // console.log("checking ", "2024-07-12T09:00:00"<today.toDateString());
    

    console.log("this.userMeetings ", this.userMeetings);

    for (let i = 0; i < this.userMeetings.length; i++) {
      // console.log("start ", this.userMeetings[i]['start']);
      // console.log("today ", formattedDate);
      
      // console.log(this.userMeetings[i]['start'] >= formattedDate);      
      
      if (this.userMeetings[i]['start'] >= formattedDate) {
        console.log("found");
        console.log(this.userMeetings[i]['start']);   
        this.futureMeets.push(this.userMeetings[i])           
      }
    }

    console.log("futureMeets array ", this.futureMeets);
    
  }

}
