import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingsTableAdminComponent } from './meetings-table-admin.component';

describe('MeetingsTableAdminComponent', () => {
  let component: MeetingsTableAdminComponent;
  let fixture: ComponentFixture<MeetingsTableAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeetingsTableAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MeetingsTableAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
