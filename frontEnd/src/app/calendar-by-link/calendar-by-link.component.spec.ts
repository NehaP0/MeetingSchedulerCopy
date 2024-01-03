import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarByLinkComponent } from './calendar-by-link.component';

describe('CalendarByLinkComponent', () => {
  let component: CalendarByLinkComponent;
  let fixture: ComponentFixture<CalendarByLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalendarByLinkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CalendarByLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
