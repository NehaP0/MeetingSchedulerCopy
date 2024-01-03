import { Component, OnInit } from '@angular/core';
import { APIService } from './api.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{
  title = 'frontEnd2';

  constructor(private apiService: APIService){}

}

