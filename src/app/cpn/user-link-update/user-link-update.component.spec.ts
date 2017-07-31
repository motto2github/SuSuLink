import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLinkUpdateComponent } from './user-link-update.component';

describe('UserLinkUpdateComponent', () => {
  let component: UserLinkUpdateComponent;
  let fixture: ComponentFixture<UserLinkUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserLinkUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLinkUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
