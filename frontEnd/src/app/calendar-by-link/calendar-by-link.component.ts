import { Component , OnInit, ChangeDetectorRef } from '@angular/core';
import { View, EventSettingsModel, ActionEventArgs } from '@syncfusion/ej2-angular-schedule';
import { APIService } from '../api.service';
import { Subscription, combineLatest, take } from 'rxjs';

@Component({
  selector: 'app-calendar-by-link',
  template:   `
    <ejs-schedule #scheduleObj height="850" width="1250" [currentView]="setView" [selectedDate]='selectedDate' [eventSettings]='eventObject' (actionComplete)="onActionComplete($event)"></ejs-schedule>
  `,
  styleUrl: './calendar-by-link.component.css'
})
export class CalendarByLinkComponent {

  userName: string = '';
  emailId : string = '';
  // meetingArray : any[] = [];
  formattedMeetings : object[] = []

  // trialArray : Array<any> = []
  // dataSource = this.formattedMeetings
  

  // -------------------------------
 
  constructor(private apiService: APIService){
    this.subscription = this.apiService.userName$.subscribe((userName) => {
      this.userName = userName;
      console.log(userName)
    });
    this.subscription = this.apiService.emailId$.subscribe((emailId) => {
      this.emailId = emailId;
      console.log(emailId)
    });
}

  private subscription: Subscription;

 


ngOnInit(){

    console.log('Calendar Component initialized');
    // Fetch meetings when component initializes
    this.apiService.getMeetings();
    
    
    this.subscription = this.apiService.formattedMeetings$.subscribe((formattedMeetings) => {
      console.log('Formatted Meetings:', formattedMeetings);
    this.formattedMeetings = formattedMeetings;
    this.eventObject.dataSource = formattedMeetings;
    console.log("dataSource", this.eventObject.dataSource);

   

  });



}


  title = 'frontEnd';

  public setView: View = 'Month';
  public selectedDate: Date = new Date(2023, 12, 10);
  public eventObject: EventSettingsModel = {
    dataSource: []
};


 // Access the details of the created or changed event after the user interacts with the editor
 public onActionComplete(args: ActionEventArgs): void {
  console.log('Action Complete:', args);
  
   // Check if args.data is defined before accessing its properties
   if (args.data) {
    const eventDetails = Array.isArray(args.data) ? args.data[0] : args.data;
    console.log('Event Details:', eventDetails);
    // console.log(this.eventObject.dataSource);
    
    // Combine latest values from userName$ and emailId$
    
    combineLatest([this.apiService.userName$, this.apiService.emailId$])
    .pipe(take(1))
    .subscribe(
      ([userName, emailId]) => {
        
        console.log('User Name:', userName)
        console.log('Email ID:', emailId);
        

        if (userName && emailId) {

              const meeting = {
                Subject: eventDetails.Subject,
                StartTime: new Date(eventDetails.StartTime),
                EndTime: new Date(eventDetails.EndTime),
                user: userName,
                userEmail : emailId
              }


              this.apiService.scheduleMeet(meeting).subscribe((response)=>{
                console.log("meeting deets",response);        
                if (response && response['message']) {
                  alert(response['message']);
                } else {
                  console.error('Invalid response:', response);
                  // Handle the error or show an appropriate message
                }
                // meetingForm.resetForm()
              },
              (error)=>{
                console.log('Meeting Error:', error);       
              },
            () => {
              // After the scheduleMeet API completes, fetch the latest meetings
              console.log("calling again 126");
              this.apiService.getMeetings();
            }

              );
            }

            else{
              console.log("userName and emailId", userName , emailId);
              
            }

          }
        );
      }
    }

}
