import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-o-auth-login',
  templateUrl: './o-auth-login.component.html',
  styleUrl: './o-auth-login.component.css'
})
export class OAuthLoginComponent {

  constructor(private authService: AuthService) {}

  login() {
    this.authService.initiateLogin();
  }
}
