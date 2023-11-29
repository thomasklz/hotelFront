import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteingresosComponent } from './reporteingresos.component';

describe('ReporteingresosComponent', () => {
  let component: ReporteingresosComponent;
  let fixture: ComponentFixture<ReporteingresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteingresosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteingresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
