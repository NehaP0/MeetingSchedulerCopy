import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollingPageComponent } from './polling-page.component';

describe('PollingPageComponent', () => {
  let component: PollingPageComponent;
  let fixture: ComponentFixture<PollingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PollingPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PollingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
