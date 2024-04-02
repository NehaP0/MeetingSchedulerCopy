import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../api.service';
import { Subscription, combineLatest, take } from 'rxjs';

@Component({
  selector: 'app-hori-nav-meetings-admin',
  templateUrl: './hori-nav-meetings-admin.component.html',
  styleUrl: './hori-nav-meetings-admin.component.css'
})
export class HoriNavMeetingsAdminComponent {


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
  editEventLocation: string = "zoom"

  popUpForNewMeet: boolean = false
  newMeetName: string = ""
  newEventType: string = ""
  newEventHrs: number = 0
  newEventMins: number = 0
  newEventLocation: string = "zoom"

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
    this.popUpForNewMeet = true

  }
  newMeetCacelation() {
    this.popUpForNewMeet = false
  }

  newEventConfirmation() {
    console.log("create event called");

    console.log(this.selectedUserId, this.newMeetName, this.newEventHrs, this.newEventMins, this.newEventLocation, this.newEventType);
    this.popUpForNewMeet = false

    this.apiService.createNewEventAdmin(this.selectedUserId, this.newMeetName, this.newEventHrs, this.newEventMins, this.newEventLocation, this.newEventType)
  }



}
