import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UserLinkAddComponent} from './user-link-add.component';

describe('UserLinkAddComponent', () => {
  let component: UserLinkAddComponent;
  let fixture: ComponentFixture<UserLinkAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserLinkAddComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLinkAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
