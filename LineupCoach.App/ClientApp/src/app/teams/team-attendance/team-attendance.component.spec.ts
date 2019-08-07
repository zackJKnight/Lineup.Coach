import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamAttendanceComponent } from './team-attendance.component';

describe('TeamAttendanceComponent', () => {
  let component: TeamAttendanceComponent;
  let fixture: ComponentFixture<TeamAttendanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamAttendanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
