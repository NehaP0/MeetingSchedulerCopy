import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../api.service';

@Component({
  selector: 'app-poll-link-pop-up',
  templateUrl: './poll-link-pop-up.component.html',
  styleUrl: './poll-link-pop-up.component.css'
})
export class PollLinkPopUpComponent {

  votingLink : string = ""
  buttonText = 'Copy Link';
  token = localStorage.getItem('token')

  constructor(private route:ActivatedRoute,private router:Router,private apiService: APIService){}

  ngOnInit(){

    if(!this.token){
      this.router.navigate(['/login']);
    }

    this.apiService.votingLink$.subscribe((link)=>{
      console.log("loink ", link);      
      this.votingLink = link
    })

      //  this.apiService.eventsArray$.subscribe((eventsArray) => {
    //   console.log("events in ts ",eventsArray)
    //   this.eventsArrayOfLoggedInUser = eventsArray
    //  })
  }




  closePopUp(){
    this.router.navigate(['/home'])
  }
  copyLink() {
    navigator.clipboard.writeText(this.votingLink).then(() => {
      this.buttonText = 'Copied';
      setTimeout(() => {
        this.buttonText = 'Copy Link';
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }

}
