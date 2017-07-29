import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkAddComponent } from './link-add.component';

describe('LinkAddComponent', () => {
  let component: LinkAddComponent;
  let fixture: ComponentFixture<LinkAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
