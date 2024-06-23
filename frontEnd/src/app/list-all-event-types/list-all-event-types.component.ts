import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../api.service';

@Component({
  selector: 'app-list-all-event-types',
  templateUrl: './list-all-event-types.component.html',
  styleUrl: './list-all-event-types.component.css',
})
export class ListAllEventTypesComponent {
  loggedInName = localStorage.getItem('userLoggedInName' || '');
  loggedInEmailId = localStorage.getItem('emailID' || '');

  eventsArrayOfLoggedInUser = [];

  usersId = localStorage.getItem('usersUniqueID' || '')


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: APIService
  ) {}

  ngOnInit() {
    console.log('calling getEvents ');

    this.apiService.getEvents();

    setTimeout(() => {
      this.apiService.eventsArray$.subscribe((eventsArray) => {
        console.log('events in ts ', eventsArray);
        this.eventsArrayOfLoggedInUser = eventsArray;
      });
    }, 1000);
  }

  goToCalendar(event) {
    console.log('event ', event);
    localStorage.setItem('evName', event.evName);
    localStorage.setItem('evType', event.evType);
    

    // localStorage.setItem("evType",event.evName)
    // localStorage.setItem("evDurHrs",event.evDuration.hrs)
    // localStorage.setItem("evDurMins",event.evDuration.minutes)

    let avatar = localStorage.getItem('avatar')
    window.open(
      // `http://localhost:3000/calendarLink/sharable?name=${this.loggedInName}&id=${this.loggedInEmailId}&evType=${event.evType}&evName=${event.evName}&evDurHrs=${event.evDuration.hrs}&evDurMins=${event.evDuration.minutes}&image=${avatar}`
      `http://localhost:3000/calendarLink/sharable?userId=${this.usersId}&eventId=${event._id}`

    );
  }
}
