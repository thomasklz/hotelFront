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

  constructor(private AlimentosService: AlimentosService,private formBuilder:FormBuilder) {}


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
    this.AlimentosService.getalimentos().subscribe({
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
  const rows = [];

  // Agregar el encabezado de la tabla
  const headerRow = ['Ingrediente', 'Fecha', 'Total de libras/litros'];
  rows.push(headerRow);

  // Iterar sobre los datos y agregar filas
  this.ingredientesdiass.forEach((item) => {
    const rowData = [
    
      item.id_alimento,
      item.fecha,
      item.totalCantidadFinal,
    
    ];
    rows.push(rowData);
  });

  // Define la estructura del documento PDF
 
  const anchoPagina = 595.28; // Ancho de la página A4 en puntos
  let columnWidths = [60, 65, 105,]; // Anchos de las 9 columnas
  const totalWidth = columnWidths.reduce((total, width) => total + width, 0);
  let escala = 1;
  
  if (totalWidth > anchoPagina) {
    escala = anchoPagina / totalWidth;
    columnWidths = columnWidths.map(width => width * escala);
  }
  
  const documentoPDF = {
    content: [
      { text: 'Reporte de Ingrediente por Día ', style: 'header' },
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
  pdfMake.createPdf(documentoPDF).download('tabla.pdf');
}
  datosParaDescargar: any[] = []; // Variable para almacenar los datos a descargar
  descargarDatosxDias() {
    const datosParaDescargar = this.ingredientesdiass.map(item => ({
      'Ingrediente':  item.id_alimento,
      'Fecha':  item.fecha,
      'Total de libras/litros': item.totalCantidadFinal,

     
     
      
     
    }));
  
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosParaDescargar);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte de Ingrediente por Día');
    const excelArray = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([new Uint8Array(excelArray)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Reporte de Ingrediente por Día.xlsx';
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
  
  



    //-----Metodos de pdf y excel por  Semana 
descargarPDFxSemana() {
  const rows = [];

  // Agregar el encabezado de la tabla
  const headerRow = ['Ingrediente', 'Fecha Inicio', 'Fecha Fin', 'Total de libras/litros'];
  rows.push(headerRow);

  // Iterar sobre los datos y agregar filas
  this.ingredientesdiass.forEach((item) => {
    const rowData = [
    
      item.id_alimento,
      item.fechaInicio,
      item.fechaFin,
      item.totalCantidadFinal,
    
    ];
    rows.push(rowData);
  });

  // Define la estructura del documento PDF
 
  const anchoPagina = 595.28; // Ancho de la página A4 en puntos
  let columnWidths = [60, 65, 65, 105,]; // Anchos de las 9 columnas
  const totalWidth = columnWidths.reduce((total, width) => total + width, 0);
  let escala = 1;
  
  if (totalWidth > anchoPagina) {
    escala = anchoPagina / totalWidth;
    columnWidths = columnWidths.map(width => width * escala);
  }
  
  const documentoPDF = {
    content: [
      { text: 'Reporte de Ingrediente por Semana ', style: 'header' },
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
  pdfMake.createPdf(documentoPDF).download('tabla.pdf');
}

//---------------------
descargarDatosxSemana() {
  const datosParaDescargar = this.ingredientesdiass.map(item => ({
    'Ingrediente': item.id_alimento,
    'Fecha Inicio': item.fechaInicio,
    'Fecha Fin': item.fechaFin,
    'Total de libras/litros': item.totalCantidadFinal,
  }));

  const nombreHoja = 'data'; // Ajusta el nombre de la hoja según tus necesidades

  this.descargarExcel(datosParaDescargar, nombreHoja);
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
  const rows = [];

  // Agregar el encabezado de la tabla
  const headerRow = ['Ingrediente', 'Mes', 'Total de libras/litros'];
  rows.push(headerRow);

  // Iterar sobre los datos y agregar filas
  this.ingredientesdiass.forEach((item) => {
    const rowData = [
    
      item.id_alimento,
      item.mes,
      item.sumaCantidadFinal,
    
    ];
    rows.push(rowData);
  });

  // Define la estructura del documento PDF
 
  const anchoPagina = 595.28; // Ancho de la página A4 en puntos
  let columnWidths = [60, 60, 105,]; // Anchos de las 9 columnas
  const totalWidth = columnWidths.reduce((total, width) => total + width, 0);
  let escala = 1;
  
  if (totalWidth > anchoPagina) {
    escala = anchoPagina / totalWidth;
    columnWidths = columnWidths.map(width => width * escala);
  }
  
  const documentoPDF = {
    content: [
      { text: 'Reporte de Ingrediente por Mes ', style: 'header' },
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
  pdfMake.createPdf(documentoPDF).download('tabla.pdf');
}

//---------------------
  descargarDatosxMes() {
    const datosParaDescargar = this.ingredientesdiass.map(item => ({
      'Ingrediente':  item.id_alimento,
      'Mes':  item.mes,
      'Total de libras/litros': item.sumaCantidadFinal,

     
     
      
     
    }));
  
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosParaDescargar);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte de Ingrediente por Mes');
    const excelArray = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([new Uint8Array(excelArray)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Reporte de Ingrediente por Mes.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  




  //-----------------------------------------------------------------------------
  filtroAnterior: string | null = null;

  // ... otros métodos

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
  }


  showModalError() {
    swal({
      title: "No existe reporte de ese ingrediente para esa fecha ",
      icon: "error",
    });
  }

  showModalErrorsemana() {
    swal({
      title: "No existe reporte de ese ingrediente para esas fechas ",
      icon: "error",
    });
  }
  showModalErrormes() {
    swal({
      title: "No existe reporte de ese ingrediente para ese mes ",
      icon: "error",
    });
  }
}


