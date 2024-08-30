import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarperfilcajeroComponent } from './editarperfilcajero.component';

describe('EditarperfilcajeroComponent', () => {
  let component: EditarperfilcajeroComponent;
  let fixture: ComponentFixture<EditarperfilcajeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarperfilcajeroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarperfilcajeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
