import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeListAllComponent } from './home-list-all.component';

describe('HomeListAllComponent', () => {
  let component: HomeListAllComponent;
  let fixture: ComponentFixture<HomeListAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeListAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeListAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
