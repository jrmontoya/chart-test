import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpChartComponent } from './cmp-chart.component';

describe('CmpChartComponent', () => {
  let component: CmpChartComponent;
  let fixture: ComponentFixture<CmpChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
