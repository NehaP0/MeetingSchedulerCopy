import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewEventTypeComponent } from './create-new-event-type.component';

describe('CreateNewEventTypeComponent', () => {
  let component: CreateNewEventTypeComponent;
  let fixture: ComponentFixture<CreateNewEventTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateNewEventTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateNewEventTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
