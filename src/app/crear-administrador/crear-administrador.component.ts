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
  showPassword: boolean = false;

  constructor(private UsuarioService: UsuarioService, private router: Router, private formBuilder: FormBuilder, private http: HttpClient) {


  }
  title = 'sweetAlert';
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
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
       
 
      Nombre1: new FormControl("", [  Validators.required,Validators.minLength(3)]),
      Nombre2: new FormControl("", [  Validators.required,Validators.minLength(3)]),
      Apellido1: new FormControl("", [  Validators.required,Validators.minLength(3)]),
      Apellido2: new FormControl("", [  Validators.required,Validators.minLength(3)]),
      TelefonoC: new FormControl("", [  Validators.required,Validators.minLength(10)]),
      EmailInstitucional: new FormControl('', [Validators.required, ]),
    
      identificacion: new FormControl(),
    
      Identificacion: new FormControl("", [  Validators.required,Validators.minLength(10)]),
      contrasena: new FormControl('', [Validators.required, Validators.minLength(4)]),
      id_tipousuario: new FormControl(),  // Agregar este campo
     
    });
  }



  
  identificacion:string;

  
 
  
  BuscarCedula() {
    this.identificacion = this.personaForm.get('identificacion')?.value;
  
    if (this.identificacion) {
      this.UsuarioService.cedula(this.identificacion).subscribe(
        (result: any) => {
          console.log("Respuesta del servicio:", result);
  
          // Verificar que 'data' existe y contiene información
          if (result.data && result.data.Identificacion) {
            // Asigna los valores a los controles del formulario
            this.personaForm.patchValue({
              Nombre1: result.data.Nombre1 || '',
              Nombre2: result.data.Nombre2 || '',
              Apellido1: result.data.Apellido1 || '',
              Apellido2: result.data.Apellido2 || '',
              EmailInstitucional: result.data.EmailInstitucional || '',
              TelefonoC: result.data.TelefonoC || '',
              Identificacion: result.data.Identificacion || ''
            });
  
            const identificacion = this.personaForm.get('Identificacion')?.value;
            const defaultPassword = identificacion + 'ESPAM';
            this.personaForm.get('contrasena')?.setValue(defaultPassword);
          } else {
            this.showModalErrorCI();
            // Puedes mostrar un mensaje de error o tomar otras acciones necesarias.
          }
        },
        (error) => {
          console.log("Error al obtener los datos", error);
          
          // Manejar el error y mostrar un mensaje adecuado
          if (error.status === 404) {
            this.showModalErrorCI();
            // Aquí puedes mostrar un mensaje de error en tu interfaz de usuario o tomar otras acciones necesarias.
          }
        }
      );
    } else {
     this.showModalErrorCInull();
    }
  }
  


  showModalErrorCInull() {
    swal({
      title: 'La identificación no tiene un valor',
      icon: 'warning',
    });
  }
  
  showModalErrorCI() {
    swal({
      title: 'No existe ese número de cédula',
      icon: 'error',
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
