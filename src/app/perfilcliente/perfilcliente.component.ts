import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'app/servicios/usuario.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import swal from 'sweetalert';
import swal2 from 'sweetalert';
import { ViewChild } from '@angular/core';
import { interval } from 'rxjs';


import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { CreditosService } from 'app/servicios/creditos.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
@Component({
  selector: 'app-perfilcliente',
  templateUrl: './perfilcliente.component.html',
  styleUrls: ['./perfilcliente.component.scss']
})
export class PerfilclienteComponent implements OnInit {

  dataSource = new MatTableDataSource<any>();
  usuariosss: any[] = [];
  idUsuario: number;
  usuarioForm!: FormGroup;
  location: Location;
  usuario:any;
  id:any;
  private intervalSubscription: any;

  constructor(location: Location,private UsuarioService: UsuarioService, private http: HttpClient, private router: Router, private formBuilder: FormBuilder) {
    this.idUsuario = +localStorage.getItem('idUsuario');

    this.getAllusuario();

    this.location = location;
   
    this.usuario= localStorage.getItem('usuario');
    this.id= localStorage.getItem('idPersona'); 

  }


  ngOnInit(): void {
    this.getAllusuario();
    this.usuarioForm = this.formBuilder.group({
      usuario: new FormControl("", [Validators.required, Validators.minLength(3)]),
      nombre: new FormControl("", [Validators.required, Validators.maxLength(1)]),
      email: new FormControl("", [Validators.required, Validators.maxLength(1)]),
      telefono: new FormControl("", [Validators.required, Validators.maxLength(1)]),
      contrasena: new FormControl("", [Validators.required, Validators.maxLength(1)]),
      foto: new FormControl("", [Validators.required, Validators.maxLength(1)]),
    });
    // Realizar actualizaciones cada 5 segundos (ajusta el tiempo según tus necesidades)
    this.intervalSubscription = interval(100).subscribe(() => {
      this.getAllusuario();
    });
  }
  ngOnDestroy(): void {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }


  editandox: boolean = false; // Variable para indicar si se está editando un usuario existente
  idEditar: string = ''; // Variable para almacenar el ID del usuario en caso de edición
  showDescripcionError = false; //evitando que se muestren los mensajes de campo requerido 
  showIdTipomenuError = false;//evitando que se muestren los mensajes de campo requerido 


  //-----------------------------------------Obtener----los---datos----en--la---Modal----------------------------------------------------
  editarusuario(item: any) {

    this.usuarioForm.patchValue({
      usuario: item.usuario
    });
    this.editandox = true;
    this.idEditar = item.id;

    // Establecer variables a false al editar
    this.showDescripcionError = false;
    this.showIdTipomenuError = false;
  }

  editarcontrasena(item: any) {

    // Establecer variables a false al editar
    this.showDescripcionError = false;
    this.showIdTipomenuError = false;
    this.usuarioForm.reset();
  }


  editarnombre(item: any) {

    this.usuarioForm.patchValue({
      nombre: item.persona.nombre
    });

    this.editandox = true;
    this.idEditar = item.id;

    // Establecer variables a false al editar
    this.showDescripcionError = false;
    this.showIdTipomenuError = false;
  }
  editaremail(item: any) {

    this.usuarioForm.patchValue({
      email: item.persona.email
    });

    this.editandox = true;
    this.idEditar = item.id;

    // Establecer variables a false al editar
    this.showDescripcionError = false;
    this.showIdTipomenuError = false;
  }
  editartelefono(item: any) {

    this.usuarioForm.patchValue({
      telefono: item.persona.telefono
    });

    this.editandox = true;
    this.idEditar = item.id;

    // Establecer variables a false al editar
    this.showDescripcionError = false;
    this.showIdTipomenuError = false;
  }

  editarfoto(item: any) {

    this.usuarioForm.patchValue({
      foto: item.persona.foto
    });

    this.editandox = true;
    this.idEditar = item.id;

    // Establecer variables a false al editar
    this.showDescripcionError = false;
    this.showIdTipomenuError = false;
  }


  //Modal de Modificacion Notificacion
  showModalEdit() {
    swal2({
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

  //obtener el usuario 
  getAllusuario() {
    this.UsuarioService.buscarUsuario(this.idUsuario).subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.usuario);
        this.usuariosss = res.usuario;

      },
      error: (err) => {
        // Maneja el error de carga de datos aquí
      },
    });
  }
  //------------------------------------------------------Metodos--de----Editar----------------------------------------------------------------------------------------------
  //editar usuario
  editarUsuario() {

    const datos = {
      usuario: this.usuarioForm.value.usuario

    };
    this.UsuarioService.editUsuario(datos, this.idUsuario).subscribe(
      (usuario) => {
        console.log(usuario);
        this.showModalEdit();

      },
      (error) => {
        console.log(error);
        this.showModalErrorEdit();
      }
    );
  }
  //editar nombre
  editarNombre() {

    const datos = {
      nombre: this.usuarioForm.value.nombre

    };
    this.UsuarioService.editNombre(datos, this.idUsuario).subscribe(
      (nombre) => {
        console.log(nombre);
        this.showModalEdit();

      },
      (error) => {
        console.log(error);
        this.showModalErrorEdit();
      }
    );
  }

  //editar email
  editarEmail() {

    const datos = {
      email: this.usuarioForm.value.email

    };
    this.UsuarioService.editEmail(datos, this.idUsuario).subscribe(
      (email) => {
        console.log(email);
        this.showModalEdit();

      },
      (error) => {
        console.log(error);
        this.showModalErrorEdit();
      }
    );
  }

  //editar telefono
  editarTelefono() {

    const datos = {
      telefono: this.usuarioForm.value.telefono

    };
    this.UsuarioService.editTelefono(datos, this.idUsuario).subscribe(
      (telefono) => {
        console.log(telefono);
        this.showModalEdit();

      },
      (error) => {
        console.log(error);
        this.showModalErrorEdit();
      }
    );
  }

  //editar contraena
  editarContrasena() {

    const datos = {
      contrasena: this.usuarioForm.value.contrasena,


    };
    this.UsuarioService.editContrasena(datos, this.idUsuario).subscribe(
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


  //editar FOTO
  editarFoto() {

    const datos = {
      foto: this.usuarioForm.value.foto

    };
    this.UsuarioService.editFoto(datos, this.idUsuario).subscribe(
      (foto) => {
        console.log(foto);
        this.showModalEdit();

      },
      (error) => {
        console.log(error);
        this.showModalErrorEdit();
      }
    );
  }


  // Restablecer el formulario cuando se cierre el modal
  closeModal() {
    this.usuarioForm.reset();
    // this.editandoPlato = false;
    //   this.idPlatoEditar = '';
  }

  logout() {
    localStorage.removeItem('idPersona');
    localStorage.removeItem('idUsuario');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }
  showModalcerrar() {
    Swal.fire({
      title: '¿Estás seguro que deseas cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
     
      confirmButtonText: 'Sí, cerrar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#bf0d0d',
      
      
    }).then((result) => {
      if (result.isConfirmed) {
        this.logout();
      }
    });
  }

}
