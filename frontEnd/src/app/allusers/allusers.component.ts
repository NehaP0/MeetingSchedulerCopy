import { Component, OnInit  } from '@angular/core';
import {APIService} from '../api.service'
import { ActivatedRoute, Router} from '@angular/router';


@Component({
  selector: 'app-allusers',
  templateUrl: './allusers.component.html',
  styleUrl: './allusers.component.css'
})
export class AllusersComponent implements OnInit{
  userName: string = ''
  public users : Array<any> = []

  constructor(private apiService : APIService, private route:ActivatedRoute,private router:Router){}

  ngOnInit(){
    this.getallusers()
  }

  public getallusers(){
    const token = localStorage.getItem("token")
    // console.log(token)
    this.apiService.getallusers().subscribe((data: Array<any>) =>{
      // this.apiService.setAuthorizationHeader(token)
      this.users = data['users']
      console.log(this.users)
    })
  }

  goToCalendarPage(name, emailID){
    console.log(name, emailID);  
    // console.log("I am called");      
    this.apiService.setUserName(name);
    this.apiService.setUserEmailId(emailID);

    this.router.navigate(['/calendar'])
  }

  goToCalendarLinkPage(name, emailID){
    console.log("clicked, clicked");  
    // console.log("I am called");      
    this.apiService.setUserName(name);
    this.apiService.setUserEmailId(emailID);
    

    this.router.navigate(['/calendarbylink'])
  }

  // setUserName(name) {
  //   console.log(name);  
  //   console.log("I am called");      
  //   this.apiService.setUserName(name);
  // }
}
