import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosplatoComponent } from './productosplato.component';

describe('ProductosplatoComponent', () => {
  let component: ProductosplatoComponent;
  let fixture: ComponentFixture<ProductosplatoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductosplatoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductosplatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
