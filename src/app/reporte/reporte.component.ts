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
import { UsuarioService } from 'app/servicios/usuario.service';
import { ImageService } from 'app/servicios/image.service';

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





   usuariosss: any[] = [];
    private listTitles: any[];
       mobile_menu_visible: any = 0;
    private toggleButton: any;
    private sidebarVisible: boolean;
    idPersona: number;

  constructor(location: Location,private imageService:ImageService ,private  CreditosService:CreditosService, private router:Router, private UsuarioService:UsuarioService) { 
    this.getAllusuario();
    this.location = location;
   
  this.usuario= localStorage.getItem('usuario');
  this.id= localStorage.getItem('idPersona'); 
  }
  fecha: Date = new Date();
  ngOnInit(): void {
    this.getAllusuario();
    setInterval(() => {
      this.getAllusuario();
      
    }, 5000);
    this.getAllcreditos();
    this.fecha = new Date();
  }


    //obtener el usuario 
    getAllusuario() {
      this.UsuarioService.buscarUsuario(this.id).subscribe({
        next: (res) => {
          this.dataSource = new MatTableDataSource(res.usuario);
          this.usuariosss = res.usuario;
  
        },
        error: (err) => {
          // Maneja el error de carga de datos aquí
        },
      });
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
  const rows = this.creditosss.map((item, index) => [
    index + 1,
    item.plato.descripcion,
    item.cantidad,
    item.precio,
    item.fecha,
  ]);

  const anchoPagina = 595.28;
  let columnWidths = [30, 145, 80, 80, 120];
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
        { text: 'INFORME DE CRÉDITOS DEL RESTAURANTE', style: 'header', alignment: 'center' },
        '\n',
        {
          table: {
            headerRows: 1,
            widths: columnWidths,
            body: [
              ['Nº', 'Plato', 'Cantidad', 'Precio', 'Fecha'].map((cell, index) => ({
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
    pdfMake.createPdf(documentoPDF).download('INFORME DE CRÉDITOS DEL RESTAURANTE.pdf');
  });
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
