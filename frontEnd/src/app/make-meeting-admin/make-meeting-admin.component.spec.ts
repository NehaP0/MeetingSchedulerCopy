import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeMeetingAdminComponent } from './make-meeting-admin.component';

describe('MakeMeetingAdminComponent', () => {
  let component: MakeMeetingAdminComponent;
  let fixture: ComponentFixture<MakeMeetingAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MakeMeetingAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MakeMeetingAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
