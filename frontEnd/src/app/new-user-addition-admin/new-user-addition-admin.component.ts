import { Component, OnInit} from '@angular/core';
import { APIService } from '../api.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-new-user-addition-admin',
  templateUrl: './new-user-addition-admin.component.html',
  styleUrl: './new-user-addition-admin.component.css'
})
export class NewUserAdditionAdminComponent implements OnInit {

  constructor(private apiService: APIService, private route:ActivatedRoute,private router:Router){}

  ngOnInit(){}

  registerUser(userForm : NgForm){

    if(userForm.valid){
      const user = {
        name : userForm.value.Name,
        emailID : userForm.value.EmailID,
        password : userForm.value.Password
      }      

      this.apiService.registerUser(user).subscribe((response)=>{
        console.log(response); 
        alert(response["message"])
        userForm.resetForm()
        this.router.navigate(['/users'])
      },
      (error)=>{
        console.log(error);        
      })
    }

    else{
      alert('Invalid Credentials')
    }
  }


  // goToLoginPage(){
  //     this.router.navigate(['/login'])
  // }
}
