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

@Component({
  selector: 'app-reporteingresos',
  templateUrl: './reporteingresos.component.html',
  styleUrls: ['./reporteingresos.component.scss']
})
export class ReporteingresosComponent implements OnInit {
  platosss: any[] = [];
  reportesss: any[] = [];

  dataSource = new MatTableDataSource<any>();
  idPlato: string = "";
  fechaSeleccionada: string | null = null;
  reporteForm!: FormGroup;

  constructor(private CreditosService:CreditosService,private formBuilder:FormBuilder, private MenuService :MenuService, private imageService:ImageService) { }

  ngOnInit(): void {
    this.getAlldescripcionplatos();

    this.reporteForm = this.formBuilder.group({
      id_plato:new FormControl("", [
        Validators.required,
      ]), 
      fecha: new FormControl("", [
        Validators.required,
      ]),
      
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


        //-----Metodos de pdf y excel por  dias 
        




        descargarPDF() {
          const rows = this.reportesss.map((item, index) => [
            item.plato,
            item.fecha,
            item.cantidadPlato,
            item.conCreditos,
            item.sinCreditos,
          ]);
        
        
         
        
          const anchoPagina = 595.28;
          let columnWidths = [150, 95,90, 90, 90,];
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
                { text: 'INFORME DE INGRESOS DE MENÚ POR DÍA', style: 'header', alignment: 'center' },
                ' \n',   ' \n',  
                { text: 'Cantidad diaria de ingresos en menú', style: 'subheader', alignment: 'left' , bold: true },
                '\n',
                {
                  // Contenedor externo para la tabla
                  alignment: 'center',
                  table: {
                    headerRows: 1,
                    // Ancho de la tabla
                    widths: ['*', '*', '*', '*', '*'],
                    // Alineación de la tabla en el centro
                    alignment: 'center',
                    body: [
                      ['Menú', 'Fecha', 'Cantidad del menú', 'Con créditos' , 'Sin créditos'].map((cell, index) => ({
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


descargarExcel(datos: any[], nombreHoja: string) {
  const workSheet = XLSX.utils.json_to_sheet(datos);
  const workBook: XLSX.WorkBook = { Sheets: { [nombreHoja]: workSheet }, SheetNames: [nombreHoja] };
  const excelBuffer: any = XLSX.write(workBook, { bookType: 'xlsx', type: 'array' });

  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  FileSaver.saveAs(blob, 'Reporte de ingresos de menú por dia .xlsx');
}






        //-----Metodos de pdf y excel por  Semana 
        
        descargarSemanaPDF() {
          const rows = this.reportesss.map((item, index) => [
            item.plato,
              item.fechaInicio,
              item.fechaFin,
              item.cantidadPlato,
              item.conCreditos,
              item.sinCreditos,
          ]);
        
        
         
        
          const anchoPagina = 595.28;
          let columnWidths = [150, 95, 95,90, 90, 90,];
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
                { text: 'INFORME DE INGRESOS DE MENÚ POR SEMANA', style: 'header', alignment: 'center' },
                ' \n',   ' \n',  
                { text: 'Cantidad semanal de ingresos en menú', style: 'subheader', alignment: 'left' , bold: true },
                '\n',
                {
                  // Contenedor externo para la tabla
                  alignment: 'center',
                  table: {
                    headerRows: 1,
                    // Ancho de la tabla
                    widths: ['*', '*', '*', '*', '*', '*'],
                    // Alineación de la tabla en el centro
                    alignment: 'center',
                    body: [
                      ['Menú', 'Fecha inicio', 'Fecha fin','Cantidad del menú', 'Con créditos' , 'Sin créditos'].map((cell, index) => ({
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
    'Sin créditos',

 
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
    const rows = this.reportesss.map((item, index) => [
      item.plato,
      this.meses[item.mes - 1],
      item.cantidadPlato,
              item.conCreditos,
              item.sinCreditos,
    ]);
  
  
   
  
    const anchoPagina = 595.28;
    let columnWidths = [150, 95, 90,90, 90,];
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
          { text: 'INFORME DE INGRESOS DE MENÚ POR MES', style: 'header', alignment: 'center' },
          ' \n',   ' \n',  
          { text: 'Cantidad mensual de ingresos en menú', style: 'subheader', alignment: 'left' , bold: true },
          '\n',
          {
            // Contenedor externo para la tabla
            alignment: 'center',
            table: {
              headerRows: 1,
              // Ancho de la tabla
              widths: ['*', '*', '*', '*', '*'],
              // Alineación de la tabla en el centro
              alignment: 'center',
              body: [
                ['Menú', 'Mes','Cantidad del menú', 'Con créditos' , 'Sin créditos'].map((cell, index) => ({
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
      pdfMake.createPdf(documentoPDF).download('INFORME DE INGRESOS POR MES.pdf');
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

  //--------------metodo para filtrar
  //----------Mestodo de busqueda por semanas-------------
fechafinalSeleccionada: string | null = null;
mostrarTablames: boolean = false;
mostrarTablasemana: boolean = false;
mesSeleccionado: string | null = null;
reporteingresosdiass: any[] = [];




 // Variables adicionales para controlar la visualización de la tabla
 mostrarTablallena: boolean = false;
 mostrarTablamesllena: boolean = false;
 mostrarTablasemanallena: boolean = false;


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









  //-------------------------metodos de busquedas--------------------------------------
   //--------------metodo para buscar el reporte de ingresos del plato segun la fecha ´por dia-----------------------------
  
   mostrarTabla: boolean = false;
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
  


  
}
