import { NgModule, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterationComponent } from './registeration/registeration.component';
import { LoginComponent } from './login/login.component';
import { AllusersComponent } from './allusers/allusers.component';
import { ScheduleMeetingComponent } from './schedule-meeting/schedule-meeting.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarByLinkComponent } from './calendar-by-link/calendar-by-link.component';


// import { CalendarComponentComponent } from './calendar-component/calendar-component.component';

// ?name={{user.name}}&id={{user.emailID}}

const routes: Routes = [
  { path:  '', redirectTo:  'registeration', pathMatch:  'full' },
  {path : 'registeration', component: RegisterationComponent},
  {path : 'login', component: LoginComponent},
  {path : 'users', component: AllusersComponent},
  {path : 'schedulemeet', component: ScheduleMeetingComponent},
  {path : 'calendar', component: CalendarComponent},
  {path : 'calendarByLink', component: CalendarByLinkComponent}
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule{}

