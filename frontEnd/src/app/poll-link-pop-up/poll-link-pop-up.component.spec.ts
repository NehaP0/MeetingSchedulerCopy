import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollLinkPopUpComponent } from './poll-link-pop-up.component';

describe('PollLinkPopUpComponent', () => {
  let component: PollLinkPopUpComponent;
  let fixture: ComponentFixture<PollLinkPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PollLinkPopUpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PollLinkPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
