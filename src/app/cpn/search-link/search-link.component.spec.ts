import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchLinkComponent } from './search-link.component';

describe('SearchLinkComponent', () => {
  let component: SearchLinkComponent;
  let fixture: ComponentFixture<SearchLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
