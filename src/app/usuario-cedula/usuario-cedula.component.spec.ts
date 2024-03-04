import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioCedulaComponent } from './usuario-cedula.component';

describe('UsuarioCedulaComponent', () => {
  let component: UsuarioCedulaComponent;
  let fixture: ComponentFixture<UsuarioCedulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsuarioCedulaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuarioCedulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
