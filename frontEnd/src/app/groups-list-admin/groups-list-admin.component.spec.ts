import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsListAdminComponent } from './groups-list-admin.component';

describe('GroupsListAdminComponent', () => {
  let component: GroupsListAdminComponent;
  let fixture: ComponentFixture<GroupsListAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupsListAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupsListAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
