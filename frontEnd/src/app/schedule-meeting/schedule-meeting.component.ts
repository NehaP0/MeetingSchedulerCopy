import { Component, NgZone, OnInit} from '@angular/core';
import { APIService } from '../api.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

// declare const gapi: any


@Component({
  selector: 'app-schedule-meeting',
  templateUrl: './schedule-meeting.component.html',
  styleUrl: './schedule-meeting.component.css'
})
export class ScheduleMeetingComponent implements OnInit{

  userName: string = '';
  dateValue: string = '';
  timeValue: string = '';
  emailId : string = ''
  private subscription: Subscription;

  constructor(private apiService: APIService){
    this.apiService.userName$;

    this.subscription = this.apiService.userName$.subscribe((userName) => {
      this.userName = userName;
      console.log(userName)
    });
    this.subscription = this.apiService.emailId$.subscribe((emailId) => {
      this.emailId = emailId;
      console.log(emailId)
    });
  }

  ngOnInit(){}

  scheduleMeet(meetingForm : NgForm){
    console.log("function called",this.dateValue, this.timeValue);

    if(meetingForm.valid && this.dateValue!="" && this.timeValue!=""){
      const meeting = {
        eventName: meetingForm.value.eventName,
        eventDecription: meetingForm.value.eventDecription,
        eventDate: this.dateValue,
        eventTime: this.timeValue,
        user: this.userName,
        userEmail : this.emailId
      }

      this.apiService.scheduleMeet(meeting).subscribe((response)=>{
        console.log("form",response);        
        alert(response['message'])
        // meetingForm.resetForm()
      },
      (error)=>{
        console.log(error);        
      })       
    }
    else{
      alert('Please fill all the details')
    }    
  }
 
}