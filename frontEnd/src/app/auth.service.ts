import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  initiateLogin() {
    // Replace 'YOUR_AUTH_URL' with the URL of your authentication endpoint
    window.location.href = 'http://localhost:4200/auth/callback';
  }

  exchangeCodeForToken(code: string) {
    console.log("code code ", code);
    
    // Replace 'YOUR_BACKEND_URL/token' with the URL of your token exchange endpoint
    return this.http.post('http://localhost:3000/token', { code });
  }
}
