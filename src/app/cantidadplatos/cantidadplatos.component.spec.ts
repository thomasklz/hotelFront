import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CantidadplatosComponent } from './cantidadplatos.component';

describe('CantidadplatosComponent', () => {
  let component: CantidadplatosComponent;
  let fixture: ComponentFixture<CantidadplatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CantidadplatosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CantidadplatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
