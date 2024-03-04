import { Component, OnInit } from '@angular/core';
import { APIService } from './api.service';
import { Subscription, filter} from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router} from '@angular/router';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{
  title = 'frontEnd2';
  // loggedInEmailId: string = '';
  loggedInEmailId: string = localStorage.getItem("emailID" || "")
  showAvailibilityOnNav = false
  // showAvailibilityOnNav  = localStorage.getItem("showAvailibilityOnNav")
  // shouldShowNavbar: boolean = false;

  
  
  // constructor(private apiService: APIService){}
  
  constructor(private apiService : APIService, private router:Router){
    // this.subscription = this.apiService.userLoggedInEmailId$.subscribe((userLoggedInEmailId) => {
    //   this.loggedInEmailId = userLoggedInEmailId;
    //   this.putAvailabilityOnNavBar()
    //   console.log("logged in user email is ",this.loggedInEmailId)
    // });

    // this.router.events.pipe(
    //   filter(event => event instanceof NavigationEnd)
    // ).subscribe((event: NavigationEnd) => {
    //   this.shouldShowNavbar = event.urlAfterRedirects === '/home';
    // });
  }


  private subscription: Subscription;

  // ngOnInit(){
  //   this.putAvailabilityOnNavBar()
  // }


  putAvailabilityOnNavBar(){
    console.log("logged in for nav bar", this.loggedInEmailId);  
    if(this.loggedInEmailId == ""){
      this.showAvailibilityOnNav = false
    } 
    else{
      this.showAvailibilityOnNav = true
    } 
    console.log("email in appComp ", this.loggedInEmailId);
  }

  // logOutUser(){
  //   localStorage.setItem("emailID", "")
  //   localStorage.setItem("userLoggedInName", "")
  //   this.router.navigate(['/login'])
  // }

  

  
}

