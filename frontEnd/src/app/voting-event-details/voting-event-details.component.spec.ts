import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotingEventDetailsComponent } from './voting-event-details.component';

describe('VotingEventDetailsComponent', () => {
  let component: VotingEventDetailsComponent;
  let fixture: ComponentFixture<VotingEventDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VotingEventDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VotingEventDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
