import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilcajeroComponent } from './perfilcajero.component';

describe('PerfilcajeroComponent', () => {
  let component: PerfilcajeroComponent;
  let fixture: ComponentFixture<PerfilcajeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerfilcajeroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilcajeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
