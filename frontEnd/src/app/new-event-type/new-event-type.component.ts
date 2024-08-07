import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../api.service';

@Component({
  selector: 'app-new-event-type',
  templateUrl: './new-event-type.component.html',
  styleUrl: './new-event-type.component.css'
})
export class NewEventTypeComponent {

  loggedInName = localStorage.getItem("userLoggedInName" || "")
  firstChar = this.loggedInName[0]
  token = localStorage.getItem('token')

  constructor(private route: ActivatedRoute, private router: Router, private apiService: APIService) { }


  ngOnInit() {

    if (!this.token) {
      this.router.navigate(['/login']);
    }
  }

  // newEventType
  goToEventPage(eventType: string) {
    console.log("calling updateEventType");
    localStorage.setItem("evType", eventType)
    this.apiService.updateEventType(eventType)
    this.router.navigate(['/newEventType'])
  }
}
