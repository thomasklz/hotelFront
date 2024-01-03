import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'app/servicios/usuario.service';
import { MatTableDataSource } from '@angular/material/table';
import swal from 'sweetalert';
import Swal from 'sweetalert2';

import { NgZone } from "@angular/core";
import { ElementRef, ViewChild } from "@angular/core";
import * as XLSX from 'xlsx';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
@Component({
  selector: 'app-listado-usuarios',
  templateUrl: './listado-usuarios.component.html',
  styleUrls: ['./listado-usuarios.component.scss']
})
export class ListadoUsuariosComponent implements OnInit {
  @ViewChild("inputDatalist") inputDatalist: ElementRef;
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




//---------------------MODALES--------------------------------------------------------------------
//Modal datos modificadamente
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


//Modal de cambiar el estado de este usuario Notificacion
  showModalCambiarEstado(id: number) {
    Swal.fire({
      title: '¿Estás seguro que deseas cambiar el estado de este usuario?',
      icon: 'warning',
      showCancelButton: true,

      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#bf0d0d',


    }).then((result) => {
      if (result.isConfirmed) {
        this.cambiarestadousuario(id);
      }
    });
  }

 //Modal de elimanar el estado de este usuario Notificacion
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


//--------------------------------------------------------------------------------------------------------
   //obtener todos los usuarios
   getAllusuarios() {
    this.UsuarioService.getusuario().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.usuarios);
        this.usuariosss = res.usuarios;
        this.usuariosssOriginal = [...res.usuarios]; 
        this.totalItems = res.usuarios.length; 
      },
      error: (err) => {
        //alert("Error en la carga de datos");
      },
    });
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


  cambiarestadousuario(item) {
    const newEstado = item.persona.estado === 1 ? 0 : 1; // Toggle the state (1 to 0 and 0 to 1)
  
    // Call the service to update the estado
    this.UsuarioService.cambiarestadousuario({ estado: newEstado }, item.id).subscribe(
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
  
  // Restablecer el formulario cuando se cierre el modal
  closeModal() {
    this.usuarioForm.reset();
    this.editandousuario = false;
    this.idUsuarioEditar = '';
  }


  //-------------------------------------------------Descargar pdf o excel
  

//-----------------------

descargarPDF() {
  const rows = [];

  // Agregar el encabezado de la tabla
  const headerRow = ['Nº', 'Usuario', 'Nombres', 'Email', 'Teléfono', 'Foto'];
  rows.push(headerRow);

  // Iterar sobre los datos y agregar filas
  this.usuariosss.forEach((item, index) => {
    const rowData = [
      index + 1,
      item.usuario,
      item.persona.nombre,
      item.persona.email,
      item.persona.telefono,
      item.persona.foto,
      
     
    ];
    rows.push(rowData);
  });

  // Define la estructura del documento PDF
 
  const anchoPagina = 595.28; // Ancho de la página A4 en puntos
  let columnWidths = [30, 70, 80, 120, 80, 70]; // Anchos de las 9 columnas
  const totalWidth = columnWidths.reduce((total, width) => total + width, 0);
  let escala = 1;
  
  if (totalWidth > anchoPagina) {
    escala = anchoPagina / totalWidth;
    columnWidths = columnWidths.map(width => width * escala);
  }
  
  const documentoPDF = {
    content: [
      { text: 'Listado de Clientes ', style: 'header' },
      '\n',
      {
        table: {
          headerRows: 1,
          widths: columnWidths,
          body: rows,
        }
      }
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: 'center',
        margin: [20, 0, 0, 20]
      }
    }
  };
  
  

  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  pdfMake.createPdf(documentoPDF).download('Listado de clientes.pdf');
}

//-----------------------


  datosParaDescargar: any[] = []; // Variable para almacenar los datos a descargar


  //'''''''''''''''''''''''
  descargarDatos() {
    const datosParaDescargar = this.usuariosss.map(item => ({
      'Usuario': item.usuario,
      'Nombres': item.persona.nombre,
      'Email': item.persona.email,
      'Teléfono': item.persona.telefono,
      'Foto': item.persona.foto,
      
    }));
   
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosParaDescargar);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Listado de clientes');
    const excelArray = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([new Uint8Array(excelArray)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Listado de clientes.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  }
  


  
  // Función para convertir datos binarios en un array
  s2ab(s: string): Uint8Array {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i) & 0xFF;
    }
    return new Uint8Array(buf);
  }
  
  
  
  

}
