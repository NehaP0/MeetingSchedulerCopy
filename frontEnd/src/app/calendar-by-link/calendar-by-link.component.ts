import { Component , OnInit, ChangeDetectorRef } from '@angular/core';
import { View, EventSettingsModel, ActionEventArgs, PopupOpenEventArgs, ScheduleComponent} from '@syncfusion/ej2-angular-schedule';
import { APIService } from '../api.service';
import { Subscription, combineLatest, take } from 'rxjs';
import { ActivatedRoute, Router} from '@angular/router';


@Component({
  selector: 'app-calendar-by-link',
  template:   `
  <ng-container *ngIf="formattedMeetingsHide.length > 0">
    <ejs-schedule #scheduleObj height="700" width="700" [currentView]="setView" [selectedDate]='selectedDate' [eventSettings]='eventObject' (popupOpen)='onPopupOpen($event)' (actionComplete)="onActionComplete($event)"></ejs-schedule>
    </ng-container>
  `,
  // templateUrl: './calendar-by-link.component.html',
  styleUrl: './calendar-by-link.component.css'  
})
export class CalendarByLinkComponent {

  userName: string = '';
  emailId : string = '';
  // meetingArray : any[] = [];
  formattedMeetingsHide : object[] = []
  public scheduleObj: ScheduleComponent;

  // trialArray : Array<any> = []
  // dataSource = this.formattedMeetings
  

  // -------------------------------
 
  constructor(private apiService: APIService, private route:ActivatedRoute,private router:Router){
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


  // -----taking name and email id from query paramaters----
  this.route.queryParams.subscribe(params => {

    console.log('Calendar by link Component initialized');

    const name = params['name'];
    const id = params['id'];

    
    console.log('Name:', name);
    console.log('ID:', id);


    // Fetch meetings when component initializes
    this.apiService.getMeetingsHide(name, id);
    
    
    this.subscription = this.apiService.formattedMeetingsHide$.subscribe((formattedMeetingsHide) => {
      console.log('Formatted Meetings Hide:', formattedMeetingsHide);
    this.formattedMeetingsHide = formattedMeetingsHide;
    this.eventObject.dataSource = formattedMeetingsHide;
    console.log("dataSource", this.eventObject.dataSource);
  });

  });

  // ---------


  



}


onPopupOpen(args: PopupOpenEventArgs): void {
  console.log("called");
  
  if (args.type === 'Editor') {
      console.log(args.data)
      console.log("called again");

      // {StartTime: Thu Jan 18 2024 00:00:00 GMT+0530 (India Standard Time), EndTime: Fri Jan 19 2024 00:00:00 GMT+0530 (India Standard Time), IsAllDay: true, Timezone: false}
      // args.data['IsAllDay'] = false

      console.log("this.scheduleObj.eventWindow", this.scheduleObj.eventWindow);
      

      (this.scheduleObj.eventWindow as any).recurrenceEditor.frequencies = [
        "daily"
      ];
      // (document.querySelector(
      //   ".e-repeat-interval"
      // ) as any).ej2_instances[0].max = 1;
      // let end = (document.querySelector(".e-end-on-element") as any)
      //   .ej2_instances[0];
      // end.query = new Query().where("value", "equal", "never");
      // end.setProperties(
      //   { query: new Query().where("value", "equal", "never") },
      //   true
      // );
      // end.dataBind();
  }
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
  // console.log(aria-selected)
  
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

        // console.log(Aria-selected);
        
        

        if (userName && emailId) {

              const meeting = {
                Subject: eventDetails.Subject,
                StartTime: new Date(eventDetails.StartTime),
                EndTime: new Date(eventDetails.EndTime),
                user: userName,
                userEmail : emailId
              }


              this.apiService.scheduleMeetByCalendarLink(meeting).subscribe((response)=>{
                console.log("meeting deets",response);        
                if (response && response['message']) {
                  alert(response['message']);
                  if(response['message'] == "Please login first."){
                    this.router.navigate(['/login'])  

                  }
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
              // After the scheduleMeetByCalendarLink API completes, fetch the latest meetings
              console.log("calling again 126");


              // this.apiService.getMeetingsHide();
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
