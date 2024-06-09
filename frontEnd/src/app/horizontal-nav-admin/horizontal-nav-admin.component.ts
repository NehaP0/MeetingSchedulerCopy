import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../api.service';
import { Subscription, combineLatest, take } from 'rxjs';

@Component({
  selector: 'app-horizontal-nav-admin',
  templateUrl: './horizontal-nav-admin.component.html',
  styleUrl: './horizontal-nav-admin.component.css'
})
export class HorizontalNavAdminComponent {

  constructor(private route: ActivatedRoute, private router: Router, private apiService: APIService) {}

  private subscription: Subscription;

  eventsArrayOfSelectedUser = []
  selectedUserName = localStorage.getItem("selectedUserName" || "")
  selectedUserEmail = localStorage.getItem("selectedUserEmail" || "")
  selectedUserId = localStorage.getItem("selectedUserId" || "")

  firstChar = this.selectedUserName[0]
  logOutValue = false
  filterTerm: string = '';
  showSetting: boolean = false
  showSettingFor: string = ""
  showPopup: boolean = false
  deleteEventId: string = ""
  deleteEventName: string = ""
  setCopied: string = ""

  popUpForEventEdit: boolean = false
  editEventId: string = ""
  editEventName: string = ""
  editEventType: string = ""
  editEventHrs: number = 0
  editEventMins: number = 0
  editEventLocation: string = "Google Meet"

  popUpForNewEvent: boolean = false
  newEventName: string = ""
  newEventType: string = ""
  newEventHrs: number = 0
  newEventMins: number = 0
  newEventLocation: string = "Google Meet"

  showpopUpForEventAssignment = false
  public usersWOloggedInUser: Array<any> = []
  public users: Array<any> = []
  idOfEventToBAssigned = ""
  nameOfEventToBeAssigned = ""
  assignEventToUserId = ""
  assignEventToUserName = ""
  showPopUpForEentAssignmentConfirmation = false

  tableView = true
  calendarView: boolean = false

  formattedMeetingsHide: object[] = [];
  MeetingsWOColor: any[] = [];
  Meetings: any[] = [];
  Events: any[] = [];


  newEventPopup() {
    this.popUpForNewEvent = true

  }
  newEventCacelation() {
    this.popUpForNewEvent = false
  }

  newEventConfirmation() {
    console.log("create event called");

    console.log(this.selectedUserId, this.newEventName, this.newEventHrs, this.newEventMins, this.newEventLocation, this.newEventType);
    this.popUpForNewEvent = false

    this.apiService.createNewEventAdmin(this.selectedUserId, this.newEventName, this.newEventHrs, this.newEventMins, this.newEventLocation, this.newEventType)
  }



}
