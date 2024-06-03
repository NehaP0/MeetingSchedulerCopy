import { Component, OnInit } from '@angular/core';
import { APIService } from '../api.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-polling-page',
  templateUrl: './polling-page.component.html',
  styleUrls: ['./polling-page.component.css']
})
export class PollingPageComponent implements OnInit {

  meetings = [];
  selectedMeetingIndex: number | null = null;
  selectedDetailIndex: number | null = null;

  constructor(private apiService: APIService, private route: ActivatedRoute, private router: Router) { }
  private subscription: Subscription;

  ngOnInit() {
    this.apiService.getVotingArrOfloggedInUser();

    this.subscription = this.apiService.votingArr$.subscribe((votingArr) => {
      console.log('Voting Meetings in ts :', votingArr);
      this.meetings = votingArr;
      console.log("this.meetings ", this.meetings);
    });
  }

  toggleDetails(index: number): void {
    if (this.selectedMeetingIndex === index) {
      this.selectedMeetingIndex = null;
    } else {
      this.selectedMeetingIndex = index;
    }
    this.selectedDetailIndex = null;  // Reset detail selection when changing meetings
  }

  isLater(dateString: string): boolean {
    const givenDate = new Date(dateString);
    const currentDate = new Date();

    return givenDate > currentDate;
  }

  bookSlot(meetingIndex: number, detailIndex: number): void {
    if (this.selectedMeetingIndex === meetingIndex && this.selectedDetailIndex === detailIndex) {
      this.selectedDetailIndex = null;
    } else {
      this.selectedMeetingIndex = meetingIndex;
      this.selectedDetailIndex = detailIndex;
    }
  }

  confirmBookSlot(meetingId: string, detailObjId: string): void {
    console.log("confirmBookSlot called in ts meetingId, detailObjId ", meetingId, detailObjId);
    this.apiService.meetingByPollConfirmed(meetingId, detailObjId)
  }

}
