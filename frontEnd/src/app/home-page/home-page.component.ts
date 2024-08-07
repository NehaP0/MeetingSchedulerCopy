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
  token = localStorage.getItem('token')  
  loggedInName = localStorage.getItem('userLoggedInName' || '');
  loggedInEmailId = localStorage.getItem('emailID' || '');
  usersId = localStorage.getItem('usersUniqueID' || '')
  firstChar = this.loggedInName[0];
  eventsArrayOfLoggedInUser = [];
  eventLink = ""
  evId = ""
  eventLinksArr = []

  logOutValue = false;
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

  searchQuery: string = '';
  tempStorage = []
  filteredArr = []
  tryingToFilter = false

  // ------------------------------

  // items = [
  //   { name: 'Apple', category: 'Fruit' },
  //   { name: 'Banana', category: 'Fruit' },
  //   { name: 'Carrot', category: 'Vegetable' },
  //   { name: 'Date', category: 'Fruit' },
  //   { name: 'Eggplant', category: 'Vegetable' },
  // ];

  // -------------------------------

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: APIService,
    private http: HttpClient
  ) { }

  ngOnInit() {

    if(!this.token){
      this.router.navigate(['/login']);
    }

    // this.filteredItems = this.items


    console.log('calling getEvents ');


    this.apiService.getEvents();
    this.getEventLinksArr()

    this.getImage();

    setTimeout(() => {
      this.apiService.eventsArray$.subscribe((eventsArray) => {
        console.log('events in ts ', eventsArray);
        this.eventsArrayOfLoggedInUser = eventsArray;
        // ===========================================
        this.tempStorage = this.eventsArrayOfLoggedInUser
        // ===========================================

        // if (this.eventsArrayOfLoggedInUser.length == 0) {
        //   this.router.navigate(['login']);
        // }

      });
    }, 2000);


  }

  async getEventLinksArr() {
    console.log("getEventLinksArr called");
    this.eventLinksArr = await this.apiService.getParticularUserEventLiksArr(this.loggedInEmailId)
    localStorage.setItem("eventLinksArr", JSON.stringify(this.eventLinksArr))
    console.log("eventLinksArr ", this.eventLinksArr);
  }

  EvLink(selectedEvId) {

    for (let i = 0; i < this.eventLinksArr.length; i++) {
      if (this.eventLinksArr[i]["evId"] == selectedEvId) {
        console.log("found ", this.eventLinksArr[i]["evId"], selectedEvId);
        console.log(this.eventLinksArr[i]["linkEnd"]);

        this.eventLink = this.eventLinksArr[i]["linkEnd"]
        localStorage.setItem('eventLinkEnd', this.eventLink)
        break;
      }
    }
    console.log("eventLinkEnd ", this.eventLink);
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



  settingsCalled(id) {
    console.log('settingsCalled ', id);
    this.showSetting = !this.showSetting;
    this.showSettingFor = id;
  }

  editEvent(id: string) {

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
        this.evId = id
        localStorage.setItem('evId', id);
        localStorage.setItem('allowInviteesToAddGuests', this.eventsArrayOfLoggedInUser[i].allowInviteesToAddGuests)
        localStorage.setItem('sendFollowupEmail' , JSON.stringify(this.eventsArrayOfLoggedInUser[i].sendFollowupEmail))
        localStorage.setItem('surnameReq', this.eventsArrayOfLoggedInUser[i].surnameReq)
        localStorage.setItem('questionsToBeAsked', JSON.stringify(this.eventsArrayOfLoggedInUser[i].questionsToBeAsked))
        localStorage.setItem('whenCanInviteesSchedule', JSON.stringify(this.eventsArrayOfLoggedInUser[i].whenCanInviteesSchedule))
        localStorage.setItem('minimumNotice', JSON.stringify(this.eventsArrayOfLoggedInUser[i].minimumNotice))
        localStorage.setItem('noOfMeetsAllowedPerDay', JSON.stringify(this.eventsArrayOfLoggedInUser[i].noOfMeetsAllowedPerDay))
        localStorage.setItem('startTimIncrements', JSON.stringify(this.eventsArrayOfLoggedInUser[i].startTimIncrements))
        localStorage.setItem('passEvDeets', this.eventsArrayOfLoggedInUser[i].pasEvntDeetsToRedirectPg)
        localStorage.setItem('timeFormat', this.eventsArrayOfLoggedInUser[i].timeFormat)
      }
    }
    this.EvLink(this.evId)

    setTimeout(() => {
      window.open('editEvent', '_self');
    }, 1500)

  }

  showBookingPage(selectedEvId) {
    console.log("I am called");

    this.EvLink(selectedEvId)

    console.log("eventLinkEnd ", this.eventLink);
    // this.router.navigate()

    // window.location.href = `http://localhost:3000/calendarLink/sharable?userId=${this.usersId}&eventN=${this.eventLink}`;
    window.open(`http://localhost:3000/calendarLink/sharable?userId=${this.usersId}&eventN=${this.eventLink}`, '_blank');
    // href="http://localhost:3000/calendarLink/sharable?userId={{usersId}}&eventId={{event._id}}"

  }

  //   navigator.clipboard.writeText(copyText.value);
  copied(evName, selectedEvId) {
    // ngxClipboard [cbContent]="'http://localhost:3000/calendarLink/sharable?userId=' +usersId +'&eventId=' +event._id"
    console.log('clicked');
    this.EvLink(selectedEvId)

    console.log(`http://localhost:3000/calendarLink/sharable?userId=${this.usersId}&eventN=${this.eventLink}`);

    navigator.clipboard.writeText(`http://localhost:3000/calendarLink/sharable?userId=${this.usersId}&eventN=${this.eventLink}`);
    this.setCopied = evName;

    setTimeout(() => {
      this.setCopied = '';
      console.log('copied 2 ', this.setCopied);
    }, 2000);
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


  // document.getElementById('searchBox').addEventListener('input', function() {
  //   const query = this.value.toLowerCase();
  //   const filteredItems = items.filter(item => item.name.toLowerCase().includes(query));
  //   displayResults(filteredItems);
  // });

  // function displayResults(results) {
  //   const resultsDiv = document.getElementById('results');
  //   resultsDiv.innerHTML = '';
  //   results.forEach(item => {
  //     const div = document.createElement('div');
  //     div.textContent = `${item.name} (${item.category})`;
  //     resultsDiv.appendChild(div);
  //   });
  // }

  filterItems() {
    this.tryingToFilter = true
    const query = this.searchQuery.toLowerCase();
    this.filteredArr = this.tempStorage.filter((item) => {
      return item.evName.toLowerCase().includes(query) || item.evType.toLowerCase().includes(query) || item.evDuration["minutes"].toString().includes(query) || item.evDuration["hrs"].toString().includes(query)
    });
  }


}


