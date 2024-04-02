import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoriNavComponent } from './hori-nav.component';

describe('HoriNavComponent', () => {
  let component: HoriNavComponent;
  let fixture: ComponentFixture<HoriNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HoriNavComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HoriNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
