import { Component, OnInit } from '@angular/core';
import { APIService } from '../api.service';
import {NgForm} from '@angular/forms'
import { ActivatedRoute, Router} from '@angular/router';
import { Location } from '@angular/common'




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  userLoggedIn : boolean = false



  constructor(private apiService: APIService, private route:ActivatedRoute,private router:Router, private location: Location){}

  ngOnInit(){}

  loginUser(userForm : NgForm){

    // console.log("prev location ", this.location.historyGo)
    // this.location.back()

    if(userForm.valid){
      const user = {
        emailID : userForm.value.EmailID,
        password : userForm.value.Password
      }

      this.apiService.loginUser(user).subscribe((response)=>{
        console.log(response);
        const token = response['token']
        // this.apiService.setAuthorizationHeader(token)

        localStorage.setItem("emailID", user.emailID);


        console.log(token.token);
        localStorage.setItem("token", token.token)
        
        alert('Login Successful')
        userForm.resetForm()       

        
        this.router.navigate(['/users'])  
        console.log("After login ", this.userLoggedIn);         
      },
      (error)=>{
        alert('Invalid Credentials')
        console.log(error);        
      })
    }
    else{
      alert('Invalid Credentials')
    }
  }


  goToRegisterPage(){
    this.router.navigate(['/registeration'])
  }
}