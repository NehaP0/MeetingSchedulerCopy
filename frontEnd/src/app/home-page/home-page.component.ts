import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../api.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  loggedInName = localStorage.getItem('userLoggedInName' || '');
  loggedInEmailId = localStorage.getItem('emailID' || '');
  usersId = localStorage.getItem('usersUniqueID' || '')
  firstChar = this.loggedInName[0];
  eventsArrayOfLoggedInUser = [];
  logOutValue = false;
  filterTerm: string = '';
  showSetting: boolean = false;
  showSettingFor: string = '';
  showPopup: boolean = false;
  deleteEventId: string = '';
  deleteEventName: string = '';
  setCopied: string = '';
  
  imageAfterGetting: string = '';
  
  // ------------------------------
  paypalIntegrated: boolean = false;
  // ------------------------------
  
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: APIService,
    private http: HttpClient
  ) {}
  
  ngOnInit() {
  
    console.log('calling getEvents ');

    this.apiService.getEvents();

    this.getImage();

    setTimeout(() => {
      this.apiService.eventsArray$.subscribe((eventsArray) => {
        console.log('events in ts ', eventsArray);
        this.eventsArrayOfLoggedInUser = eventsArray;

        if(this.eventsArrayOfLoggedInUser.length==0){
          this.router.navigate(['login']);
    
        }

      });
    }, 2500);
  }

  async getImage() {
    let response = await this.apiService.fetchImageURL();
    this.imageAfterGetting = response;
    console.log('imageAfterGetting ', this.imageAfterGetting);
    localStorage.setItem('avatar', this.imageAfterGetting);
  }

  // openModal() {
  //   alert("opened")
  //   // Code to open the Bootstrap modal (You might want to use a Bootstrap JavaScript method or a library)
  // }

  // closeModal() {
  //   alert("closed")
  //   // Code to close the Bootstrap modal
  // }

  goToCreateNewEventPage() {
    this.router.navigate(['/createNewEventType']);
  }

  logoutCalled() {
    console.log(this.logOutValue);
    this.logOutValue = !this.logOutValue;
  }

  logOut() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  copied(evName) {
    console.log('clicked');

    this.setCopied = evName;

    setTimeout(() => {
      this.setCopied = '';
      console.log('copied 2 ', this.setCopied);
    }, 2000);
  }

  settingsCalled(id) {
    console.log('settingsCalled ', id);
    this.showSetting = !this.showSetting;
    this.showSettingFor = id;
  }

  editEvent(id: string) {
    window.open('editEvent', '_self');

    for (let i = 0; i < this.eventsArrayOfLoggedInUser.length; i++) {
      // event._id
      if (this.eventsArrayOfLoggedInUser[i]._id == id) {
        console.log('event ', this.eventsArrayOfLoggedInUser[i]);
        //       evDuration
        // :
        // {hrs: 0, minutes: 30}
        // evLocation
        // :
        // "zoom"
        // evName
        // :
        // "30 Minute Meeting"
        // evType
        // :
        // "One-on-One"

        localStorage.setItem(
          'evType',
          this.eventsArrayOfLoggedInUser[i].evType
        );
        localStorage.setItem(
          'eventName',
          this.eventsArrayOfLoggedInUser[i].evName
        );
        localStorage.setItem(
          'evDurMins',
          this.eventsArrayOfLoggedInUser[i].evDuration.minutes
        );
        localStorage.setItem(
          'evDurHrs',
          this.eventsArrayOfLoggedInUser[i].evDuration.hrs
        );
        localStorage.setItem(
          'eventLocation',
          this.eventsArrayOfLoggedInUser[i].evLocation
        );
        localStorage.setItem(
          'evName',
          this.eventsArrayOfLoggedInUser[i].evName
        );
        localStorage.setItem('evId', id);
      }
    }
  }

  deleteEventPopup(id, evName) {
    console.log(id, evName);

    this.showSetting = false;
    this.showPopup = true;
    // this.deleteEventConfirmation(id)
    this.deleteEventId = id;
    this.deleteEventName = evName;
  }

  deleteEventConfirmation() {
    this.showPopup = false;
    this.deleteEventName = '';
    this.deleteEvent(this.deleteEventId);
  }

  deleteEventCacelation() {
    this.deleteEventId = '';
    this.deleteEventName = '';
    this.showPopup = false;
  }

  deleteEvent(id: string) {
    console.log('delete called id to be deleted ', id);
    this.apiService.deleteEvent(id);
    // setTimeout(() => {
    //   this.apiService.eventsArray$.subscribe((eventsArray) => {
    //    console.log("events in ts ",eventsArray)
    //    this.eventsArrayOfLoggedInUser = eventsArray
    //   })

    //  }, 1000);
  }

// ----------------------------------------------

// integratePayPal() {
//   // Call backend API to integrate PayPal account
//   this.http.post<any>('http://localhost:3000/paypal/integrate', {}).subscribe((response) => {
//     console.log("integrate paypal called ");

//     // Set flag to indicate PayPal integration
//     this.paypalIntegrated = true;
//     console.log("response ",response);    
//     alert(response['message'])
//   }, (error) => {
//     console.error(error);
//   });
// }

// makePayment() {
//   const paymentData = {
//     // Add payment details if needed
//   };

//   this.http.post<any>('http://localhost:3000/paypal/payment', paymentData).subscribe((response) => {
//     console.log("make payment called ");
    
//     window.location.href = response.approvalUrl;
//     console.log("response ",response);   

//     alert(response['message'])
//   }, (error) => {
//     console.error(error);
//   });
// }



}
