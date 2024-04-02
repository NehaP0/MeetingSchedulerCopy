import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAvailabilityAdminComponent } from './user-availability-admin.component';

describe('UserAvailabilityAdminComponent', () => {
  let component: UserAvailabilityAdminComponent;
  let fixture: ComponentFixture<UserAvailabilityAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserAvailabilityAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserAvailabilityAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
