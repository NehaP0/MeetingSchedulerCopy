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
        console.log("login function called");
        
        console.log("response ",response);
        const token = response['token']
        // this.apiService.setAuthorizationHeader(token)

        localStorage.setItem("emailID", user.emailID);


        console.log("token ",token.token);
        localStorage.setItem("token", token.token)
        // localStorage.setItem("isAuth", "true")
        
        // alert(response['message'])
        userForm.resetForm()       

        if(response['message'] == "Login Successful."){

          this.router.navigate(['/home'])  
        }
        
        // setTimeout(()=>{
        // }, 1000)
        console.log("After login ", this.userLoggedIn);         
      },
      (error)=>{
        alert('Invalid Credentials')
        // localStorage.setItem("isAuth", "false")

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