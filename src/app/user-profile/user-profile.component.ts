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
  usuarioForm!: FormGroup;
  showMoreOptions: boolean = false;
  selectedOption: any = null;

  tipousuariosss: any[] = [];
  id_tipousuario: string = '';

  toggleShowMoreOptions() {
    this.showMoreOptions = !this.showMoreOptions;
  }




  showIdTipousuarioError: boolean = false;

// ... código ...

selectOption(item: any) {
  this.selectedOption = item;
  this.showMoreOptions = false;

  // Update the form control with the selected option's ID
  this.usuarioForm.get('id_tipousuario')?.setValue(item.id);
  this.showIdTipousuarioError = false;  // Reinicia el error después de seleccionar una opción
}

  getSelectedOptionLabel() {
    return this.selectedOption ? this.selectedOption.tipo : 'Seleccione  ';
  }

  constructor(
    private UsuarioService: UsuarioService,
    private router: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) {
    this.getAllusuarios();

    this.usuarioForm = new FormGroup({
      usuario: new FormControl(),

      nombre: new FormControl(),
      email: new FormControl(),
      telefono: new FormControl(),
      foto: new FormControl(),
    });

  }

  
  
 
  personaForm!: FormGroup;
  usuariosss: any[] = [];
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
    this.getAlltipousuarios();
    this.loadPageData();
    this.personaForm = this.formBuilder.group({
      nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      telefono: new FormControl('', [Validators.required, Validators.minLength(10)]),
      foto: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      usuario: new FormControl('', [Validators.required, Validators.minLength(10)]),
      contrasena: new FormControl('', [Validators.required, Validators.minLength(4)]),
      id_tipousuario: new FormControl(),  // Agregar este campo
/*       id_tipousuario: new FormControl(null, [Validators.required]),  // Agregar este campo
 */

    });
  }


  pageSize = 10;  // Tamaño de la página
  currentPage = 1;  // Página actual
  totalItems = 0;  // Total de elementos

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.pageSize - 1, this.totalItems - 1);
  }

  get pagedMenus(): any[] {
    return this.usuariosss.slice(this.startIndex, this.endIndex + 1);
  }

  // ... otras funciones del componente

  loadPageData() {
    // Lógica para cargar datos de la página actual (no es necesario pasar parámetros a la API)
    this.UsuarioService.getusuario().subscribe({
      next: (res) => {
        this.usuariosss = res.usuarios;
        this.totalItems = res.usuarios.length;  // Actualizar el total de elementos
      },
      error: (err) => {
        console.error(err);
        // Manejo de errores si la llamada a la API falla
      },
    });
  }

  onPageChange(event: number) {
    this.currentPage = event;
  }
  showPassword: boolean = false;

  getId_Tipomenu() {
    this.http
      .get("http://localhost:3000/api/creartipo_usuario?=" + this.id_tipousuario)
      .subscribe((result: any) => {
        this.tipousuariosss = result.usuario;
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
  
      // Agregar el campo id_tipousuario si está seleccionado
      const formValue = this.personaForm.value;
      formValue.id_tipousuario = this.selectedOption?.id;
  
      this.UsuarioService.postpersona(formValue).subscribe({
        next: (res) => {
          this.showModal();
          this.getAllusuarios();
          this.personaForm.reset();
          this.selectedOption = null; // Establecer selectedOption en null después de reiniciar el formulario
        },
        error: (error) => {
          this.showModalError();
        }
      });
    }
  }
  
  
  getAllusuarios() {
    this.UsuarioService.getusuario().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.persona);
        this.usuariosss = res.usuarios;
      },
      error: (err) => {
        // alert("Error en la carga de datos");
      },
    });
  }
  getAlltipousuarios() {
    this.UsuarioService.gettipousuario().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.tipo_usuario);
        this.tipousuariosss = res.tipo_usuario;
      },
      error: (err) => {
        // alert("Error en la carga de datos");
      },
    });
  }

  
}