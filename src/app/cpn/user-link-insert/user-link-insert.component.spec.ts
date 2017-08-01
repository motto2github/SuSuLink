import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UserLinkInsertComponent} from './user-link-insert.component';

describe('UserLinkInsertComponent', () => {
  let component: UserLinkInsertComponent;
  let fixture: ComponentFixture<UserLinkInsertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserLinkInsertComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLinkInsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
