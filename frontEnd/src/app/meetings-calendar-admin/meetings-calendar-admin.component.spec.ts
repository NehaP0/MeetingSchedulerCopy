import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingsCalendarAdminComponent } from './meetings-calendar-admin.component';

describe('MeetingsCalendarAdminComponent', () => {
  let component: MeetingsCalendarAdminComponent;
  let fixture: ComponentFixture<MeetingsCalendarAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeetingsCalendarAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MeetingsCalendarAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
