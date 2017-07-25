import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeListMyComponent } from './home-list-my.component';

describe('HomeListMyComponent', () => {
  let component: HomeListMyComponent;
  let fixture: ComponentFixture<HomeListMyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeListMyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeListMyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
