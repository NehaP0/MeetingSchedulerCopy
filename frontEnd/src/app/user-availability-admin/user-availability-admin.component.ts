import { Component, ElementRef, ViewChild } from '@angular/core';
import { APIService } from '../api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-availability-admin',
  templateUrl: './user-availability-admin.component.html',
  styleUrl: './user-availability-admin.component.css'
})
export class UserAvailabilityAdminComponent {

  userUnAvailabilityArray = []
  userAvailabilityArray = []
  durationHrs = 0
  durationMins = 30
  selectedUserName = localStorage.getItem("selectedUserName" || "")
  selectedUserEmail = localStorage.getItem("selectedUserEmail" || "")
  selectedUserId = localStorage.getItem("selectedUserId" || "")
  firstChar = this.selectedUserName[0]
  duration: { hrs: number, minutes: number } = {
    "hrs": 0,
    "minutes": 30
  }
  workingHrs = {}


  constructor(private apiService: APIService) {
    // this.subscription = this.apiService.userLoggedInEmailId$.subscribe((userLoggedInEmailId) => {
    //   this.selectedUserEmail = userLoggedInEmailId;
    //   console.log("logged in user email is ",this.selectedUserEmail)
    // });
    // this.subscription = this.apiService.userLoggedInName$.subscribe((userLoggedInName) => {
    //   this.selectedUserName = userLoggedInName;
    //   console.log("logged in user name is ",this.selectedUserName)
    // });
  }

  private subscription: Subscription;

  ngOnInit(){
    this.apiService.initiallyUserUnavailbeOn(this.selectedUserId)
  }



  @ViewChild('SUN') SUN: ElementRef
  @ViewChild('MON') MON: ElementRef
  @ViewChild('TUE') TUE: ElementRef
  @ViewChild('WED') WED: ElementRef
  @ViewChild('THU') THU: ElementRef
  @ViewChild('FRI') FRI: ElementRef
  @ViewChild('SAT') SAT: ElementRef

  @ViewChild('sunStartTime') sunStartTime: ElementRef
  @ViewChild('monStartTime') monStartTime: ElementRef
  @ViewChild('tueStartTime') tueStartTime: ElementRef
  @ViewChild('wedStartTime') wedStartTime: ElementRef
  @ViewChild('thuStartTime') thuStartTime: ElementRef
  @ViewChild('friStartTime') friStartTime: ElementRef
  @ViewChild('satStartTime') satStartTime: ElementRef

  @ViewChild('sunEndTime') sunEndTime: ElementRef
  @ViewChild('monEndTime') monEndTime: ElementRef
  @ViewChild('tueEndTime') tueEndTime: ElementRef
  @ViewChild('wedEndTime') wedEndTime: ElementRef
  @ViewChild('thuEndTime') thuEndTime: ElementRef
  @ViewChild('friEndTime') friEndTime: ElementRef
  @ViewChild('satEndTime') satEndTime: ElementRef

  @ViewChild('hrs') hrs: ElementRef
  @ViewChild('minutes') minutes: ElementRef



  userUnavailability() {
    let sunday = this.SUN.nativeElement
    let monday = this.MON.nativeElement
    let tuesday = this.TUE.nativeElement
    let wednesday = this.WED.nativeElement
    let thursday = this.THU.nativeElement
    let friday = this.FRI.nativeElement
    let saturday = this.SAT.nativeElement

    this.userUnAvailabilityArray = []
    this.userAvailabilityArray = []
    this.workingHrs = {}

    console.log("days unchecked ", sunday.checked, monday.checked, tuesday.checked, wednesday.checked, thursday.checked, friday.checked, saturday.checked);


    if (!sunday.checked) {
      this.userUnAvailabilityArray.push(0)
    }
    if (!monday.checked) {
      this.userUnAvailabilityArray.push(1)
    }
    if (!tuesday.checked) {
      this.userUnAvailabilityArray.push(2)
    }
    if (!wednesday.checked) {
      this.userUnAvailabilityArray.push(3)
    }
    if (!thursday.checked) {
      this.userUnAvailabilityArray.push(4)
    }
    if (!friday.checked) {
      this.userUnAvailabilityArray.push(5)
    }
    if (!saturday.checked) {
      this.userUnAvailabilityArray.push(6)
    }

    console.log("userUnAvailabilityArray is ", this.userUnAvailabilityArray);

    // uncomment
    this.apiService.userUnavOn(this.userUnAvailabilityArray)

    let allDays = [0, 1, 2, 3, 4, 5, 6]

    for (let i = 0; i < allDays.length; i++) {
      let found = false
      for (let j = 0; j < this.userUnAvailabilityArray.length; j++) {
        if (allDays[i] == this.userUnAvailabilityArray[j]) {
          found = true
          break;
        }
      }
      if (found == false) {
        this.userAvailabilityArray.push(allDays[i])
      }
    }

    console.log("userAvailabilityArray is ", this.userAvailabilityArray);

    // uncomment
    this.apiService.userAvOnDay(this.userAvailabilityArray)



    // console.log(((monday.checked && this.monStartTime.nativeElement.value=="") , (monday.checked && this.monEndTime.nativeElement.value=="")) , ((tuesday.checked && this.tueStartTime.nativeElement.value=="") , (tuesday.checked && this.tueEndTime.nativeElement.value=="")) , ((wednesday.checked && this.wedStartTime.nativeElement.value=="") , (wednesday.checked && this.wedEndTime.nativeElement.value=="")) , ((thursday.checked && this.thuStartTime.nativeElement.value=="") , (thursday.checked && this.thuEndTime.nativeElement.value=="")) , ((friday.checked && this.friStartTime.nativeElement.value=="") , (friday.checked && this.friEndTime.nativeElement.value=="")) , ((friday.checked && this.friStartTime.nativeElement.value=="") , (saturday.checked && this.satEndTime.nativeElement.value=="")),  ((friday.checked && this.friStartTime.nativeElement.value=="") , (sunday.checked && this.sunEndTime.nativeElement.value=="")) )

    // console.log("mon start ", this.monStartTime.nativeElement.value);


    if (this.minutes.nativeElement.value == "") {
      this.minutes.nativeElement.value = this.durationMins
    }
    if (this.hrs.nativeElement.value == "") {
      this.hrs.nativeElement.value = this.durationHrs
    }

    this.duration.hrs = this.hrs.nativeElement.value
    this.duration.minutes = this.minutes.nativeElement.value
    // uncomment
    this.apiService.userAvOnTime(this.duration)
    console.log("user duration ", this.duration);


    for (let i = 0; i < this.userAvailabilityArray.length; i++) {
      this.workingHrs[this.userAvailabilityArray[i]] = { "start": "", "end": "" }
    }



    for (let key in this.workingHrs) {
      if (key == "0") {
        this.workingHrs[key].start = this.sunStartTime.nativeElement.value
        this.workingHrs[key].end = this.sunEndTime.nativeElement.value
      }
      if (key == "1") {
        this.workingHrs[key].start = this.monStartTime.nativeElement.value
        this.workingHrs[key].end = this.monEndTime.nativeElement.value
      }
      if (key == "2") {
        this.workingHrs[key].start = this.tueStartTime.nativeElement.value
        this.workingHrs[key].end = this.tueEndTime.nativeElement.value
      }
      if (key == "3") {
        this.workingHrs[key].start = this.wedStartTime.nativeElement.value
        this.workingHrs[key].end = this.wedEndTime.nativeElement.value
      }
      if (key == "4") {
        this.workingHrs[key].start = this.thuStartTime.nativeElement.value
        this.workingHrs[key].end = this.thuEndTime.nativeElement.value
      }
      if (key == "5") {
        this.workingHrs[key].start = this.friStartTime.nativeElement.value
        this.workingHrs[key].end = this.friEndTime.nativeElement.value
      }
      if (key == "6") {
        this.workingHrs[key].start = this.satStartTime.nativeElement.value
        this.workingHrs[key].end = this.satEndTime.nativeElement.value
      }
    }

    console.log("working hrs ", this.workingHrs);
    // /ncomment  
    this.apiService.userWorkingHrsAdmin(this.workingHrs, this.selectedUserEmail)


  }
}
