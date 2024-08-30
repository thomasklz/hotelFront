import { Component, OnInit } from '@angular/core';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { CreditosService } from 'app/servicios/creditos.service';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { NavigationEnd, Router } from '@angular/router';

import { ElementRef, ViewChild } from "@angular/core";
import * as XLSX from 'xlsx';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { UsuarioService } from 'app/servicios/usuario.service';
import { ImageService } from 'app/servicios/image.service';
import { saveAs } from 'file-saver';





declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
 
  { path: '/editarperfilcajero', title: ' Configuración y privacidad',  icon:'settings', class: '' },

  
 
   { path: '/login', title: ' Cerrar sesión',  icon:'exit_to_app', class: '' },
     
  
  
];


  
@Component({
  selector: 'app-perfilcajero',
  templateUrl: './perfilcajero.component.html',
  styleUrls: ['./perfilcajero.component.scss']
})
export class PerfilcajeroComponent implements OnInit {

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

  constructor(location: Location,private imageService:ImageService ,private element: ElementRef,private  CreditosService:CreditosService, private router:Router, private UsuarioService:UsuarioService) { 
    this.currentRoute = this.router.url;
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



    this.listTitles = ROUTES.filter(listTitle => listTitle);
    const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
    this.router.events.subscribe((event) => {
      this.sidebarClose();
       var $layer: any = document.getElementsByClassName('close-layer')[0];
       if ($layer) {
         $layer.remove();
         this.mobile_menu_visible = 0;
       }
   });




  

    ///
    this.menuItems = ROUTES.filter(menuItem => menuItem);

      
    this.router.events.subscribe(event => {
          
     
      if (event instanceof NavigationEnd) {
              
             
      
       
      this.currentRoute = this.router.url;
            }
          });
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
      .reduce((total, item) => total + item.precio_final, 0);
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

 


  isMaps(path){
    var titlee = this.location.prepareExternalUrl(this.location.path());
    titlee = titlee.slice( 1 );
    if(path == titlee){
        return false;
    }
    else {
        return true;
    }
}

  descargarPDF() {
    const rows = this.creditosss.map((item, index) => [
      index + 1,
      item.plato.descripcion,
      item.precio,
      item.cantidad,
      item.precio_final,
      item.fecha,
    ]);
  
    const anchoPagina = 595.28;
    let columnWidths = [30, 145, 60, 60, 70, 90];
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
  
      // Encabezados adicionales
      const ingredientHeaders = {
        table: {
          widths: ['*', '*', '*', '*', '*'],
          body: [
            [
              { text: `Total a pagar: ${this.calcularTotal()}`, bold: true, fillColor: '#D3D3D3', border: [true, true, true, true] },
            ],
          ],
        },
        layout: {
          fillColor: function (rowIndex: number, node: any, columnIndex: number) {
            return (rowIndex === 0) ? '#D3D3D3' : null;
          },
        },
        margin: [0, 10, 0, 10], // Margen entre encabezados y tabla
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
                ['Nº', 'Plato', 'Precio', 'Cantidad', 'Precio final', 'Fecha'].map((cell, index) => ({
                  text: cell,
                  bold: true,
                  fillColor: '#D3D3D3',
                })),
                ...rows.map(row => row.map(cell => ({ text: cell }))),
              ],
            },
          },
          ingredientHeaders // Añadimos los encabezados adicionales aquí
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


 

  navigateToRoute(path: string) {
    this.router.navigate([path]);
  }

  async descargarDatos() {
    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('INFORME DE REPORTE CRÉDITO');
  
    // Agregar encabezados de la tabla
    const headers = [
      'Nº',
      'Plato',
      'Cantidad',
      'Precio',
      'Fecha'
    ];
  
    worksheet.addRow(headers);
    const headerRow = worksheet.getRow(worksheet.lastRow.number);
    headerRow.font = { bold: true }; // Negrita para encabezado
    headerRow.eachCell(cell => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD3D3D3' } }; // Fondo gris (plomo)
    });
  
    // Agregar datos a la hoja de cálculo
    this.creditosss.forEach((item, index) => {
      const rowData = [
        index + 1,
        item.plato.descripcion,
        item.cantidad,
        item.precio,
        item.fecha,
      ];
      worksheet.addRow(rowData);
    });
  
    // Agregar fila del total
    const totalRowData = [
      
      'Total a pagar:',
      this.calcularTotal()
    ];
    worksheet.addRow(totalRowData);
  
    // Establecer estilos para datos
    for (let i = 2; i <= worksheet.lastRow.number; i++) {
      const row = worksheet.getRow(i);
      row.eachCell(cell => {
        cell.font = { bold: i === worksheet.lastRow.number }; // Negrita para la fila del total
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });
    }
  
    // Establecer ancho de columnas
    worksheet.getColumn(1).width = 5; // Set fixed width for "Nº" column
    worksheet.getColumn(2).width = 30; // Set fixed width for "Plato" column
  
    worksheet.columns.forEach((column, index) => {
      if (index > 1) { // Adjust width for other columns
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, cell => {
          const length = cell.value ? cell.value.toString().length : 10;
          if (length > maxLength) {
            maxLength = length;
          }
        });
        column.width = maxLength < 10 ? 10 : maxLength;
      }
    });
  
    // Guardar el libro de trabajo
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'INFORME DE REPORTE CRÉDITO.xlsx');
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
  
  
































  menuItems: any[];
  currentRoute: string;
 
  
  
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };

  // Function to check if a route is the current active route
  
 
isActiveRoute(route: string): boolean {
    
    
return this.currentRoute === route;
  }
  



  
  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const body = document.getElementsByTagName('body')[0];
    setTimeout(function(){
        toggleButton.classList.add('toggled');
    }, 500);

    body.classList.add('nav-open');

    this.sidebarVisible = true;
};
sidebarClose() {
    const body = document.getElementsByTagName('body')[0];
    this.toggleButton.classList.remove('toggled');
    this.sidebarVisible = false;
    body.classList.remove('nav-open');
};


  sidebarToggle() {
    // const toggleButton = this.toggleButton;
    // const body = document.getElementsByTagName('body')[0];
    var $toggle = document.getElementsByClassName('navbar-toggler')[0];

    if (this.sidebarVisible === false) {
        this.sidebarOpen();
    } else {
        this.sidebarClose();
    }
    const body = document.getElementsByTagName('body')[0];

    if (this.mobile_menu_visible == 1) {
        // $('html').removeClass('nav-open');
        body.classList.remove('nav-open');
        if ($layer) {
            $layer.remove();
        }
        setTimeout(function() {
            $toggle.classList.remove('toggled');
        }, 400);

        this.mobile_menu_visible = 0;
    } else {
        setTimeout(function() {
            $toggle.classList.add('toggled');
        }, 430);

        var $layer = document.createElement('div');
        $layer.setAttribute('class', 'close-layer');


        if (body.querySelectorAll('.main-panel')) {
            document.getElementsByClassName('main-panel')[0].appendChild($layer);
        }else if (body.classList.contains('off-canvas-sidebar')) {
            document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
        }

        setTimeout(function() {
            $layer.classList.add('visible');
        }, 100);

        $layer.onclick = function() { //asign a function
          body.classList.remove('nav-open');
          this.mobile_menu_visible = 0;
          $layer.classList.remove('visible');
          setTimeout(function() {
              $layer.remove();
              $toggle.classList.remove('toggled');
          }, 400);
        }.bind(this);

        body.classList.add('nav-open');
        this.mobile_menu_visible = 1;

    }
}
  
}
