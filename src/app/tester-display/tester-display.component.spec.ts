import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TesterDisplayComponent } from './tester-display.component';

describe('TesterDisplayComponent', () => {
  let component: TesterDisplayComponent;
  let fixture: ComponentFixture<TesterDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TesterDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TesterDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
