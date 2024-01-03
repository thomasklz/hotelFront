import { Component, OnInit } from '@angular/core';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { CreditosService } from 'app/servicios/creditos.service';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

import { ElementRef, ViewChild } from "@angular/core";
import * as XLSX from 'xlsx';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.scss']
})
export class ReporteComponent implements OnInit {
  location: Location;
  creditosss: any[] = [];
  usuario:any;
  id:any;
  dataSource = new MatTableDataSource<any>();
  @ViewChild("inputDatalist") inputDatalist: ElementRef;

  constructor(location: Location, private  CreditosService:CreditosService, private router:Router) { 

    this.location = location;
   
  this.usuario= localStorage.getItem('usuario');
  this.id= localStorage.getItem('idPersona'); 
  }
  fecha: Date = new Date();
  ngOnInit(): void {
    this.getAllcreditos();
    this.fecha = new Date();
  }


  

  getAllcreditos() {
    this.CreditosService.getReporteUsuario(this.id).subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.creditos);
        this.creditosss = res.creditos;
      },
      error: (err) => {
        //alert("Error en la carga de datos");
      },
    });
  }
  generarPDF() {
    const content = document.getElementById('report-content')!;

    // Creamos una nueva instancia de jsPDF
    const pdf = new jsPDF();

    // Convertimos el contenido del reporte a una imagen
    html2canvas(content).then(canvas => {
      const imgData = canvas.toDataURL('image/png');

      // Agregamos la imagen al PDF
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);

      // Descargamos el PDF
      pdf.save('reporte_usuario.pdf');
    });
  }
  calcularTotal() {
    return this.creditosss
      .filter(item => item.pagado === false)
      .reduce((total, item) => total + item.precio, 0);
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
logout() {
    localStorage.removeItem('idPersona');
    localStorage.removeItem('idUsuario');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }




  //-----------------------

descargarPDF() {
  const rows = [];

  // Agregar el encabezado de la tabla
  const headerRow = ['Nº', 'Plato', 'Cantidad', 'Precio', 'Fecha'];
  rows.push(headerRow);

  // Iterar sobre los datos y agregar filas
  this.creditosss.forEach((item, index) => {
    const rowData = [
      index + 1,
      item.plato.descripcion,
      item.cantidad,
      item.precio,
      item.fecha,
     
     
    ];
    rows.push(rowData);
  });

  // Define la estructura del documento PDF
 
  const anchoPagina = 595.28; // Ancho de la página A4 en puntos
  let columnWidths = [30, 145, 80, 80, 120]; // Anchos de las 9 columnas
  const totalWidth = columnWidths.reduce((total, width) => total + width, 0);
  let escala = 1;
  
  if (totalWidth > anchoPagina) {
    escala = anchoPagina / totalWidth;
    columnWidths = columnWidths.map(width => width * escala);
  }
  
  const documentoPDF = {
    content: [
      { text: 'Reporte ', style: 'header' },
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
  pdfMake.createPdf(documentoPDF).download('Reporte.pdf');
}

//-----------------------


  datosParaDescargar: any[] = []; // Variable para almacenar los datos a descargar


  //'''''''''''''''''''''''
  descargarDatos() {
    const datosParaDescargar = this.creditosss.map(item => ({
      'Plato': item.plato.descripcion,
      'Cantidad': item.cantidad,
      'Precio': item.precio,
      'Fecha': item.fecha,
     
      
    }));
   
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosParaDescargar);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
    const excelArray = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([new Uint8Array(excelArray)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Reporte.xlsx';
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
