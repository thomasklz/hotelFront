import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoalimentosComponent } from './tipoalimentos.component';

describe('TipoalimentosComponent', () => {
  let component: TipoalimentosComponent;
  let fixture: ComponentFixture<TipoalimentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoalimentosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoalimentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
