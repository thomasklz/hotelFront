import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { UsuarioService } from 'app/servicios/usuario.service';
import swal from 'sweetalert';
import swal2 from 'sweetalert';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  dataSource = new MatTableDataSource<any>();
  submitted = false;

  constructor(
    private UsuarioService: UsuarioService,
    private router: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) {}

  personaForm!: FormGroup;
  title = 'sweetAlert';

  showModal() {
    swal2({
      title: 'Datos registrados exitosamente',
      icon: 'success',
    });
  }

  showModalError() {
    swal({
      title: 'Error en el registro de datos',
      icon: 'error',
    });
  }

  ngOnInit() {
    this.personaForm = this.formBuilder.group({
      nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      telefono: new FormControl('', [Validators.required, Validators.minLength(10)]),
      foto: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      usuario: new FormControl('', [Validators.required, Validators.minLength(3)]),
      contrasena: new FormControl('', [Validators.required, Validators.minLength(4)]),
    });
  }
  
 
  addPersona() {
    if (this.personaForm.invalid) {
      this.submitted = true;

      if (this.personaForm.touched) {
        // Verificar si todos los campos están vacíos
        const allFieldsEmpty = Object.values(this.personaForm.value).every((value) => !value);
        
        if (allFieldsEmpty) {
          this.personaForm.markAllAsTouched(); // Marcar todos los campos como tocados para mostrar los mensajes de error
        } else {
          // Marcar solo los campos vacíos como tocados para mostrar los mensajes de error
          Object.keys(this.personaForm.controls).forEach((field) => {
            if (this.personaForm.get(field)?.value === '') {
              this.personaForm.get(field)?.markAsTouched();
            }
          });
        }
        
        this.showModalError();
      }
    } else {
      this.submitted = false; // Restablecer submitted a false si el formulario es válido

      this.UsuarioService.postpersona(this.personaForm.value).subscribe({
        next: (res) => {
          this.showModal();
          this.personaForm.reset();
        },
        error: (error) => {
          this.showModalError();
        }
      });
    }
  }
}
