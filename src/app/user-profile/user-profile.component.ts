import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { UsuarioService } from 'app/servicios/usuario.service';
import swal from 'sweetalert';
import swal2 from 'sweetalert';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


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
    identificacion: new FormControl(),

      nombre: new FormControl(),
      email: new FormControl(),
      telefono: new FormControl(),
       

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
    this.getAllusuarios();
    

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
      id_tipousuario: new FormControl(),  //       id_tipousuario: new FormControl('', [Validators.required, ]),  // Agregar este campo

     
    });

     
 
  }

  identificacion:string;

  
 // ... Otro código del componente ...

isIdTipousuarioInvalid(): boolean {
  const control = this.personaForm.get('id_tipousuario');
  return control?.invalid && (control?.touched || this.submitted);
}

// ... Otro código del componente ...

  
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
            this.showModalErrorCI ();   
            // Puedes mostrar un mensaje de error o tomar otras acciones necesarias.
          }
        },
        (error) => {
          console.log("Error al obtener los datos", error);
          
          // Manejar el error y mostrar un mensaje adecuado
          if (error.status === 404) {
            this.showModalErrorCI ();           // Aquí puedes mostrar un mensaje de error en tu interfaz de usuario o tomar otras acciones necesarias.
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
  
  


  pageSize = 10; // Tamaño de la página
  currentPage = 1; // Página actual
  totalItems = 0; // Total de elementos

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

  
  onPageChange(event: number) {
    this.currentPage = event;
  }
  // ... otras funciones del componente

 
  usuariosssOriginal: any[] = [];

  getAllusuarios() {
    this.UsuarioService.listados().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.usuarios);
        this.usuariosss = res.usuarios;
        this.usuariosssOriginal = [...res.usuarios]; 
        this.totalItems = res.usuarios.length; 
      },
      error: (err) => {
        // alert("Error en la carga de datos");
      },
    });
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
          this.selectedOption = null;
        },
        error: (error) => {
          console.error("Error al agregar persona:", error);
          this.showModalError();
        }
      });
    }
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