import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration  } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import {RecurrenceEditorModule, ScheduleModule, DayService, WeekService, WorkWeekService, MonthService, MonthAgendaService} from '@syncfusion/ej2-angular-schedule'


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterationComponent } from './registeration/registeration.component';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { AllusersComponent } from './allusers/allusers.component';
import { LoginComponent } from './login/login.component';
import { ScheduleMeetingComponent } from './schedule-meeting/schedule-meeting.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarByLinkComponent } from './calendar-by-link/calendar-by-link.component';
// import { CalendarComponentComponent } from './calendar-component/calendar-component.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterationComponent,
    AllusersComponent,
    LoginComponent,
    ScheduleMeetingComponent,
    CalendarComponent,
    CalendarByLinkComponent,
    // CalendarComponentComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ScheduleModule,
    RecurrenceEditorModule,
    BsDatepickerModule.forRoot()
  ],
  providers: [
    DayService, WeekService, MonthAgendaService, WorkWeekService, MonthService,
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
