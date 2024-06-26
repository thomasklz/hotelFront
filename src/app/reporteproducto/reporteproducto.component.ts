import { Component, OnInit } from "@angular/core";
import {  FormBuilder,  FormControl,  FormGroup,  Validators, } from "@angular/forms";
import { AlimentosService } from "app/servicios/alimentos.service";
import { MatTableDataSource } from "@angular/material/table";
import { Console } from "console";
import * as XLSX from 'xlsx';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as FileSaver from 'file-saver';
import swal from "sweetalert";
import { ImageService } from "app/servicios/image.service";


import { saveAs } from 'file-saver';

// Resto de tu código...

@Component({
  selector: "app-reporteproducto",
  templateUrl: "./reporteproducto.component.html",
  styleUrls: ["./reporteproducto.component.scss"],
})
export class ReporteproductoComponent implements OnInit {
  alimentoss: any[] = [];
  ingredientesdiass: any[] = [];
  ingredientesForm!: FormGroup;
  dataSource = new MatTableDataSource<any>();
  ingredientesdiasssOriginal: any[] = [];
  idAlimento: string = "";

  constructor(private AlimentosService: AlimentosService,private formBuilder:FormBuilder, private imageService:ImageService) {}


  ngOnInit(): void {
    this.getAllalimentos();
/*     this.buscarIngredientePorId();
 */    this.ingredientesForm = this.formBuilder.group({
      id_alimento:new FormControl("", [
        Validators.required,
      ]), 
      fecha: new FormControl("", [
        Validators.required,
      ]),
      fechafinal: new FormControl("", [
        Validators.required,
      ]),
      mes: new FormControl("", [
        Validators.required,
      ]),
      
    });
    
  }

  alimentoSeleccionado: { id: number | null; descripcion: string } = {
    id: null,
    descripcion: "",
  };

  updateAlimentoId(event: any) {
    const descripcion = event.target.value;
    const alimentoSeleccionado = this.alimentoss.find(
      (alimento) => alimento.descripcion === descripcion
    );
    if (alimentoSeleccionado) {
      this.idAlimento = alimentoSeleccionado.id; // Asignar el ID del alimento seleccionado
    } else {
      this.idAlimento = null; // O asigna un valor adecuado cuando no se encuentra un alimento
    }
  }
  
  
  
  


  getAllalimentos() {
    this.AlimentosService.mostraralimentomenu().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.alimentos);
        this.alimentoss = res.alimentos;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

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
  buscarIngredientePorFiltro() {
    console.log("id " + this.idAlimento);
  
    // Limpia el arreglo de ingredientes
    this.ingredientesdiass = [];
  
    switch (this.filtroSeleccionado) {
      case 'dia':
        console.log("fecha " + this.fechaSeleccionada);
        this.buscarIngredientePorId();
        break;
      case 'semana':
        console.log("fecha " + this.fechaSeleccionada);
        console.log("fecha final " + this.fechafinalSeleccionada);
        this.buscarIngredientePorIdSemana();
        break;
      case 'mes':
        console.log("mes " + this.mesSeleccionado);
        this.buscarIngredientePorIdMes();
        break;
      default:
        console.log("Filtro no válido");
        break;
    }
  }
  




  //-------Metodo de busqueda por dia--------------

  fechaSeleccionada: string | null = null;


  mostrarTabla: boolean = false;

  buscarIngredientePorId() {
    console.log("id " + this.idAlimento);
    console.log("fecha " + this.fechaSeleccionada);
    this.ingredientesdiass = [];
  
    // Asegúrate de que tanto idAlimento como fechaSeleccionada estén definidos antes de hacer la llamada
    if (this.idAlimento && this.fechaSeleccionada) {
      const fecha = this.fechaSeleccionada;
  
      // Realiza la solicitud HTTP para buscar ingredientes por ID y fecha
     // Dentro de la suscripción a la solicitud HTTP
this.AlimentosService.obtenerfiltropordias(fecha, this.idAlimento).subscribe({
  next: (res: any) => {
    if (res && res.ingredientesTotalesdia) {
      if (res.ingredientesTotalesdia.length === 0) {
        this.mostrarTabla = false;
        console.log("No se encontraron ingredientes para esta fecha y alimento.");
      } else {
        // Aquí puedes mostrar la descripción del alimento y la fecha
        console.log("Descripción del alimento:", res.id_alimento);
        console.log("Fecha buscada:", res.fecha);

        // Asigna los datos al arreglo ingredientesdiass
        this.ingredientesdiass = [res.ingredientesTotalesdia];
        console.log("Resultados del filtro por día:", this.ingredientesdiass);
        console.log("toooooooo:", res);
        this.mostrarTabla = true;
      }
    } else {
      console.log("La respuesta no contiene ingredientesTotalesdia.");
    }
  },
  error: (err) => {
   
    this.showModalError();
  },
});

    } else {
      console.log("El idAlimento o la fecha no están definidos.");
    }
    
  
  }
  
  
  
  
  
  //-------Metodo de busqueda por mes--------------
  mostrarTablames: boolean = false;

  mesSeleccionado: string | null = null;
  buscarIngredientePorIdMes() {
    console.log("id " + this.idAlimento);
    console.log("mes " + this.mesSeleccionado);
    this.ingredientesdiass = [];
  
    // Asegúrate de que tanto idAlimento como fechaSeleccionada estén definidos antes de hacer la llamada
    if (this.idAlimento && this.mesSeleccionado) {
      const mes = this.mesSeleccionado;
  
      // Realiza la solicitud HTTP para buscar ingredientes por ID y fecha
     // Dentro de la suscripción a la solicitud HTTP
this.AlimentosService.obtenerfiltropormes( this.idAlimento, mes).subscribe({
  next: (res: any) => {
    if (res && res.ingredientesTotalesmes) {
      if (res.ingredientesTotalesmes.length === 0) {
        this.mostrarTablames = false;
        console.log("No se encontraron ingredientes para esta fecha y alimento.");
      } else {
        // Aquí puedes mostrar la descripción del alimento y la fecha
        console.log("Descripción del alimento:", res.id_alimento);
        console.log("Fecha buscada:", res.mes);

        // Asigna los datos al arreglo ingredientesdiass
        this.ingredientesdiass = [res.ingredientesTotalesmes];
        console.log("Resultados del filtro por día:", this.ingredientesdiass);
        console.log("toooooooo:", res);
        this.mostrarTablames = true;
      }
    } else {
      console.log("La respuesta no contiene ingredientesTotalesdia.");
    }
  },
  error: (err) => {
    this.showModalErrormes();
  },
});

    } else {
      console.log("El idAlimento o la fecha no están definidos.");
    }
    
  
  }
  

//----------Mestodo de busqueda por semanas-------------
fechafinalSeleccionada: string | null = null;


mostrarTablasemana: boolean = false;

buscarIngredientePorIdSemana() {
  console.log("id " + this.idAlimento);
  console.log("fecha " + this.fechaSeleccionada);
  this.ingredientesdiass = [];

  // Asegúrate de que tanto idAlimento como fechaSeleccionada estén definidos antes de hacer la llamada
  if (this.idAlimento && this.fechaSeleccionada  ) {
    const fecha = this.fechaSeleccionada;
    const fechafinal= this.fechafinalSeleccionada;
    // Realiza la solicitud HTTP para buscar ingredientes por ID y fecha
   // Dentro de la suscripción a la solicitud HTTP
this.AlimentosService.obtenerFiltroPorSemanas( this.idAlimento, fecha,fechafinal ).subscribe({
next: (res: any) => {
  if (res && res.ingredientesTotalesSemana) {
    if (res.ingredientesTotalesSemana.length === 0) {
      this.mostrarTablasemana = false;
      console.log("No se encontraron ingredientes para esta fecha y alimento.");
    } else {
      // Aquí puedes mostrar la descripción del alimento y la fecha
      console.log("Descripción del alimento:", res.id_alimento);
      console.log("Fecha buscada:", res.fecha);

      // Asigna los datos al arreglo ingredientesdiass
      this.ingredientesdiass = [res.ingredientesTotalesSemana];
      console.log("Resultados del filtro por día:", this.ingredientesdiass);
      console.log("toooooooo:", res);
      this.mostrarTablasemana = true;
    }
  } else {
    console.log("La respuesta no contiene ingredientesTotalesdia.");
  }
},
error: (err) => {
  this.showModalErrorsemana();
},
});

  } else {
    console.log("El idAlimento o la fecha no están definidos.");
  }
  

}



//----------Metodos de pdf y excel por  Dia


descargarPDFxDias() {
  const rows = this.ingredientesdiass.map((item, index) => [
    item.id_alimento,
      item.fecha,
      item.cantidadPersonaGramo.toFixed(4),
  ]);


 

  const anchoPagina = 595.28;
  let columnWidths = [90, 95, 150,];
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
        { text: 'INFORME DE INGREDIENTE POR DÍA', style: 'header', alignment: 'center' },
        ' \n',   ' \n',  
        { text: 'Cantidad diaria de ingrediente en gramos', style: 'subheader', alignment: 'left' , bold: true },
        '\n',
        {
          // Contenedor externo para la tabla
          alignment: 'center',
          table: {
            headerRows: 1,
            // Ancho de la tabla
            widths: ['*', '*', '*'],
            // Alineación de la tabla en el centro
            alignment: 'center',
            body: [
              ['Ingrediente', 'Fecha', 'Total de gramos/mililitros/unidades'].map((cell, index) => ({
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
    pdfMake.createPdf(documentoPDF).download('INFORME DE INGREDIENTE POR DÍA.pdf');
  });
}







 
  datosParaDescargar: any[] = []; // Variable para almacenar los datos a descargar
 
  descargarDatosxDias() {
    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('INFORME DE INGREDIENTE POR DÍA');
    
    // Organizar créditos por persona
    const creditosPorPersona = {};
    
   
    
    // Agregar encabezados de la tabla
    const headers = [
      'Producto',
      'Fecha',
      'Total de gramos/mililitros/unidades',
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
    this.ingredientesdiass.forEach((item, index) => {
    const rowData = [
      item.id_alimento,
     item.fecha,
       item.cantidadPersonaGramo.toFixed(4),
    ];
    
    worksheet.addRow(rowData);
    });
    
    // Establecer estilos para datos
    for (let i = worksheet.lastRow.number - this.ingredientesdiass.length + 1; i <= worksheet.lastRow.number; i++) {
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
    saveAs(new Blob([buffer]), 'INFORME DE INGREDIENTE POR DÍA.xlsx');
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
  
  



    //-----Metodos de pdf y excel por  Semana 


    descargarPDFxSemana() {
      const rows = this.ingredientesdiass.map((item, index) => [
       
      item.id_alimento,
      item.fechaInicio,
      item.fechaFin,
      item.totalCantidadPersonaGramo.toFixed(4),
      ]);
    
    
     
    
      const anchoPagina = 595.28;
      let columnWidths = [90, 95, 95,  150,];
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
            { text: 'INFORME DE INGREDIENTE POR SEMANA', style: 'header', alignment: 'center' },
            ' \n',   ' \n',  
            { text: 'Cantidad semanal de ingrediente en gramos', style: 'subheader', alignment: 'left' , bold: true },
            '\n',
            {
              // Contenedor externo para la tabla
              alignment: 'center',
              table: {
                headerRows: 1,
                // Ancho de la tabla
                widths: ['*', '*', '*', '*'],
                // Alineación de la tabla en el centro
                alignment: 'center',
                body: [
                  ['Ingrediente', 'Fecha Inicio', 'Fecha Fin', 'Total de gramos/mililitros/unidades'].map((cell, index) => ({
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
        pdfMake.createPdf(documentoPDF).download('INFORME DE INGREDIENTE POR SEMANA.pdf');
      });
   
    }
 

//---------------------
 

descargarDatosxSemana() {
  const ExcelJS = require('exceljs');
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('INFORME DE INGREDIENTE POR SEMANA');
  
  // Organizar créditos por persona
  const creditosPorPersona = {};
  
 
  
  // Agregar encabezados de la tabla
  const headers = [
    'Producto',
    'Fecha Inicio',
    'Fecha Fin',
    'Total de gramos/mililitros/unidades',
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
  this.ingredientesdiass.forEach((item, index) => {
  const rowData = [
    item.id_alimento,
    item.fechaInicio,
     item.fechaFin,
     item.totalCantidadPersonaGramo.toFixed(4),
  ];
  
  worksheet.addRow(rowData);
  });
  
  // Establecer estilos para datos
  for (let i = worksheet.lastRow.number - this.ingredientesdiass.length + 1; i <= worksheet.lastRow.number; i++) {
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
  saveAs(new Blob([buffer]), 'INFORME DE INGREDIENTE POR SEMANA.xlsx');
  });
  }


descargarExcel(datos: any[], nombreHoja: string) {
  const workSheet = XLSX.utils.json_to_sheet(datos);
  const workBook: XLSX.WorkBook = { Sheets: { [nombreHoja]: workSheet }, SheetNames: [nombreHoja] };
  const excelBuffer: any = XLSX.write(workBook, { bookType: 'xlsx', type: 'array' });

  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  FileSaver.saveAs(blob, 'Reporte de Ingrediente por Semana .xlsx');
}





  //-----Metodos de pdf y excel por  mes

  descargarPDFxMes() {
    const rows = this.ingredientesdiass.map((item, index) => [
      item.id_alimento,
      this.meses[item.mes - 1],
      item.sumaCantidadPersonaGramo.toFixed(4),
    ]);
  
  
   
  
    const anchoPagina = 595.28;
    let columnWidths = [90, 95, 150,];
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
          { text: 'INFORME DE INGREDIENTE POR MES', style: 'header', alignment: 'center' },
          ' \n',   ' \n',  
          { text: 'Cantidad mensual de ingrediente en gramos', style: 'subheader', alignment: 'left' , bold: true },
          '\n',
          {
            // Contenedor externo para la tabla
            alignment: 'center',
            table: {
              headerRows: 1,
              // Ancho de la tabla
              widths: ['*', '*', '*'],
              // Alineación de la tabla en el centro
              alignment: 'center',
              body: [
                ['Ingrediente', 'Mes', 'Total de gramos/mililitros/unidades'].map((cell, index) => ({
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
      pdfMake.createPdf(documentoPDF).download('INFORME DE INGREDIENTE POR MES.pdf');
    });
  }
  
 

//---------------------
 



descargarDatosxMes() {
  const ExcelJS = require('exceljs');
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('INFORME DE INGREDIENTE POR MES');
  
  // Organizar créditos por persona
  const creditosPorPersona = {};
  
 
  
  // Agregar encabezados de la tabla
  const headers = [
    'Producto',
    'Mes',
    'Total de gramos/mililitros/unidades',
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
  this.ingredientesdiass.forEach((item, index) => {
  const rowData = [
    item.id_alimento,
     this.meses[item.mes - 1],
     item.sumaCantidadPersonaGramo.toFixed(4),
     
  ];
  
  worksheet.addRow(rowData);
  });
  
  // Establecer estilos para datos
  for (let i = worksheet.lastRow.number - this.ingredientesdiass.length + 1; i <= worksheet.lastRow.number; i++) {
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
  saveAs(new Blob([buffer]), 'INFORME DE INGREDIENTE POR MES.xlsx');
  });
  }




  




  //-----------------------------------------------------------------------------
  filtroAnterior: string | null = null;
  mostrarImagen: boolean = false;
  // ... otros métodos

 


  /* limpiarInputYMostrarTabla() {
    if (this.filtroSeleccionado !== this.filtroAnterior) {
      this.alimentoSeleccionado.descripcion = ''; // Limpiar el input
      this.fechaSeleccionada = ''; // Limpiar el input
      this.fechafinalSeleccionada = ''; // Limpiar el input
      this.filtroAnterior = this.filtroSeleccionado; // Actualizar el filtro anterior
    }
  
    this.mostrarTabla = false; // Ocultar la tabla anterior de día
    this.mostrarTablames = false; // Ocultar la tabla anterior de meses
    this.mostrarTablasemana = false; // Ocultar la tabla anterior de semanas
  
    // Agregar la lógica para mostrar la imagen y la línea <div> aquí
    this.mostrarImagen =
      !this.alimentoss || this.alimentoss.length === 0 || this.mostrarMensajeError;
  
    if (this.alimentoss && this.alimentoss.length > 0) {
      this.mostrarImagen = false;
    }
  } */


  
  limpiarInputYMostrarTabla() {
    if (this.filtroSeleccionado !== this.filtroAnterior) {
      this.alimentoSeleccionado.descripcion = ''; // Limpiar el input
      this.fechaSeleccionada = ''; // Limpiar el input
      this.fechafinalSeleccionada = ''; // Limpiar el input
      this.filtroAnterior = this.filtroSeleccionado; // Actualizar el filtro anterior
    }
  
    this.mostrarTabla = false; // Ocultar la tabla anterior de día
    this.mostrarTablames = false; // Ocultar la tabla anterior de meses
    this.mostrarTablasemana = false; // Ocultar la tabla anterior de semanas
  
    // Agregar la lógica para mostrar la imagen y la línea <div> aquí
    if (!this.ingredientesdiass || this.ingredientesdiass.length === 0) {
      this.mostrarImagen = true; // Mostrar la imagen
    } else {
      this.mostrarImagen = this.filtroSeleccionado === 'dia' || this.filtroSeleccionado === 'semana' || this.filtroSeleccionado === 'mes';
    }
  }
  
  
  
  
  mostrarMensajeError: boolean = false;

  showModalError() {
    this.mostrarMensajeError = true;
    swal({
      title: "No existe reporte de ese ingrediente para esa fecha ",
      icon: "error",
    });
  }

  showModalErrorsemana() {
    this.mostrarMensajeError = true;
    swal({
      title: "No existe reporte de ese ingrediente para esas fechas ",
      icon: "error",
    });
  }
  showModalErrormes() {
    this.mostrarMensajeError = true;
    swal({
      title: "No existe reporte de ese ingrediente para ese mes ",
      icon: "error",
    });
  }



  meses: string[] = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  
}


