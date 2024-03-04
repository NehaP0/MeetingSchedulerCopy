import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEventTypeComponent } from './new-event-type.component';

describe('NewEventTypeComponent', () => {
  let component: NewEventTypeComponent;
  let fixture: ComponentFixture<NewEventTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewEventTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewEventTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
