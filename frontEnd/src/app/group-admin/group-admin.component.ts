import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-group-admin',
  templateUrl: './group-admin.component.html',
  styleUrl: './group-admin.component.css'
})
export class GroupAdminComponent {

  askForGrpCreation : boolean = true
  grpNamePopUp : boolean = false 
  grpName : string = ""

  constructor(private router: Router) {}



  createGrpBtn(){
    this.askForGrpCreation = false
    this.grpNamePopUp = true
  }

  cancelBtn(){
    this.router.navigate(['users']);

  }

  continueBtn(){
    console.log("grpName ",this.grpName);  
  }

}
