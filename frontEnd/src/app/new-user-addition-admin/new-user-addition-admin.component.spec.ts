import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewUserAdditionAdminComponent } from './new-user-addition-admin.component';

describe('NewUserAdditionAdminComponent', () => {
  let component: NewUserAdditionAdminComponent;
  let fixture: ComponentFixture<NewUserAdditionAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewUserAdditionAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewUserAdditionAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
