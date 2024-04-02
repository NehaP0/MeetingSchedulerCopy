import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntireUserAdminComponent } from './entire-user-admin.component';

describe('EntireUserAdminComponent', () => {
  let component: EntireUserAdminComponent;
  let fixture: ComponentFixture<EntireUserAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EntireUserAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EntireUserAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
