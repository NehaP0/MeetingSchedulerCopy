import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalNavAdminComponent } from './horizontal-nav-admin.component';

describe('HorizontalNavAdminComponent', () => {
  let component: HorizontalNavAdminComponent;
  let fixture: ComponentFixture<HorizontalNavAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HorizontalNavAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HorizontalNavAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
