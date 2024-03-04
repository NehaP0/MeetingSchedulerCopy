import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeMeetingComponent } from './make-meeting.component';

describe('MakeMeetingComponent', () => {
  let component: MakeMeetingComponent;
  let fixture: ComponentFixture<MakeMeetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MakeMeetingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MakeMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
