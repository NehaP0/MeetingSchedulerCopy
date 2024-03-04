import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllEventTypesComponent } from './list-all-event-types.component';

describe('ListAllEventTypesComponent', () => {
  let component: ListAllEventTypesComponent;
  let fixture: ComponentFixture<ListAllEventTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListAllEventTypesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListAllEventTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
