import { Component, OnInit } from '@angular/core';

import {  FormBuilder,  FormControl,  FormGroup,  Validators, } from "@angular/forms";

import { MatTableDataSource } from "@angular/material/table";
import { Console } from "console";
import * as XLSX from 'xlsx';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as FileSaver from 'file-saver';
import swal from "sweetalert";
import { MenuService } from 'app/servicios/menu.service';
import { CreditosService } from 'app/servicios/creditos.service';
import { ImageService } from 'app/servicios/image.service';
import { saveAs } from 'file-saver';
import { Observable, Observer } from 'rxjs';
import { ExampleTab } from 'app/table-list/table-list.component';

@Component({
  selector: 'app-reporteingresos',
  templateUrl: './reporteingresos.component.html',
  styleUrls: ['./reporteingresos.component.scss']
})
export class ReporteingresosComponent implements OnInit {
  platosss: any[] = [];
  reportesss: any[] = [];

  reportesssV2: any[] = [];


  dataSource = new MatTableDataSource<any>();
  idPlato: string = "";
  fechaSeleccionada: string | null = null;
  fechaSeleccionadaV2: string | null = null;

  reporteForm!: FormGroup;

  constructor(private CreditosService:CreditosService,private formBuilder:FormBuilder, private MenuService :MenuService, private imageService:ImageService) { }

  ngOnInit(): void {
    this.getAlldescripcionplatos();
    this.loadAsyncTabs();
    this.ReporteingresosDiasplatosV2();

    this.reporteForm = this.formBuilder.group({
      id_plato:new FormControl("", [
        Validators.required,
      ]), 
      fecha: new FormControl("", [
        Validators.required,
      ]),
      
    });
  }




  
  hideSelectText() {}

  asyncTabs: Observable<ExampleTab[]>;

  loadAsyncTabs() {
    this.asyncTabs = new Observable((observer: Observer<ExampleTab[]>) => {
      observer.next([
        { label: 'DIARIO DE VENTA (DÍA-SEMANA-MES)', content: 'Content 1' },
        { label: 'DIARIO DE VENTA POR MENÚ (DÍA-SEMANA-MES)', content: 'Content 2' },
      ]);
    });
  }

  platoSeleccionado: { id: number | null; descripcion: string } = {
    id: null,
    descripcion: "",
  };

  updatePlatoId(event: any) {
    const descripcion = event.target.value;
    const platoSeleccionado = this.platosss.find(
      (plato) => plato.descripcion === descripcion
    );
    if (platoSeleccionado) {
      this.idPlato = platoSeleccionado.id; // Asignar el ID del alimento seleccionado
    } else {
      this.idPlato = null; // O asigna un valor adecuado cuando no se encuentra un alimento
    }
  }

  //Obtencion de platos-----------------------------------------------------
  getAlldescripcionplatos() {
    this.MenuService.mostrarplatomenu().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.platos);
        this.platosss = res.platos;
      },
      error: (err) => {
        //alert("Error en la carga de datos");
      },
    });
  }


// En tu componente .ts
// En tu componente .ts
formatCurrencyq(value: number): string {
  if (isNaN(value)) {
    return '';
  }

  const dollars = Math.floor(value);
  const cents = Math.round((value - dollars) * 100);

  if (value < 1) {
    return `${cents} ctvs`;
  } else {
    if (cents === 0) {
      return `${dollars} $`;
    } else {
      return `${dollars}.${cents} $`;
    }
  }
}



  mostrarMensajeError: boolean = false;


    showModalError() {
      this.mostrarMensajeError = true;
      swal({
        title: "No existe reporte de ese plato para esa fecha ",
        icon: "error",
      });
    }
    showModalErrorMes() {
      this.mostrarMensajeError = true;
      swal({
        title: "No existe reporte de ese plato para ese mes ",
        icon: "error",
      });
    }


    
 
  //PAGINATOR------------------------------
   

  pagedReportesssV2: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10; // Puedes ajustar este valor
  totalPages: number = 0;
  
 
  

  ReporteingresosDiasplatosV2() {
    this.reportesssV2 = [];
  
    if (this.fechaSeleccionadaV2) {
      const fecha = this.fechaSeleccionadaV2;
  
      this.CreditosService.buscardia(fecha).subscribe({
        next: (res: any) => {
          console.log('Respuesta del servicio:', res);
          if (res && res.length > 0) {
            this.reportesssV2 = res;
            this.totalPages = Math.ceil(this.reportesssV2.length / this.itemsPerPage);
            this.updatePagedData();
            this.mostrarTablaV2 = true;
            this.mostrarTablallenaV2 = true;
            console.log('Datos asignados a reportesssV2:', this.reportesssV2);
          } else {
            console.log("No se encontraron datos para esta fecha y plato.");
            this.mostrarTablaV2 = false;
            this.mostrarTablallenaV2 = false;
          }
        },
        error: (err) => {
          this.showModalError();
        },
      });
    } else {
      console.log("El idplato o la fecha no están definidos.");
      this.showModalErrors("El idplato o la fecha no están definidos.");
    }
  }

  updatePagedData() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.pagedReportesssV2 = this.reportesssV2.slice(start, end);
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagedData();
    }
  }

 

 
  reportesssOriginal: any[] = [];


  nombreproductoFiltro: string = '';
  filtroSeleccionado5: string = ''; 
  //filtrado
 




  filtro: string = '';
   alimentosssOriginal: any[] = []; // Datos originales


 

        //-----Metodos de pdf y excel por  dias 
        




        descargarPDF() {
          const rows = this.reportesss.map((item) => [
            item.plato,
            item.fecha,
            item.cantidadPlato,
            item.conCreditos,
            item.sinCreditos,
            this.formatPrice(item.precio),
            this.formatPrice(item.totalCredito),
            this.formatPrice(item.totalSinCredito),
            this.formatPrice(item.total),
          ]);
        
          const columnWidths = [65, 65, 35, 45, 45, 50, 50, 50, 35];
          
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
                { text: 'INFORME DE INGRESOS DE MENÚ POR DÍA', style: 'header', alignment: 'center' },
                ' \n', ' \n',
                { text: 'Cantidad diaria de ingresos en menú', style: 'subheader', alignment: 'left', bold: true },
                '\n',
                {
                  alignment: 'center',
                  table: {
                    headerRows: 1,
                    widths: columnWidths,
                    body: [
                      ['Menú', 'Fecha', 'Cantidad del menú', 'Con créditos', 'Sin créditos', 'Precio del menú', 'Precio total con créditos', 'Precio total sin créditos', 'Total'].map((cell) => ({
                        text: cell,
                        bold: true,
                        fillColor: '#D3D3D3',
                        alignment: 'center',
                      })),
                      ...rows.map(row => row.map(cell => ({ text: cell, alignment: 'center' }))),
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
            pdfMake.createPdf(documentoPDF).download('INFORME DE INGRESOS POR DÍA.pdf');
          });
        }

        descargarPDFV2() {
          // Formatear los valores monetarios en el formato deseado
          const rows = this.reportesssV2.map((item) => [
            item.descripcion,
            item.fecha,
            item.cantidadPlato,
            item.conCreditos,
            item.sinCreditos,
            this.formatCurrency(item.precio),
            this.formatCurrency(item.totalConCreditos),
            this.formatCurrency(item.totalSinCreditos),
            this.formatCurrency(item.total),
          ]);
        
          const columnWidths = [90, 60, 46, 40, 40, 40, 40, 40, 40];
          
          // Obtener las representaciones en base64 de las imágenes
          Promise.all([this.imageService.getBase64Image(), this.imageService.getBase64Image()]).then(([base64ImageLeft, base64ImageRight]) => {
            const headerTable = {
              table: {
                widths: [120, '*', 120],
                body: [
                  [
                    { image: base64ImageLeft, width: 80, height: 80, alignment: 'left' },
                    { text: 'ESCUELA SUPERIOR POLITÉCNICA AGROPECUARIA DE MANABÍ MANUEL FÉLIX LÓPEZ', style: 'header', alignment: 'center', fontSize: 16 },
                    { image: base64ImageRight, width: 80, height: 80, alignment: 'right' },
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
                { text: 'INFORME DE INGRESOS DE MENÚS DIARIOS', style: 'header', alignment: 'center' },
                ' \n', ' \n',
                { text: 'Cantidad diaria de ingresos en menú', style: 'subheader', alignment: 'left', bold: true },
                '\n',
                {
                  alignment: 'center',
                  table: {
                    headerRows: 1,
                    widths: columnWidths,
                    body: [
                      ['Menú', 'Fecha', 'Cantidad del menú', 'Con créditos', 'Sin créditos', 'Precio del menú', 'Precio total con créditos', 'Precio total sin créditos', 'Total'].map((cell) => ({
                        text: cell,
                        bold: true,
                        fillColor: '#D3D3D3',
                        alignment: 'center',
                      })),
                      ...rows.map(row => row.map(cell => ({ text: cell, alignment: 'center' }))),
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
            pdfMake.createPdf(documentoPDF).download('INFORME DE INGRESOS DIARIO.pdf');
          });
        }




        descargarMesPDFV2() {
          // Formatear los valores monetarios en el formato deseado
          const rows = this.reportesssV2.map((item) => [
            item.descripcion,
            item.fecha,
            item.cantidadPlato,
            item.conCreditos,
            item.sinCreditos,
            this.formatCurrency(item.precio),
            this.formatCurrency(item.totalConCreditos),
            this.formatCurrency(item.totalSinCreditos),
            this.formatCurrency(item.total),
          ]);
        
          const columnWidths = [90, 60, 46, 40, 40, 40, 40, 40, 40];
          
          // Obtener las representaciones en base64 de las imágenes
          Promise.all([this.imageService.getBase64Image(), this.imageService.getBase64Image()]).then(([base64ImageLeft, base64ImageRight]) => {
            const headerTable = {
              table: {
                widths: [120, '*', 120],
                body: [
                  [
                    { image: base64ImageLeft, width: 80, height: 80, alignment: 'left' },
                    { text: 'ESCUELA SUPERIOR POLITÉCNICA AGROPECUARIA DE MANABÍ MANUEL FÉLIX LÓPEZ', style: 'header', alignment: 'center', fontSize: 16 },
                    { image: base64ImageRight, width: 80, height: 80, alignment: 'right' },
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
                { text: 'INFORME DE INGRESOS DE MENÚ POR MES', style: 'header', alignment: 'center' },
                ' \n', ' \n',
                { text: 'Cantidades mensuales de ingresos en menús', style: 'subheader', alignment: 'left', bold: true },
                '\n',
                {
                  alignment: 'center',
                  table: {
                    headerRows: 1,
                    widths: columnWidths,
                    body: [
                      ['Menú', 'Mes', 'Cantidad del menú', 'Con créditos', 'Sin créditos', 'Precio del menú', 'Precio total con créditos', 'Precio total sin créditos', 'Total'].map((cell) => ({
                        text: cell,
                        bold: true,
                        fillColor: '#D3D3D3',
                        alignment: 'center',
                      })),
                      ...rows.map(row => row.map(cell => ({ text: cell, alignment: 'center' }))),
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
            pdfMake.createPdf(documentoPDF).download('INFORME DE INGRESOS MENSUAL.pdf');
          });
        }


       
        
        
        // Método para formatear los valores monetarios
        formatCurrency(value: number): string {
          if (isNaN(value)) {
            return '';
          }
        
          const dollars = Math.floor(value);
          const cents = Math.round((value - dollars) * 100);
        
          if (value < 1) {
            return `${cents} ctvs`;
          } else {
            if (cents === 0) {
              return `${dollars} $`;
            } else {
              return `${dollars}.${cents} $`;
            }
          }
        }
        
        
       
        

//---------------------
 


descargarDatos() {
  const ExcelJS = require('exceljs');
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Reporte de Ingresos');
  
  // Organizar créditos por persona
  const creditosPorPersona = {};
  
 
  
  // Agregar encabezados de la tabla
  const headers = [
    'Menú',
    'Fecha ',
    'Cantidad del menú',
    'Con créditos',
    'Sin créditos',
    'Precio del menú','Precio total con créditos','Precio total Sin créditos', 'Total'
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
  this.reportesss.forEach((item, index) => {
  const rowData = [
     item.plato,
     item.fecha,
     item.cantidadPlato,
     item.conCreditos,
     item.sinCreditos,

     this.formatPrice(item.precio),
            this.formatPrice(item.totalCredito),
            this.formatPrice(item.totalSinCredito),
            this.formatPrice(item.total)
           
  ];
  
  worksheet.addRow(rowData);
  });
  
  // Establecer estilos para datos
  for (let i = worksheet.lastRow.number - this.reportesss.length + 1; i <= worksheet.lastRow.number; i++) {
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
  saveAs(new Blob([buffer]), 'Reporte de Ingresos.xlsx');
  });
  }

  descargarDatosV2() {
    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte de Ingresos');
    
    // Organizar créditos por persona
    const creditosPorPersona = {};
    
   
    
    // Agregar encabezados de la tabla
    const headers = [
      'Menú',
      'Fecha ',
      'Cantidad del menú',
      'Con créditos',
      'Sin créditos',
      'Precio del menú','Precio total con créditos','Precio total Sin créditos', 'Total'
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
    this.reportesssV2.forEach((item, index) => {
    const rowData = [
       item.descripcion,
       item.fecha,
       item.cantidadPlato,
       item.conCreditos,
       item.sinCreditos,
  
      
     
     this.formatCurrency(item.precio),
     this.formatCurrency(item.totalConCreditos),
     this.formatCurrency(item.totalSinCreditos),
     this.formatCurrency(item.total),
             
    ];
    
    worksheet.addRow(rowData);
    });
    
    // Establecer estilos para datos
    for (let i = worksheet.lastRow.number - this.reportesssV2.length + 1; i <= worksheet.lastRow.number; i++) {
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
    saveAs(new Blob([buffer]), 'Reporte de Ingresos.xlsx');
    });
    }


    descargarDatosSemanaV2() {
      const ExcelJS = require('exceljs');
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Reporte de Ingresos semanal');
      
      // Organizar créditos por persona
      const creditosPorPersona = {};
      
     
      
      // Agregar encabezados de la tabla
      const headers = [
        'Menú',
        'Fecha Inicio ',
        'Fecha Fin ',
        'Cantidad del menú',
        'Con créditos',
        'Sin créditos',
        'Precio del menú','Precio total con créditos','Precio total Sin créditos', 'Total'
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
      this.reportesssV2.forEach((item, index) => {
      const rowData = [
         item.descripcion,
         item.fechaInicio,
         item.fechaFin,
         item.cantidadPlato,
         item.conCreditos,
         item.sinCreditos,
    
        
       
       this.formatCurrency(item.precio),
       this.formatCurrency(item.totalConCreditos),
       this.formatCurrency(item.totalSinCreditos),
       this.formatCurrency(item.total),
               
      ];
      
      worksheet.addRow(rowData);
      });
      
      // Establecer estilos para datos
      for (let i = worksheet.lastRow.number - this.reportesssV2.length + 1; i <= worksheet.lastRow.number; i++) {
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
      saveAs(new Blob([buffer]), 'Reporte de Ingresos semanal.xlsx');
      });
      }


descargarExcel(datos: any[], nombreHoja: string) {
  const workSheet = XLSX.utils.json_to_sheet(datos);
  const workBook: XLSX.WorkBook = { Sheets: { [nombreHoja]: workSheet }, SheetNames: [nombreHoja] };
  const excelBuffer: any = XLSX.write(workBook, { bookType: 'xlsx', type: 'array' });

  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  FileSaver.saveAs(blob, 'Reporte de ingresos de menú por dia .xlsx');
}




  
formatPrice(price: number): string {
  if (price === null) return 'N/A';
  if (price.toString().startsWith('0')) {
    return `${this.truncateZeros(price)} ctvs`;
  } else {
    return `${price} $`;
  }
}

truncateZeros(value: number): string {
  const stringValue = value.toFixed(4);
  const parts = stringValue.split('.');
  const integerPart = parts[0];
  let decimalPart = parts[1];

  // Eliminar los ceros finales del decimalPart
  decimalPart = decimalPart.replace(/0+$/, '');

  // Concatenar la parte entera y la parte decimal
  return decimalPart.length > 0 ? `${integerPart}.${decimalPart}` : integerPart;
}


        //-----Metodos de pdf y excel por  Semana 
        
        descargarSemanaPDF() {
          const rows = this.reportesss.map((item) => [
            item.plato,
            item.fechaInicio,
            item.fechaFin,
            item.cantidadPlato,
            item.conCreditos,
            item.sinCreditos,
            this.formatPrice(item.precio),
            this.formatPrice(item.totalCredito),
            this.formatPrice(item.totalSinCredito),
            this.formatPrice(item.total),
          ]);
          const columnWidths = [65, 40, 40, 35, 45, 45, 40, 40, 50, 35];
         
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
                { text: 'INFORME DE INGRESOS DE MENÚ POR SEMANA', style: 'header', alignment: 'center' },
                '\n', '\n',
                { text: 'Cantidad semanal de ingresos en menú', style: 'subheader', alignment: 'left', bold: true },
                '\n',
                {
                  alignment: 'center',
                  table: {
                    headerRows: 1,
                    widths: columnWidths,
                    body: [
                      ['Menú', 'Fecha inicio', 'Fecha fin', 'Cantidad del menú', 'Con créditos', 'Sin créditos', 'Precio del menú', 'Precio total con créditos', 'Precio total sin créditos', 'Total'].map((cell) => ({
                        text: cell,
                        bold: true,
                        fillColor: '#D3D3D3',
                        alignment: 'center',
                      })),
                      ...rows.map(row => row.map(cell => ({ text: cell, alignment: 'center' }))),
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
            pdfMake.createPdf(documentoPDF).download('INFORME DE INGRESOS POR SEMANA.pdf');
          });
        }

//---------------------



descargarDatosSemana() {
  const ExcelJS = require('exceljs');
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Reporte de Ingresos');
  
  // Organizar créditos por persona
  const creditosPorPersona = {};
  
 
  
  // Agregar encabezados de la tabla
  const headers = [
    'Menú',
    'Fecha Inicio ',
    'Fecha Final ',
    'Cantidad del menú',
    'Con créditos',
    'Sin créditos'

 , 'Precio del menú','Precio total con créditos','Precio total Sin créditos', 'Total'
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
  this.reportesss.forEach((item, index) => {
  const rowData = [
    item.plato,
    item.fechaInicio,
   item.fechaFin,
     item.cantidadPlato,
     item.conCreditos,
     item.sinCreditos,



     this.formatPrice(item.precio),
     this.formatPrice(item.totalCredito),
     this.formatPrice(item.totalSinCredito),
     this.formatPrice(item.total)
  ];
  
  worksheet.addRow(rowData);
  });
  
  // Establecer estilos para datos
  for (let i = worksheet.lastRow.number - this.reportesss.length + 1; i <= worksheet.lastRow.number; i++) {
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
  saveAs(new Blob([buffer]), 'Reporte de Ingresos.xlsx');
  });
  }


 

descargarExcelsemana(datos: any[], nombreHoja: string) {
  const workSheet = XLSX.utils.json_to_sheet(datos);
  const workBook: XLSX.WorkBook = { Sheets: { [nombreHoja]: workSheet }, SheetNames: [nombreHoja] };
  const excelBuffer: any = XLSX.write(workBook, { bookType: 'xlsx', type: 'array' });

  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  FileSaver.saveAs(blob, 'Reporte de ingresos de menú por semana .xlsx');
}


 

  //-----Metodos de pdf y excel por  Mes---------------------------------------------------------------------------------------------------- 
   
  
  descargarMesPDF() {
    // Formatear los valores monetarios en el formato deseado
    const rows = this.reportesss.map((item) => [
      item.plato,
      item.mes,
      item.cantidadPlato,
      item.conCreditos,
      item.sinCreditos,
      this.formatCurrency(item.precio),
      this.formatCurrency(item.totalCredito),
      this.formatCurrency(item.totalSinCredito),
      this.formatCurrency(item.total),
    ]);
  
    const columnWidths = [90, 60, 46, 40, 40, 40, 40, 40, 40];
    
    // Obtener las representaciones en base64 de las imágenes
    Promise.all([this.imageService.getBase64Image(), this.imageService.getBase64Image()]).then(([base64ImageLeft, base64ImageRight]) => {
      const headerTable = {
        table: {
          widths: [120, '*', 120],
          body: [
            [
              { image: base64ImageLeft, width: 80, height: 80, alignment: 'left' },
              { text: 'ESCUELA SUPERIOR POLITÉCNICA AGROPECUARIA DE MANABÍ MANUEL FÉLIX LÓPEZ', style: 'header', alignment: 'center', fontSize: 16 },
              { image: base64ImageRight, width: 80, height: 80, alignment: 'right' },
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
          { text: 'INFORME DE INGRESOS DE MENÚS DIARIOS', style: 'header', alignment: 'center' },
          ' \n', ' \n',
          { text: 'Cantidad diaria de ingresos en menú', style: 'subheader', alignment: 'left', bold: true },
          '\n',
          {
            alignment: 'center',
            table: {
              headerRows: 1,
              widths: columnWidths,
              body: [
                ['Menú', 'Mes', 'Cantidad del menú', 'Con créditos', 'Sin créditos', 'Precio del menú', 'Precio total con créditos', 'Precio total sin créditos', 'Total'].map((cell) => ({
                  text: cell,
                  bold: true,
                  fillColor: '#D3D3D3',
                  alignment: 'center',
                })),
                ...rows.map(row => row.map(cell => ({ text: cell, alignment: 'center' }))),
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
      pdfMake.createPdf(documentoPDF).download('INFORME DE INGRESOS DIARIO.pdf');
    });
  }
  
  
  

//---------------------

descargarMesDatos() {
  const ExcelJS = require('exceljs');
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Reporte de Ingresos');
  
  // Organizar créditos por persona
  const creditosPorPersona = {};
  
 
  
  // Agregar encabezados de la tabla
  const headers = [
    'Menú',
    'Mes ',
    'Cantidad del menú',
    'Con créditos',
    'Sin créditos',

     'Precio del menú','Precio total con créditos','Precio total Sin créditos', 'Total'
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
  this.reportesss.forEach((item, index) => {
  const rowData = [
     item.plato,
     this.meses[item.mes - 1],
     item.cantidadPlato,
     item.conCreditos,
     item.sinCreditos,

     this.formatPrice(item.precio),
     this.formatPrice(item.totalCredito),
     this.formatPrice(item.totalSinCredito),
     this.formatPrice(item.total)
  ];
  
  worksheet.addRow(rowData);
  });
  
  // Establecer estilos para datos
  for (let i = worksheet.lastRow.number - this.reportesss.length + 1; i <= worksheet.lastRow.number; i++) {
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
  saveAs(new Blob([buffer]), 'Reporte de Ingresos.xlsx');
  });
  }
 

descargarExcelMes(datos: any[], nombreHoja: string) {
  const workSheet = XLSX.utils.json_to_sheet(datos);
  const workBook: XLSX.WorkBook = { Sheets: { [nombreHoja]: workSheet }, SheetNames: [nombreHoja] };
  const excelBuffer: any = XLSX.write(workBook, { bookType: 'xlsx', type: 'array' });

  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  FileSaver.saveAs(blob, 'Reporte de ingresos de menú por mes .xlsx');
}







meses: string[] = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
];

//---F I L T R O S--------




  //Filtros
  diaFiltro: string = "";
  filtroSeleccionado: string = "";
  filtroSeleccionadoV2: string = "";
  filtroSeleccionadoV3: string = "";
  semanaFiltro: string = "";
  mesFiltro: string = "";







  aplicarFiltros() {
    if (this.filtroSeleccionado === "dia") {
      // Aplica el filtro por nombre y restablece el filtro de fecha
      this.diaFiltro = "";
    } else if (this.filtroSeleccionado === "semana") {
      // Si se selecciona el filtro de fecha, vacía el filtro de nombre
      this.semanaFiltro = "";
    } else if (this.filtroSeleccionado === "mes") {
      // Si se selecciona el filtro de fecha, vacía el filtro de nombre
      this.mesFiltro = "";
    }

  
  }

  aplicarFiltrosV2() {
    if (this.filtroSeleccionadoV2 === "diaV2") {
      // Aplica el filtro por nombre y restablece el filtro de fecha
      this.diaFiltro = "";
    } else if (this.filtroSeleccionadoV2 === "semanaV2") {
      // Si se selecciona el filtro de fecha, vacía el filtro de nombre
      this.semanaFiltro = "";
    } else if (this.filtroSeleccionadoV2 === "mesV2") {
      // Si se selecciona el filtro de fecha, vacía el filtro de nombre
      this.mesFiltro = "";
    }

  
  }

  //--------------metodo para filtrar
  //----------Mestodo de busqueda por semanas-------------
fechafinalSeleccionada: string | null = null;
mostrarTablames: boolean = false;
mostrarTablasemana: boolean = false;
mesSeleccionado: string | null = null;
reporteingresosdiass: any[] = [];

 

fechafinalSeleccionadaV2: string | null = null;
mostrarTablamesV2: boolean = false;
mostrarTablasemanaV2: boolean = false;
mesSeleccionadoV2: string | null = null;
reporteingresosdiassV2: any[] = [];
semanaSeleccionadoV2: string | null = null;

semanaSeleccionadofinV2: string | null = null;


 // Variables adicionales para controlar la visualización de la tabla
 mostrarTablallena: boolean = false;
 mostrarTablamesllena: boolean = false;
 mostrarTablasemanallena: boolean = false;


 mostrarTablallenaV2: boolean = false;
 mostrarTablamesllenaV2: boolean = false;
 mostrarTablasemanallenaV2: boolean = false;


  buscarIngredientePorFiltro() {
    console.log("id " + this.idPlato);
  
    // Limpia el arreglo de ingredientes
    this.reporteingresosdiass = [];
  
    switch (this.filtroSeleccionado) {
      case 'dia':
        console.log("fecha " + this.fechaSeleccionada);
        this.  ReporteingresosDiasplatos ();
        break;
      case 'semana':
        console.log("fecha " + this.semanaSeleccionadoV2);
        console.log("fecha final " + this.semanaSeleccionadofinV2);
      this.ReporteingresosSemanasplatos(); 
        break;
      case 'mes':
        console.log("mes " + this.mesSeleccionado);
          this.ReporteingresosMesplatos(); 
        break;
      default:
        console.log("Filtro no válido");
        break;
    }
  }


  buscarIngredientePorFiltroV2() {
   
  
    // Limpia el arreglo de ingredientes
    this.reporteingresosdiassV2 = [];
  
    switch (this.filtroSeleccionadoV2) {
      case 'diaV2':
        console.log("fecha " + this.fechaSeleccionadaV2);
        this.  ReporteingresosDiasplatosV2 ();
        break;
      case 'semanaV2':
        console.log("fecha " + this.semanaSeleccionadoV2);
        console.log("fecha final " + this.semanaSeleccionadoV2);
      this.ReporteingresosSemanasplatosV2(); 
        break;
      case 'mesV2':
        console.log("mes " + this.mesSeleccionadoV2);
          this.ReporteingresosMesplatosV2(); 
        break;
      default:
        console.log("Filtro no válido");
        break;
    }
  }


  
  //--------------metodo para filtrar
  buscarReportePorFiltro() {
    console.log("id " + this.idPlato);
  
    // Limpia el arreglo de ingredientes
    this.reporteingresosdiass = [];
  
    switch (this.filtroSeleccionado) {
      case 'dia':
        console.log("fecha " + this.fechaSeleccionada);
        this.  ReporteingresosDiasplatos ();
        break;
      case 'semana':
        console.log("fecha " + this.fechaSeleccionada);
        console.log("fecha final " + this.fechafinalSeleccionada);
         this.ReporteingresosSemanasplatos(); 
        break;
      case 'mes':
        console.log("mes " + this.mesSeleccionado);
       this.ReporteingresosMesplatos();
         break;
      default:
        console.log("Filtro no válido");
        break;
    }
  }

 
   




  
  ReporteingresosSemanasplatosV2jjj  () {
     
    this.reportesssV2 = [];
  
    // Asegúrate de que tanto idAlimento como fechaSeleccionada estén definidos antes de hacer la llamada
    if ( this.fechaSeleccionadaV2) {
      const fecha = this.fechaSeleccionadaV2;
      const fechafinal= this.fechafinalSeleccionadaV2;
        this.CreditosService.buscarPorSemana(  fecha,fechafinal ).subscribe({
          next: (res: any) => {
            if (res && res.reporte) {
              if (res.reporte.length === 0) {
              
                console.log("No se encontraron datos para esta fecha y plato.");
                this.mostrarTablasemanaV2 = false;
              } else {
              
              // Asigna los datos al arreglo ingredientesdiass
                this.reportesssV2 = [res.reporte];
                this.mostrarTablasemanaV2 = true;
              }
            } else {
              console.log("La respuesta no contiene datos.");
            }
          },
          error: (err) => {
          
            this.showModalError();
          },
        });

    } else {
      console.log("El idplato o la fecha no están definidos.");
    }
    
  

    
  }

  ReporteingresosSemanasplatosV2() {
    this.reportesssV2 = [];
  
    if (this.semanaSeleccionadoV2) {
       
      const fecha = this.semanaSeleccionadoV2;
      const fechafinal= this.semanaSeleccionadofinV2;
  
      this.CreditosService.buscarPorSemana(  fecha,fechafinal ).subscribe({
        next: (res: any) => {
          console.log('Respuesta del servicio:', res);
          if (res && res.length > 0) {
            this.reportesssV2 = res;
            this.totalPages = Math.ceil(this.reportesssV2.length / this.itemsPerPage);
            this.updatePagedData();
            this.mostrarTablasemanaV2 = true;
          
            this.mostrarTablasemanallenaV2 = true;

            console.log('Datos asignados a reportesssV2:', this.reportesssV2);
          } else {
            console.log("No se encontraron datos para esta fecha y plato.");
            this.mostrarTablasemanaV2 = false;
             
            this.mostrarTablasemanallenaV2 = false;
          }
        },
        error: (err) => {
          this.showModalError();
        },
      });
    } else {
      console.log("El idplato o la fecha no están definidos.");
      this.showModalErrors("El idplato o la fecha no están definidos.");
    }
  }


  ReporteingresosMesplatosV2() {
    this.reportesssV2 = [];
  
    if (this.mesSeleccionadoV2) {
      const mes = this.mesSeleccionadoV2;
  
      this.CreditosService.buscarPorMes(mes).subscribe({
        next: (res: any) => {
          console.log('Respuesta del servicio:', res);
          if (res && res.length > 0) {
            this.reportesssV2 = res;
            this.totalPages = Math.ceil(this.reportesssV2.length / this.itemsPerPage);
            this.updatePagedData();
            this.mostrarTablamesV2 = true;
            this.mostrarTablamesllenaV2 = true;
            console.log('Datos asignados a reportesssV2:', this.reportesssV2);
          } else {
            console.log("No se encontraron datos para esta fecha y plato.");
            this.mostrarTablamesV2 = false;
            this.mostrarTablallenaV2 = false;
          }
        },
        error: (err) => {
          this.showModalError();
        },
      });
    } else {
      console.log("El idplato o la fecha no están definidos.");
      this.showModalErrors("El idplato o la fecha no están definidos.");
    }
  }


  



  //-------------------------metodos de busquedas--------------------------------------
   //--------------metodo para buscar el reporte de ingresos del plato segun la fecha ´por dia-----------------------------
  
   mostrarTabla: boolean = false;
   mostrarTablaV2: boolean = false;

   ReporteingresosDiasplatos() {
    this.reportesss = [];
  
    // Asegúrate de que tanto idAlimento como fechaSeleccionada estén definidos antes de hacer la llamada
    if (this.idPlato && this.fechaSeleccionada) {
      const fecha = this.fechaSeleccionada;
  
      this.CreditosService.ingresos(fecha, this.idPlato).subscribe({
        next: (res: any) => {
          if (res && res.reporte) {
            if (res.reporte.length === 0) {
              console.log("No se encontraron datos para esta fecha y plato.");
              this.mostrarTabla = false;
              this.mostrarTablallena = false;
            } else {
              // Asigna los datos al arreglo reportesss
              this.reportesss = [res.reporte];
              this.mostrarTabla = true;
              this.mostrarTablallena = true;
            }
          } else {
            console.log("La respuesta no contiene datos.");
          }
        },
        error: (err) => {
          
          this.showModalError( );
        },
      });
  
    } else {
      console.log("El idplato o la fecha no están definidos.");
      this.showModalErrors("El idplato o la fecha no están definidos.");
    }
  }
  
  showModalErrors(errorMessage: string) {
    // Implementa la lógica para mostrar un modal o mensaje de error aquí
    console.error(errorMessage);
    // Puedes usar alguna librería de manejo de modales o simplemente mostrar un mensaje en la consola
  }
  
   //--------------metodo para buscar el reporte de ingresos del plato segun la fecha por semana-----------------------------

   ReporteingresosSemanasplatos  () {
     
    this.reportesss = [];
  
    // Asegúrate de que tanto idAlimento como fechaSeleccionada estén definidos antes de hacer la llamada
    if (this.idPlato && this.fechaSeleccionada) {
      const fecha = this.fechaSeleccionada;
      const fechafinal= this.fechafinalSeleccionada;
        this.CreditosService.reporteIngresosporsemanasdeplatos( this.idPlato,fecha,fechafinal ).subscribe({
          next: (res: any) => {
            if (res && res.reporte) {
              if (res.reporte.length === 0) {
              
                console.log("No se encontraron datos para esta fecha y plato.");
                this.mostrarTablasemana = false;
              } else {
              
              // Asigna los datos al arreglo ingredientesdiass
                this.reportesss = [res.reporte];
                this.mostrarTablasemana = true;
              }
            } else {
              console.log("La respuesta no contiene datos.");
            }
          },
          error: (err) => {
          
            this.showModalError();
          },
        });

    } else {
      console.log("El idplato o la fecha no están definidos.");
    }
    
  

    
  }


  getNombreMes(numeroMes: number): string {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return meses[numeroMes - 1]; // Restamos 1 porque los meses en JavaScript van de 0 a 11
  }
  
  ReporteingresosMesplatos  () {
     
    this.reportesss = [];
  
    // Asegúrate de que tanto idAlimento como fechaSeleccionada estén definidos antes de hacer la llamada
    if (this.idPlato && this.mesSeleccionado) {
      const mes = this.mesSeleccionado;
      
        this.CreditosService.reporteIngresospormesdeplatos( this.idPlato,mes ).subscribe({
          next: (res: any) => {
            if (res && res.reporte) {
              if (res.reporte.length === 0) {
              
                console.log("No se encontraron datos para esta fecha y plato.");
                this.mostrarTablames = false;
              } else {
              
              // Asigna los datos al arreglo ingredientesdiass
                this.reportesss = [res.reporte];
                this.mostrarTablames = true;
              }
            } else {
              console.log("La respuesta no contiene datos.");
            }
          },
          error: (err) => {
          
            this.showModalErrorMes();
          },
        });

    } else {
      console.log("El idplato o la fecha no están definidos.");
    }
    
  

    
  }

   


 

  
  





















  //-----------------------------------------------------------------------------
  filtroAnterior: string | null = null;

  // ... otros métodos
  mostrarImagen: boolean = false;
  mostrarImagenV2: boolean = false;
  limpiarInputYMostrarTabla() {
    if (this.filtroSeleccionado !== this.filtroAnterior) {
      this.platoSeleccionado.descripcion = ''; // Limpiar el input
      this.fechaSeleccionada = ''; // Limpiar el input
      this.fechafinalSeleccionada = ''; // Limpiar el input
      this.filtroAnterior = this.filtroSeleccionado; // Actualizar el filtro anterior
    }
  
    this.mostrarTabla = false; // Ocultar la tabla anterior de día
    this.mostrarTablames = false; // Ocultar la tabla anterior de meses
    this.mostrarTablasemana = false; // Ocultar la tabla anterior de semanas
  
    // Agregar la lógica para mostrar la imagen y la línea <div> aquí
    if (!this.reportesss || this.reportesss.length === 0) {
      this.mostrarImagen = true; // Mostrar la imagen
    } else {
      this.mostrarImagen = this.filtroSeleccionado === 'dia' || this.filtroSeleccionado === 'semana' || this.filtroSeleccionado === 'mes';
    }
  }
  


  limpiarInputYMostrarTablaV2() {
    if (this.filtroSeleccionadoV2 !== this.filtroAnterior) {
      this.platoSeleccionado.descripcion = ''; // Limpiar el input
      this.fechaSeleccionadaV2 = ''; // Limpiar el input
      this.fechafinalSeleccionadaV2 = ''; // Limpiar el input
      this.filtroAnterior = this.filtroSeleccionadoV2; // Actualizar el filtro anterior
    }
  
    this.mostrarTablaV2 = false; // Ocultar la tabla anterior de día
    this.mostrarTablamesV2 = false; // Ocultar la tabla anterior de meses
    this.mostrarTablasemanaV2 = false; // Ocultar la tabla anterior de semanas
  
    // Agregar la lógica para mostrar la imagen y la línea <div> aquí
    if (!this.reportesssV2 || this.reportesssV2.length === 0) {
      this.mostrarImagenV2 = true; // Mostrar la imagen
    } else {
      this.mostrarImagenV2 = this.filtroSeleccionadoV2 === 'diaV2' || this.filtroSeleccionadoV2 === 'semanaV2' || this.filtroSeleccionadoV2 === 'mesV2';
    }
  }
  



  
//---------------------V2V2VV2V
 

formatPrice2(value: number | undefined | null): string {
  if (value == null || isNaN(value)) {
    return ''; // Maneja casos de undefined, null, o NaN
  }

  const dollars = Math.floor(value);
  const cents = Math.round((value - dollars) * 100);

  if (value < 1) {
    return `${cents} ctvs`;
  } else {
    if (cents === 0) {
      return `${dollars} $`;
    } else {
      return `${dollars}.${cents} $`;
    }
  }
}


 


 



descargarExcelV2(datos: any[], nombreHoja: string) {
  const workSheet = XLSX.utils.json_to_sheet(datos);
  const workBook: XLSX.WorkBook = { Sheets: { [nombreHoja]: workSheet }, SheetNames: [nombreHoja] };
  const excelBuffer: any = XLSX.write(workBook, { bookType: 'xlsx', type: 'array' });

  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  FileSaver.saveAs(blob, 'Reporte de ingresos de menú por dia .xlsx');
}




  
 

        //-----Metodos de pdf y excel por  Semana 
        
       

        descargarSemanaPDFV2() {
          // Formatear los valores monetarios en el formato deseado
          const rows = this.reportesssV2.map((item) => [
            item.descripcion,
            item.fechaInicio,
            item.fechaFin,
            item.cantidadPlato,
            item.conCreditos,
            item.sinCreditos,
            this.formatCurrency(item.precio),
            this.formatCurrency(item.totalConCreditos),
            this.formatCurrency(item.totalSinCreditos),
            this.formatCurrency(item.total),
          ]);
        
          const columnWidths = [90, 40, 40, 46, 40, 40, 40, 40, 40, 40];
          
          // Obtener las representaciones en base64 de las imágenes
          Promise.all([this.imageService.getBase64Image(), this.imageService.getBase64Image()]).then(([base64ImageLeft, base64ImageRight]) => {
            const headerTable = {
              table: {
                widths: [120, '*', 120],
                body: [
                  [
                    { image: base64ImageLeft, width: 80, height: 80, alignment: 'left' },
                    { text: 'ESCUELA SUPERIOR POLITÉCNICA AGROPECUARIA DE MANABÍ MANUEL FÉLIX LÓPEZ', style: 'header', alignment: 'center', fontSize: 16 },
                    { image: base64ImageRight, width: 80, height: 80, alignment: 'right' },
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
                { text: 'INFORME DE INGRESOS DE MENÚS SEMANAL', style: 'header', alignment: 'center' },
                ' \n', ' \n',
                { text: 'Cantidad mensual de ingresos en menú', style: 'subheader', alignment: 'left', bold: true },
                '\n',
                {
                  alignment: 'center',
                  table: {
                    headerRows: 1,
                    widths: columnWidths,
                    body: [
                      ['Menú', 'Fecha Inicio', 'Fecha Fin','Cantidad del menú', 'Con créditos', 'Sin créditos', 'Precio del menú', 'Precio total con créditos', 'Precio total sin créditos', 'Total'].map((cell) => ({
                        text: cell,
                        bold: true,
                        fillColor: '#D3D3D3',
                        alignment: 'center',
                      })),
                      ...rows.map(row => row.map(cell => ({ text: cell, alignment: 'center' }))),
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
            pdfMake.createPdf(documentoPDF).download('INFORME DE INGRESOS MENSUAL.pdf');
          });
        }

//---------------------



 


 

descargarExcelsemanaV2(datos: any[], nombreHoja: string) {
  const workSheet = XLSX.utils.json_to_sheet(datos);
  const workBook: XLSX.WorkBook = { Sheets: { [nombreHoja]: workSheet }, SheetNames: [nombreHoja] };
  const excelBuffer: any = XLSX.write(workBook, { bookType: 'xlsx', type: 'array' });

  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  FileSaver.saveAs(blob, 'Reporte de ingresos de menú por semana .xlsx');
}








  //-----Metodos de pdf y excel por  Mes---------------------------------------------------------------------------------------------------- 
   
 
   
  
  
  
  

//---------------------

 
  descargarMesDatosV2() {
    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte de Ingresos');
    
    // Organizar créditos por persona
    const creditosPorPersona = {};
    
   
    
    // Agregar encabezados de la tabla
    const headers = [
      'Menú',
      'Mes ',
      'Cantidad del menú',
      'Con créditos',
      'Sin créditos',
      'Precio del menú','Precio total con créditos','Precio total Sin créditos', 'Total'
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
    this.reportesssV2.forEach((item, index) => {
    const rowData = [
       item.descripcion,
       item.fecha,
       item.cantidadPlato,
       item.conCreditos,
       item.sinCreditos,
  
      
     
     this.formatCurrency(item.precio),
     this.formatCurrency(item.totalConCreditos),
     this.formatCurrency(item.totalSinCreditos),
     this.formatCurrency(item.total),
             
    ];
    
    worksheet.addRow(rowData);
    });
    
    // Establecer estilos para datos
    for (let i = worksheet.lastRow.number - this.reportesssV2.length + 1; i <= worksheet.lastRow.number; i++) {
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
    saveAs(new Blob([buffer]), 'Reporte de Ingresos Mes.xlsx');
    });
    }
 

descargarExcelMesV2(datos: any[], nombreHoja: string) {
  const workSheet = XLSX.utils.json_to_sheet(datos);
  const workBook: XLSX.WorkBook = { Sheets: { [nombreHoja]: workSheet }, SheetNames: [nombreHoja] };
  const excelBuffer: any = XLSX.write(workBook, { bookType: 'xlsx', type: 'array' });

  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  FileSaver.saveAs(blob, 'Reporte de ingresos de menú por mes .xlsx');
}






  
}
