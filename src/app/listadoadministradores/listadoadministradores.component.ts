import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'app/servicios/usuario.service';
import { MatTableDataSource } from '@angular/material/table';

import { ElementRef, ViewChild } from "@angular/core";
import * as XLSX from 'xlsx';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { ImageService } from 'app/servicios/image.service';
import { saveAs } from 'file-saver';
import { Observable, Observer } from 'rxjs';
import { ExampleTab } from 'app/table-list/table-list.component';
import { FormControl, FormGroup } from '@angular/forms';
import swal from 'sweetalert';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-listadoadministradores',
  templateUrl: './listadoadministradores.component.html',
  styleUrls: ['./listadoadministradores.component.scss']
})
export class ListadoadministradoresComponent implements OnInit {
  @ViewChild("inputDatalist") inputDatalist: ElementRef;

  usuariosss: any[] = [];
  usuariosssV2: any[] = [];

  dataSource = new MatTableDataSource<any>();
  usuarioForm2!: FormGroup;

  constructor(private UsuarioService:UsuarioService, private imageService:ImageService) {
    this.usuarioForm2 = new FormGroup({
      contrasena: new FormControl(),

    });
   }
   idUsuarioEditar: string = ''; // Variable para almacenar el ID del usuario en caso de edición

  ngOnInit(): void {
    this.loadAsyncTabs();
    
    this.getAlllistadoaCajero();
    this.getAllusuarios();
  }

  ideSelectText() {}

  asyncTabs: Observable<ExampleTab[]>;

  loadAsyncTabs() {
    this.asyncTabs = new Observable((observer: Observer<ExampleTab[]>) => {
      observer.next([
        { label: 'Administradores', content: 'Content 1' },
        { label: 'Cajeros', content: 'Content 2' },
      ]);
    });
  }

    //obtener todos los usuarios 
    getAllusuarios() {
      this.UsuarioService.getlistadoadministradores().subscribe({
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

      getAlllistadoaCajero() {
      this.UsuarioService.listadoaCajero().subscribe({
        next: (res) => {
          this.dataSource = new MatTableDataSource(res.usuarios);
          this.usuariosssV2 = res.usuarios;
          this.usuariosssOriginalV2  = [...res.usuarios]; 
          this.totalItemsV2 = res.usuarios.length; 
        },
        error: (err) => {
          // alert("Error en la carga de datos");
        },
      });
    }
    tituloForm;

    editcontrasena(item: any) {


      this.editandousuario = true;
      this.idUsuarioEditar = item.id;
  
      this.usuarioForm2.reset();
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
    editandousuario: boolean = false; // Variable para indicar si se está editando un usuario existente

    usuarioForm!: FormGroup;

    eliminarusuario(id: number) {
      this.UsuarioService.deleteusuario(id)
        .subscribe({
          next: (res) => {
            this.showModal();
  
            this.getAllusuarios();
            this.getAlllistadoaCajero();
            
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
    closeModal() {
      this.usuarioForm.reset();
      this.usuarioForm2.reset();
      this.editandousuario = false;
      this.idUsuarioEditar = '';
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
  usuariosssOriginalV2: any[] = [];

  nombreproductoFiltro: string = '';
  filtroSeleccionado: string = ''; 
  //filtrado
  aplicarFiltros() {
    // Aplica los filtros aquí según el valor de filtroSeleccionado
    if (this.filtroSeleccionado === 'nombre') {
      // Aplica el filtro por nombre
      if (this.nombreproductoFiltro) {
        this.usuariosss = this.usuariosssOriginal.filter(item => item.Identificacion.includes(this.nombreproductoFiltro));
      } else {
        this.usuariosss = [...this.usuariosssOriginal];
      }
      // Limpia el filtro de fecha
     
    }
  }









  
     //PAGINATOR-V2-----------------------------
     pageSizeV2 = 10; // Tamaño de la página
     currentPageV2 = 1; // Página actual
     totalItemsV2 = 0; // Total de elementos
   
     get totalPagesV2(): number {
       return Math.ceil(this.totalItemsV2 / this.pageSizeV2);
     }
   
     get startIndexV2(): number {
       return (this.currentPage - 1) * this.pageSizeV2;
     }
   
     get endIndexV2(): number {
       return Math.min(this.startIndex + this.pageSizeV2 - 1, this.totalItemsV2 - 1);
     }
   
     get pagedMenusV2(): any[] {
       return this.usuariosssV2.slice(this.startIndexV2, this.endIndexV2 + 1);
     }
   
     
     onPageChangeV2(event: number) {
       this.currentPageV2 = event;
     }
   
    
     nombreproductoFiltroV2: string = '';
     filtroSeleccionadoV2: string = ''; 
     //filtrado
     aplicarFiltrosV2() {
       // Aplica los filtros aquí según el valor de filtroSeleccionado
       if (this.filtroSeleccionado === 'nombre') {
         // Aplica el filtro por nombre
         if (this.nombreproductoFiltro) {
           this.usuariosss = this.usuariosssOriginal.filter(item => item.Identificacion.includes(this.nombreproductoFiltro));
         } else {
           this.usuariosss = [...this.usuariosssOriginal];
         }
         // Limpia el filtro de fecha
        
       }
     }
   
   
     
     //-------------------------------------------------Descargar pdf o excel
     
  
  //-------------------------------------------------Descargar pdf o excel
  

//-----------------------

 

descargarPDF() {
  const rows = this.usuariosss.map((item, index) => [
    index + 1,
    item.Identificacion,
    item.persona.Apellido1,
    item.persona.Apellido2,
    item.persona.Nombre1,
    item.persona.Nombre2,
    item.persona.EmailInstitucional,
    item.persona.TelefonoC,
    
    
  ]);

  const anchoPagina = 595.28;
  let columnWidths =  [30,68,55,55, 55, 55, 60, 68 ];
  const totalWidth = columnWidths.reduce((total, width) => total + width, 0);
  let escala = 1;

  if (totalWidth > anchoPagina) {
    escala = anchoPagina / totalWidth;
    columnWidths = columnWidths.map(width => width * escala);
  }

  // Obtener las representaciones en base64 de las imágenes
  Promise.all([this.imageService.getBase64Image(), this.imageService.getBase65Image()]).then(([base64ImageLeft, base65ImageRight]) => {
    const headerTable = {
      table: {
        widths: [120, '*', 120],
        body: [
          [
            { image: base64ImageLeft, width: 80, height: 80, alignment: 'left' },
            { text: 'ESCUELA SUPERIOR POLITÉCNICA AGROPECUARIA DE MANABÍ MANUEL FÉLIX LÓPEZ', style: 'header', alignment: 'center', fontSize: 16 },
            { image: base65ImageRight, width: 80, height: 80, alignment: 'right' },
          ],
          [
            {},
            { text: 'Hotel Higuerón', style: 'subheader', alignment: 'center' },
            {},
          ],
        ],
      },
      layout: 'noBorders',
    };

    const documentoPDF = {
      content: [
        headerTable,
        '\n\n',
        { text: 'INFORME DE ADMINISTRADORES', style: 'header', alignment: 'center' },
        '\n',
        {
          table: {
            headerRows: 1,
            widths: columnWidths,
            body: [

              ['Nº', 'Usuario', 'Apellido1',  'Apellido2', 'Nombre1', 'Nombre2','Email', 'Teléfono' ].map((cell, index) => ({
                text: cell,
                bold: true,
                fillColor: '#D3D3D3',
              })),
              ...rows.map(row => row.map(cell => ({ text: cell }))),
            ],
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          font: 'Roboto',
          bold: true,
        },
        subheader: {
          fontSize: 14,
          font: 'Roboto',
        },
      },
    };

    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.createPdf(documentoPDF).download('INFORME DE ADMINISTRADORES.pdf');
  });
}



descargarPDFCajero() {
  const rows = this.usuariosssV2.map((item, index) => [
    index + 1,
    item.Identificacion,
    item.persona.Apellido1,
    item.persona.Apellido2,
    item.persona.Nombre1,
    item.persona.Nombre2,
    item.persona.EmailInstitucional,
    item.persona.TelefonoC,
    
    
  ]);

  const anchoPagina = 595.28;
  let columnWidths =  [30,68,55,55, 55, 55, 60, 68 ];
  const totalWidth = columnWidths.reduce((total, width) => total + width, 0);
  let escala = 1;

  if (totalWidth > anchoPagina) {
    escala = anchoPagina / totalWidth;
    columnWidths = columnWidths.map(width => width * escala);
  }

  // Obtener las representaciones en base64 de las imágenes
  Promise.all([this.imageService.getBase64Image(), this.imageService.getBase65Image()]).then(([base64ImageLeft, base65ImageRight]) => {
    const headerTable = {
      table: {
        widths: [120, '*', 120],
        body: [
          [
            { image: base64ImageLeft, width: 80, height: 80, alignment: 'left' },
            { text: 'ESCUELA SUPERIOR POLITÉCNICA AGROPECUARIA DE MANABÍ MANUEL FÉLIX LÓPEZ', style: 'header', alignment: 'center', fontSize: 16 },
            { image: base65ImageRight, width: 80, height: 80, alignment: 'right' },
          ],
          [
            {},
            { text: 'Hotel Higuerón', style: 'subheader', alignment: 'center' },
            {},
          ],
        ],
      },
      layout: 'noBorders',
    };

    const documentoPDF = {
      content: [
        headerTable,
        '\n\n',
        { text: 'INFORME DE CAJEROS', style: 'header', alignment: 'center' },
        '\n',
        {
          table: {
            headerRows: 1,
            widths: columnWidths,
            body: [

              ['Nº', 'Usuario', 'Apellido1',  'Apellido2', 'Nombre1', 'Nombre2','Email', 'Teléfono' ].map((cell, index) => ({
                text: cell,
                bold: true,
                fillColor: '#D3D3D3',
              })),
              ...rows.map(row => row.map(cell => ({ text: cell }))),
            ],
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          font: 'Roboto',
          bold: true,
        },
        subheader: {
          fontSize: 14,
          font: 'Roboto',
        },
      },
    };

    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.createPdf(documentoPDF).download('INFORME DE CAJEROS.pdf');
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
      this.getAlllistadoaCajero();
    }
  });
}



//-----------------------


  datosParaDescargar: any[] = []; // Variable para almacenar los datos a descargar


  //'''''''''''''''''''''''
  descargarDatos() {
    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Listado de administradores');
    
    // Organizar créditos por persona
    const creditosPorPersona = {};
    
   
    
    // Agregar encabezados de la tabla
    const headers = [
      'Usuario',
      'Apellido1' ,
      'Apellido2' ,
      'Nombre1' ,
      'Nombre2' ,
      'Email' ,
      'Teléfono' ,
    ];
    
    worksheet.addRow(headers);
    worksheet.getRow(worksheet.lastRow.number).font = { bold: true }; // Negrita para encabezado
    
    // Establecer estilos para encabezados
    worksheet.getRow(worksheet.lastRow.number).eachCell(cell => {
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD3D3D3' } }; // Fondo gris (plomo)
    });
    
    // Agregar datos a la hoja de cálculo
    this.usuariosss.forEach((item, index) => {
    const rowData = [
     item.Identificacion,
     item.persona.Apellido1,
     item.persona.Apellido2,
     item.persona.Nombre1,
     item.persona.Nombre2,
     item.persona.EmailInstitucional,
     item.persona.TelefonoC,
    ];
    
    worksheet.addRow(rowData);
    });
    
    // Establecer estilos para datos
    for (let i = worksheet.lastRow.number - this.usuariosss.length + 1; i <= worksheet.lastRow.number; i++) {
    worksheet.getRow(i).eachCell(cell => {
        cell.font = { bold: false }; // No negrita para datos
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });
    }
    
    // Establecer ancho de columnas
    worksheet.columns.forEach(column => {
    let maxLength = 0;
    column.eachCell({ includeEmpty: true }, cell => {
        const length = cell.value ? cell.value.toString().length : 10;
        if (length > maxLength) {
            maxLength = length;
        }
    });
    column.width = maxLength < 10 ? 10 : maxLength;
    });
    
    // Guardar el libro de trabajo
    workbook.xlsx.writeBuffer().then(buffer => {
    saveAs(new Blob([buffer]), 'Listado de administradores.xlsx');
    });
    }
   

    descargarDatosCajero() {
      const ExcelJS = require('exceljs');
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Listado de cajeros');
      
      // Organizar créditos por persona
      const creditosPorPersona = {};
      
     
      
      // Agregar encabezados de la tabla
      const headers = [
        'Usuario',
        'Apellido1' ,
        'Apellido2' ,
        'Nombre1' ,
        'Nombre2' ,
        'Email' ,
        'Teléfono' ,
      ];
      
      worksheet.addRow(headers);
      worksheet.getRow(worksheet.lastRow.number).font = { bold: true }; // Negrita para encabezado
      
      // Establecer estilos para encabezados
      worksheet.getRow(worksheet.lastRow.number).eachCell(cell => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD3D3D3' } }; // Fondo gris (plomo)
      });
      
      // Agregar datos a la hoja de cálculo
      this.usuariosssV2.forEach((item, index) => {
      const rowData = [
       item.Identificacion,
       item.persona.Apellido1,
       item.persona.Apellido2,
       item.persona.Nombre1,
       item.persona.Nombre2,
       item.persona.EmailInstitucional,
       item.persona.TelefonoC,
      ];
      
      worksheet.addRow(rowData);
      });
      
      // Establecer estilos para datos
      for (let i = worksheet.lastRow.number - this.usuariosss.length + 1; i <= worksheet.lastRow.number; i++) {
      worksheet.getRow(i).eachCell(cell => {
          cell.font = { bold: false }; // No negrita para datos
          cell.alignment = { vertical: 'middle', horizontal: 'left' };
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });
      }
      
      // Establecer ancho de columnas
      worksheet.columns.forEach(column => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, cell => {
          const length = cell.value ? cell.value.toString().length : 10;
          if (length > maxLength) {
              maxLength = length;
          }
      });
      column.width = maxLength < 10 ? 10 : maxLength;
      });
      
      // Guardar el libro de trabajo
      workbook.xlsx.writeBuffer().then(buffer => {
      saveAs(new Blob([buffer]), 'Listado de cajeros.xlsx');
      });
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
