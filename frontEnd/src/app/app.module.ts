import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration  } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import {RecurrenceEditorModule, ScheduleModule, DayService, WeekService, WorkWeekService, MonthService, MonthAgendaService} from '@syncfusion/ej2-angular-schedule'


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterationComponent } from './registeration/registeration.component';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { AllusersComponent } from './allusers/allusers.component';
import { LoginComponent } from './login/login.component';
// import { ScheduleMeetingComponent } from './schedule-meeting/schedule-meeting.component';
// import { CalendarComponent } from './calendar/calendar.component';
import { CalendarByLinkComponent } from './calendar-by-link/calendar-by-link.component';
// import { CalendarComponentComponent } from './calendar-component/calendar-component.component';
// import { CalendarComponentComponent } from './calendar-component/calendar-component.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CustomiseComponent } from './customise/customise.component';
import { HomePageComponent } from './home-page/home-page.component';


import { NgIconsModule } from '@ng-icons/core';
import { heroUsers, heroVideoCamera, heroGlobeAsiaAustralia } from '@ng-icons/heroicons/outline';
import {ionSettingsOutline, ionCopyOutline, ionSearchOutline, ionLogInOutline} from '@ng-icons/ionicons'
import {bootstrapStars, bootstrapCaretDownFill, bootstrapChevronDown, bootstrapCCircleFill, bootstrapPlusCircleFill, bootstrapClock, bootstrapQuestionCircle, bootstrapArrowLeft} from '@ng-icons/bootstrap-icons'
import {remixUserAddLine, remixCalendar2Line, remixStackshareLine, remixArrowRightSLine, remixDeleteBin6Line} from '@ng-icons/remixicon'
import {typAttachmentOutline, typTick} from '@ng-icons/typicons'
import {circumRoute} from '@ng-icons/circum-icons'
import {octApps, octLocation} from '@ng-icons/octicons'
import {iconoirCrown} from '@ng-icons/iconoir';
import {tablerEdit} from '@ng-icons/tabler-icons'
import {radixCross2} from '@ng-icons/radix-icons'

import { NewEventTypeComponent } from './new-event-type/new-event-type.component';
import { CreateNewEventTypeComponent } from './create-new-event-type/create-new-event-type.component';
import { SelectDateTimeComponent } from './select-date-time/select-date-time.component';
import { CreateMeetingComponent } from './create-meeting/create-meeting.component';
import { MakeMeetingComponent } from './make-meeting/make-meeting.component';
import { DatePipe } from '@angular/common';
import { ListAllEventTypesComponent } from './list-all-event-types/list-all-event-types.component';
import { ScheduledEventsComponent } from './scheduled-events/scheduled-events.component';
import { ClipboardModule } from 'ngx-clipboard';
import { NgxSearchFilterModule } from 'ngx-search-filter';
import { NavbarComponent } from './navbar/navbar.component';
import { HoriNavComponent } from './hori-nav/hori-nav.component';
import { EditEventComponent } from './edit-event/edit-event.component';
import { AdminNavBarComponent } from './admin-nav-bar/admin-nav-bar.component';
import { NewUserAdditionAdminComponent } from './new-user-addition-admin/new-user-addition-admin.component';
import { EntireUserAdminComponent } from './entire-user-admin/entire-user-admin.component';
// import { MeetingsAdminComponent } from './meetings-admin/meetings-admin.component';
import { CalendarEventsAdminComponent } from './calendar-events-admin/calendar-events-admin.component';
import { HorizontalNavAdminComponent } from './horizontal-nav-admin/horizontal-nav-admin.component';
import { UserAvailabilityAdminComponent } from './user-availability-admin/user-availability-admin.component';
import { HoriNavMeetingsAdminComponent } from './hori-nav-meetings-admin/hori-nav-meetings-admin.component';
import { MeetingsTableAdminComponent } from './meetings-table-admin/meetings-table-admin.component';
import { MeetingsCalendarAdminComponent } from './meetings-calendar-admin/meetings-calendar-admin.component';
import { MakeMeetingAdminComponent } from './make-meeting-admin/make-meeting-admin.component';
import { EditMeetComponent } from './edit-meet/edit-meet.component';

// import { NavbarComponent } from './navbar/navbar.component';
// import { ScheduleMeetComponent } from './schedule-meet/schedule-meet.component';


@NgModule({
  declarations: [
    AppComponent,
    RegisterationComponent,
    AllusersComponent,
    LoginComponent,
    // ScheduleMeetingComponent,
    // CalendarComponent,
    CalendarByLinkComponent,
    // CalendarComponentComponent,
    CustomiseComponent,
    HomePageComponent,
    NewEventTypeComponent,
    CreateNewEventTypeComponent,
    SelectDateTimeComponent,
    CreateMeetingComponent,
    MakeMeetingComponent,
    ListAllEventTypesComponent,
    ScheduledEventsComponent,
    NavbarComponent,
    HoriNavComponent,
    EditEventComponent,
    AdminNavBarComponent,
    NewUserAdditionAdminComponent,
    EntireUserAdminComponent,
    // MeetingsAdminComponent,
    CalendarEventsAdminComponent,
    HorizontalNavAdminComponent,
    UserAvailabilityAdminComponent,
    HoriNavMeetingsAdminComponent,
    MeetingsTableAdminComponent,
    MeetingsCalendarAdminComponent,
    MakeMeetingAdminComponent,
    EditMeetComponent,
    // NavbarComponent,
    // ScheduleMeetComponent
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
    FullCalendarModule,
    ClipboardModule,
    NgxSearchFilterModule,
    BsDatepickerModule.forRoot(),
    AccordionModule.forRoot(),
    NgIconsModule.withIcons({ heroUsers, ionSettingsOutline, bootstrapStars, remixUserAddLine, ionSearchOutline, bootstrapCaretDownFill, ionCopyOutline, bootstrapChevronDown,
       bootstrapCCircleFill, bootstrapPlusCircleFill, typAttachmentOutline, remixCalendar2Line, remixStackshareLine, circumRoute , bootstrapClock, octApps, iconoirCrown,
       bootstrapQuestionCircle, remixArrowRightSLine, heroVideoCamera, octLocation, heroGlobeAsiaAustralia, bootstrapArrowLeft, typTick, tablerEdit, remixDeleteBin6Line, radixCross2,
       ionLogInOutline}),
  ],
  providers: [
    DayService, WeekService, MonthAgendaService, WorkWeekService, MonthService,DatePipe,
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
