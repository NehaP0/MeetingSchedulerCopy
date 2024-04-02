import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarEventsAdminComponent } from './calendar-events-admin.component';

describe('CalendarEventsAdminComponent', () => {
  let component: CalendarEventsAdminComponent;
  let fixture: ComponentFixture<CalendarEventsAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalendarEventsAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CalendarEventsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
