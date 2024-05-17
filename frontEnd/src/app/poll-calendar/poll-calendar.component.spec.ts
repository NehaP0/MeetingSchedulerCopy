import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollCalendarComponent } from './poll-calendar.component';

describe('PollCalendarComponent', () => {
  let component: PollCalendarComponent;
  let fixture: ComponentFixture<PollCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PollCalendarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PollCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
