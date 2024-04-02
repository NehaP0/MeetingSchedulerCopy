import { NgModule, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterationComponent } from './registeration/registeration.component';
import { LoginComponent } from './login/login.component';
import { AllusersComponent } from './allusers/allusers.component';
// import { ScheduleMeetingComponent } from './schedule-meeting/schedule-meeting.component';
// import { CalendarComponent } from './calendar/calendar.component';
import { CalendarByLinkComponent } from './calendar-by-link/calendar-by-link.component';
// import { CalendarComponentComponent } from './calendar-component/calendar-component.component';
import { CustomiseComponent } from './customise/customise.component';
import { HomePageComponent } from './home-page/home-page.component';
import { NewEventTypeComponent } from './new-event-type/new-event-type.component';
import { CreateNewEventTypeComponent } from './create-new-event-type/create-new-event-type.component';
import { SelectDateTimeComponent } from './select-date-time/select-date-time.component';
import { CreateMeetingComponent } from './create-meeting/create-meeting.component';
import { MakeMeetingComponent } from './make-meeting/make-meeting.component';
import { ListAllEventTypesComponent } from './list-all-event-types/list-all-event-types.component';
import { ScheduledEventsComponent } from './scheduled-events/scheduled-events.component';
import { EditEventComponent } from './edit-event/edit-event.component';
import { NewUserAdditionAdminComponent } from './new-user-addition-admin/new-user-addition-admin.component';
import { EntireUserAdminComponent } from './entire-user-admin/entire-user-admin.component';
// import { MeetingsAdminComponent } from './meetings-admin/meetings-admin.component';
import { CalendarEventsAdminComponent } from './calendar-events-admin/calendar-events-admin.component';
import { UserAvailabilityAdminComponent } from './user-availability-admin/user-availability-admin.component';
import { MeetingsTableAdminComponent } from './meetings-table-admin/meetings-table-admin.component';
import { MeetingsCalendarAdminComponent } from './meetings-calendar-admin/meetings-calendar-admin.component';
import { MakeMeetingAdminComponent } from './make-meeting-admin/make-meeting-admin.component';

// import { ScheduleMeetComponent } from './schedule-meet/schedule-meet.component';
// import { CalendarComponentComponent } from './calendar-component/calendar-component.component';
// ?name={{user.name}}&id={{user.emailID}}


const routes: Routes = [
  { path:  '', redirectTo:  'registeration', pathMatch:  'full' },
  {path : 'registeration', component: RegisterationComponent},
  {path : 'login', component: LoginComponent},
  // {path : 'schedulemeet', component: ScheduleMeetingComponent},
  {path : 'calendarByLink', component: CalendarByLinkComponent},
  // {path : 'calendar', component: CalendarComponentComponent},
  {path : 'customise', component: CustomiseComponent},
  {path : 'home', component: HomePageComponent},
  {path: 'createNewEventType', component: NewEventTypeComponent},
  {path : 'newEventType', component : CreateNewEventTypeComponent},
  {path : 'selectDateTime', component: SelectDateTimeComponent},
  {path: 'createMeeting', component: CreateMeetingComponent},
  {path: 'makeMeeting', component : MakeMeetingComponent},
  // {path: 'scheduleMeet', component: ScheduleMeetComponent}
  // MakeMeetingComponent
  {path: 'listAllEventTypesComponent', component: ListAllEventTypesComponent},
  {path: 'scheduledEvents', component: ScheduledEventsComponent},
  {path: 'editEvent', component : EditEventComponent}  ,

  {path : 'users', component: AllusersComponent},
  {path: 'newUserAdditionAdmin',component : NewUserAdditionAdminComponent},
  {path: 'entireUserAdmin', component : EntireUserAdminComponent},
  // {path: 'meetingsAdmin', component: MeetingsAdminComponent},
  {path : 'calendarEventsAdmin',component: CalendarEventsAdminComponent},
  {path : 'userAvailabilityAdmin', component: UserAvailabilityAdminComponent},
  {path: 'meetingsTableAdmin', component: MeetingsTableAdminComponent},
  {path : 'meetingsCalendarAdmin', component: MeetingsCalendarAdminComponent},
  {path : 'makeMeetingAdminComponent', component: MakeMeetingAdminComponent}

];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule{}

