import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportePolitecnicoComponent } from './reporte-politecnico.component';

describe('ReportePolitecnicoComponent', () => {
  let component: ReportePolitecnicoComponent;
  let fixture: ComponentFixture<ReportePolitecnicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportePolitecnicoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportePolitecnicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
