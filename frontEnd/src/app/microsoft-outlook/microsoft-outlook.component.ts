// import { Component, OnInit } from '@angular/core';
// import { AuthService } from '../auth.service';
// // import { CalendarService } from '../calendar.service';


// @Component({
//   selector: 'app-microsoft-outlook',
//   templateUrl: './microsoft-outlook.component.html',
//   styleUrl: './microsoft-outlook.component.css'
// })
// export class MicrosoftOutlookComponent implements OnInit  {

//   calendarEvents: any[];
       
//   constructor(private authService: AuthService, private calendarService: CalendarService) { }

//   ngOnInit(): void {
//     this.authService.getAccessToken().subscribe(accessToken => {
//       // const userEmail = 'neha.phadtare@Clodura.ai'; // Replace with the user's email
//       // const userEmail = 'neha.phadtare@Clodura.ai'; // Replace with the user's email
//       const userEmail = 'neha.phadtare@Clodura.ai'; // Replace with the user's email


//       this.calendarService.getCalendarEvents(accessToken,userEmail).subscribe(events => {
//         this.calendarEvents = events.value;
//         console.log("this.calendarEvents ", this.calendarEvents);        
//       }, error => {
//         console.error('Error fetching calendar events:', error);
//       });
//     });
//   }
  

// }
