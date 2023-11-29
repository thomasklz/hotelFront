import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'app/servicios/usuario.service';
import { MatTableDataSource } from '@angular/material/table';
import swal from 'sweetalert';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listado-usuarios',
  templateUrl: './listado-usuarios.component.html',
  styleUrls: ['./listado-usuarios.component.scss']
})
export class ListadoUsuariosComponent implements OnInit {

  usuario: string = '';
  contrasena: string = '';
  usuariosss: any[] = [];

  dataSource = new MatTableDataSource<any>();
  tituloForm;
  usuarioForm!: FormGroup;
  usuarioForm2!: FormGroup;
  editandousuario: boolean = false; // Variable para indicar si se está editando un usuario existente
  idUsuarioEditar: string = ''; // Variable para almacenar el ID del usuario en caso de edición


  showDescripcionError = false; //evitando que se muestren los mensajes de campo requerido 
  showIdTipomenuError = false;//evitando que se muestren los mensajes de campo requerido
  constructor(private http: HttpClient, private UsuarioService: UsuarioService, private router: Router, private formBuilder: FormBuilder) {
    this.getAllusuarios();



    this.usuarioForm = new FormGroup({
      usuario: new FormControl(),

      nombre: new FormControl(),
      email: new FormControl(),
      telefono: new FormControl(),
      foto: new FormControl(),
    });
    this.usuarioForm2 = new FormGroup({
      contrasena: new FormControl(),

    });
  }

  ngOnInit(): void {
  }

  //Modal de Modificacion Notificacion

  showModalEdit() {
    swal({
      title: 'Datos modificado exitosamente',
      icon: "success",
    });
  }


  //Modal de  error de Modificacion Notificacion
  showModalErrorEdit() {
    swal({
      title: 'Error de modificación de datos ',
      icon: "error",
    });
  }



  //Modal de Eliminar Usuario Notificacion
  title = 'sweetAlert';
  showModal() {
    swal({
      title: 'Usuario eliminado exitosamente',
      icon: "success",
    });
  }
  //Modal de error de Eliminar Usuario Notificacion
  showModalError() {
    swal({
      title: 'Error en eliminar usuario',
      icon: "error",
    });
  }

  showModalEliminar(id: number) {
    Swal.fire({
      title: '¿Estás seguro que deseas eliminar este usuario?',
      icon: 'warning',
      showCancelButton: true,

      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#bf0d0d',


    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarusuario(id);
      }
    });
  }

  showModalErrorEliminar() {
    Swal.fire({
      title: 'Error al eliminar el usuario',
      icon: 'error',
    });
  }

  // Variable para controlar el estado del botón y el ícono
  isToggleOn: boolean = false;

  // Función para cambiar el estado y el ícono del botón
  toggleButtonState() {
    this.isToggleOn = !this.isToggleOn;
  }



  
  //obtener todos los usuarios 
  getAllusuarios() {
    this.UsuarioService.getusuario().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.usuarios);
        this.usuariosss = res.usuarios;
        this.totalItems = res.usuariosss.length; 
      },
      error: (err) => {
        // alert("Error en la carga de datos");
      },
    });
  }



    //PAGINATOR------------------------------
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
  
    usuariosssOriginal: any[] = [];
  
    nombreproductoFiltro: string = '';
    filtroSeleccionado: string = ''; 
    //filtrado
    aplicarFiltros() {
      // Aplica los filtros aquí según el valor de filtroSeleccionado
      if (this.filtroSeleccionado === 'nombre') {
        // Aplica el filtro por nombre
        if (this.nombreproductoFiltro) {
          this.usuariosss = this.usuariosssOriginal.filter(item => item.persona.nombre.includes(this.nombreproductoFiltro));
        } else {
          this.usuariosss = [...this.usuariosssOriginal];
        }
        // Limpia el filtro de fecha
       
      }
    }
  editarUsuario(item: any) {
    this.usuarioForm.patchValue({

    });
    this.tituloForm = 'Editar  Menu';
    this.usuarioForm.patchValue({
      usuario: item.usuario,
      nombre: item.persona.nombre,
      email: item.persona.email,
      telefono: item.persona.telefono,
      foto: item.persona.foto

    });
    //this.getId_Tipomenu();
    this.editandousuario = true;
    this.idUsuarioEditar = item.id;
  }


  editcontrasena(item: any) {


    this.editandousuario = true;
    this.idUsuarioEditar = item.id;

    this.usuarioForm2.reset();
  }


  //Para el editar de usuario usando modal
  usuarioedit() {
    const datos = {
      usuario: this.usuarioForm.value.usuario,
      nombre: this.usuarioForm.value.nombre,
      email: this.usuarioForm.value.email,
      telefono: this.usuarioForm.value.telefono,
      foto: this.usuarioForm.value.foto,

    };
    this.UsuarioService.putusuario(datos, this.idUsuarioEditar).subscribe(
      (usuarios) => {
        console.log(usuarios);

        this.showModalEdit();
        this.getAllusuarios();
      },
      (error) => {
        console.log(error);
        this.showModalErrorEdit();
      }
    );

  }

  editarContrasena() {

    const datos = {
      contrasena: this.usuarioForm2.value.contrasena,


    };
    this.UsuarioService.editContrasena(datos, this.idUsuarioEditar).subscribe(
      (contrasena) => {
        console.log(contrasena);
        this.showModalEdit();

      },
      (error) => {
        console.log(error);
        this.showModalErrorEdit();
      }
    );
  }


  eliminarusuario(id: number) {
    this.UsuarioService.deleteusuario(id)
      .subscribe({
        next: (res) => {
          this.showModal();

          this.getAllusuarios();
        },
        error: () => {
          this.showModalError();
        },
      });


      this.UsuarioService.deletepersona(id)
      .subscribe({
        next: (res) => {
          this.showModal();

          this.getAllusuarios();
        },
        error: () => {
          this.showModalError();
        },
      });
  }


  // Restablecer el formulario cuando se cierre el modal
  closeModal() {
    this.usuarioForm.reset();
    this.editandousuario = false;
    this.idUsuarioEditar = '';
  }

}
