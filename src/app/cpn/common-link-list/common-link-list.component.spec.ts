import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonLinkListComponent } from './common-link-list.component';

describe('CommonLinkListComponent', () => {
  let component: CommonLinkListComponent;
  let fixture: ComponentFixture<CommonLinkListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonLinkListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonLinkListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
