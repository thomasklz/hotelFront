import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'app/servicios/usuario.service';
import { MatTableDataSource } from '@angular/material/table';

import { ElementRef, ViewChild } from "@angular/core";
import * as XLSX from 'xlsx';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
@Component({
  selector: 'app-listadoadministradores',
  templateUrl: './listadoadministradores.component.html',
  styleUrls: ['./listadoadministradores.component.scss']
})
export class ListadoadministradoresComponent implements OnInit {
  @ViewChild("inputDatalist") inputDatalist: ElementRef;

  usuariosss: any[] = [];

  dataSource = new MatTableDataSource<any>();
  constructor(private UsuarioService:UsuarioService) { }

  ngOnInit(): void {
    this.getAllusuarios();
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
      { text: 'Listado de administradores ', style: 'header' },
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
  pdfMake.createPdf(documentoPDF).download('Listado de administradores.pdf');
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
    XLSX.utils.book_append_sheet(wb, ws, 'Listado de administradores');
    const excelArray = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([new Uint8Array(excelArray)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Listado de administradores.xlsx';
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
