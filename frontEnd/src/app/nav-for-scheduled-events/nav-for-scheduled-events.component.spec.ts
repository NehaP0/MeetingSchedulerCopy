import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavForScheduledEventsComponent } from './nav-for-scheduled-events.component';

describe('NavForScheduledEventsComponent', () => {
  let component: NavForScheduledEventsComponent;
  let fixture: ComponentFixture<NavForScheduledEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavForScheduledEventsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavForScheduledEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
