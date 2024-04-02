import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoriNavMeetingsAdminComponent } from './hori-nav-meetings-admin.component';

describe('HoriNavMeetingsAdminComponent', () => {
  let component: HoriNavMeetingsAdminComponent;
  let fixture: ComponentFixture<HoriNavMeetingsAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HoriNavMeetingsAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HoriNavMeetingsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
