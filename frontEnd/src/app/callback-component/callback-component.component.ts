import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-callback-component',
  templateUrl: './callback-component.component.html',
  // templateUrl:`<p>Redirecting...</p>`,
  styleUrl: './callback-component.component.css'
})
export class CallbackComponentComponent implements OnInit  {

  constructor(private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {
    // Extract the authorization code from the query parameters
    const code = this.route.snapshot.queryParams['code'];

    console.log("got code ", code);
    

    // Call the AuthService to exchange the authorization code for an access token
    this.authService.exchangeCodeForToken(code).subscribe(
      (response: any) => {
        console.log('Access token obtained:', response.access_token);
        // Optionally, you can perform further actions here after obtaining the access token
      },
      (error: any) => {
        console.error('Error exchanging code for token:', error);
        // Handle error as needed
      }
    );
}
}
