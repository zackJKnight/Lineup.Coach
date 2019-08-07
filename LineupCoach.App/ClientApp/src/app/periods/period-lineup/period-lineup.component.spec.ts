import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodLineupComponent } from './period-lineup.component';

describe('PeriodLineupComponent', () => {
  let component: PeriodLineupComponent;
  let fixture: ComponentFixture<PeriodLineupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeriodLineupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodLineupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
