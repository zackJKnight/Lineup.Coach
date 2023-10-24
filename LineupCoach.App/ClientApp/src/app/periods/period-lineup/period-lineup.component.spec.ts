import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PeriodLineupComponent } from './period-lineup.component';

describe('PeriodLineupComponent', () => {
  let component: PeriodLineupComponent;
  let fixture: ComponentFixture<PeriodLineupComponent>;

  beforeEach(waitForAsync(() => {
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
