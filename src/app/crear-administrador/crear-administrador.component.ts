import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { UsuarioService } from 'app/servicios/usuario.service';
import swal from 'sweetalert';
import swal2 from 'sweetalert';
@Component({
  selector: 'app-crear-administrador',
  templateUrl: './crear-administrador.component.html',
  styleUrls: ['./crear-administrador.component.scss']
})
export class CrearAdministradorComponent implements OnInit {
  loginForm!: FormGroup;
  personaForm!: FormGroup;
  submitted = false;
  dataSource = new MatTableDataSource<any>();
  usuariosss: any[] = [];
  constructor(private UsuarioService: UsuarioService, private router: Router, private formBuilder: FormBuilder, private http: HttpClient) {


  }
  title = 'sweetAlert';

  //Mensaje de alerta de Crear-------
  showModalcrear() {
    swal2({
      title: 'Datos registrados exitosamente',
      icon: 'success',
    });
  }

  showModalErrorcrear() {
    swal({
      title: 'Error en el registro de datos',
      icon: 'error',
    });
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      usuario: new FormControl("", Validators.minLength(3)),
      contrasena: new FormControl("", Validators.minLength(4)),
    });


    this.personaForm = this.formBuilder.group({
      nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      telefono: new FormControl('', [Validators.required, Validators.minLength(10)]),
      foto: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      usuario: new FormControl('', [Validators.required, Validators.minLength(3)]),
      contrasena: new FormControl('', [Validators.required, Validators.minLength(4)]),
    });
  }

  //----Agg persona
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

        this.showModalErrorcrear();
      }
    } else {
      this.submitted = false; // Restablecer submitted a false si el formulario es válido

      this.UsuarioService.postpersona(this.personaForm.value).subscribe({
        next: (res) => {
          this.showModalcrear();
          this.getAllusuarios();
          this.personaForm.reset();
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.showModalErrorcrear();
        }
      });
    }
  }

  //----obtener ususuarios 
  getAllusuarios() {
    this.UsuarioService.getusuario().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.platos);
        this.usuariosss = res.usuarios;
      },
      error: (err) => {
        // alert("Error en la carga de datos");
      },
    });
  }


  cerrar() {
    this.router.navigate(['/login']);
  }

  closeModal() {
    this.personaForm.reset();
  }
}
