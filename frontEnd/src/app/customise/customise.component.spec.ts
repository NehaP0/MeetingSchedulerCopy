import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomiseComponent } from './customise.component';

describe('CustomiseComponent', () => {
  let component: CustomiseComponent;
  let fixture: ComponentFixture<CustomiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomiseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
