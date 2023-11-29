import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoadministradoresComponent } from './listadoadministradores.component';

describe('ListadoadministradoresComponent', () => {
  let component: ListadoadministradoresComponent;
  let fixture: ComponentFixture<ListadoadministradoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoadministradoresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoadministradoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
