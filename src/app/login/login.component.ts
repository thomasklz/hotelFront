import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { UsuarioService } from 'app/servicios/usuario.service';
import swal from 'sweetalert';
import swal2 from 'sweetalert';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  personaForm!: FormGroup;
  submitted = false;
  dataSource = new MatTableDataSource<any>();
  usuariosss: any[] = [];
  hayUsuarios: boolean = false;

  constructor(
    private UsuarioService: UsuarioService,
    private router: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) { }

  title = 'sweetAlert';

  showModal() {
    swal2({
      title: 'Inicio de sesión exitoso',
      icon: 'success',
    });
  }

  showModalError() {
    swal({
      title: 'Error de incio sesión, el usuario o la contraseña no es el correcto ',
      icon: 'error',
    });
  }
  showModalErrorr() {
    swal({
      title: 'Error de incio sesión, campos vacíos ',
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

    this.getAllusuarios(); // Obtener usuarios al iniciar el componente
  }

  /* login() {
    if (this.loginForm.valid) {
      this.UsuarioService.iniciarSesion(this.loginForm.value).subscribe({
        next: (res) => {
          localStorage.setItem('idPersona', res.idPersona);
          localStorage.setItem('idUsuario', res.idUsuario);
          localStorage.setItem('usuario', res.usuario);
          localStorage.setItem('contrasena', res.contrasena);
          localStorage.setItem('id_tipousuario', res.id_tipousuario);
          this.showModal();
          this.loginForm.reset();
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.showModalError();
        }
      });
    } else {
      this.showModalErrorr();
    }
  }
 */


  login() {
    if (this.loginForm.valid) {
      this.UsuarioService.iniciarSesion(this.loginForm.value).subscribe({
        next: (res) => {
          // Guardar datos en el almacenamiento local
          localStorage.setItem('idPersona', res.idPersona);
          localStorage.setItem('idUsuario', res.idUsuario);
          localStorage.setItem('usuario', res.usuario);
          localStorage.setItem('contrasena', res.contrasena);
          localStorage.setItem('id_tipousuario', res.id_tipousuario);
  
          // Mostrar el modal
          this.showModal();
  
          // Reiniciar el formulario
          this.loginForm.reset();
  
          // Redireccionar según el tipo de usuario
          if (res.id_tipousuario === 1) {
            // Redireccionar a las rutas específicas para id_tipousuario igual a 1
            this.router.navigate(['/dashboard']);
          } else {
            // Redireccionar a las rutas generales para otros tipos de usuarios
            this.router.navigate(['/reporte']);
          }
        },
        error: (error) => {
          this.showModalError();
        }
      });
    } else {
      this.showModalErrorr();
    }
  }
  
  crearUsuario() {
    this.router.navigate(['/crearAdministrador']);
  }

  getAllusuarios() {
    this.UsuarioService.getusua().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.usuarios);
        this.usuariosss = res.usuarios;
        this.hayUsuarios = this.usuariosss.length > 0;
      },
      error: (err) => {
        // alert("Error en la carga de datos");
      },
    });
  }

  closeModal() {
    this.personaForm.reset();
  }
}
