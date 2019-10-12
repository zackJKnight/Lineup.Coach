import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPlayerPreferencesComponent } from './edit-player-preferences.component';

describe('EditPlayerPreferencesComponent', () => {
  let component: EditPlayerPreferencesComponent;
  let fixture: ComponentFixture<EditPlayerPreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPlayerPreferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPlayerPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
