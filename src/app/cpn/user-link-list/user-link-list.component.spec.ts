import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLinkListComponent } from './user-link-list.component';

describe('UserLinkListComponent', () => {
  let component: UserLinkListComponent;
  let fixture: ComponentFixture<UserLinkListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserLinkListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLinkListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
