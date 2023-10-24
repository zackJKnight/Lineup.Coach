import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListPlayersComponent } from './list-players.component';

describe('ListPlayersComponent', () => {
  let component: ListPlayersComponent;
  let fixture: ComponentFixture<ListPlayersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPlayersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPlayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
