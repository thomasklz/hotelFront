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

  constructor(private CreditosService:CreditosService,private formBuilder:FormBuilder, private MenuService :MenuService) { }

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
    this.MenuService.gettplato().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.platos);
        this.platosss = res.platos;
      },
      error: (err) => {
        //alert("Error en la carga de datos");
      },
    });
  }




    //--------------metodo para buscar el reporte de ingresos del plato segun la fecha-----------------------------
    Reporteingresosplatos  () {
     
      this.reportesss = [];
    
      // Asegúrate de que tanto idAlimento como fechaSeleccionada estén definidos antes de hacer la llamada
      if (this.idPlato && this.fechaSeleccionada) {
        const fecha = this.fechaSeleccionada;
    
  this.CreditosService.ingresos(fecha, this.idPlato).subscribe({
    next: (res: any) => {
      if (res && res.reporte) {
        if (res.reporte.length === 0) {
        
          console.log("No se encontraron datos para esta fecha y plato.");
        } else {
        
        // Asigna los datos al arreglo ingredientesdiass
          this.reportesss = [res.reporte];
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


    showModalError() {
      swal({
        title: "No existe reporte de ese plato para esa fecha ",
        icon: "error",
      });
    }



        //-----Metodos de pdf y excel por  Semana 
        descargarPDF() {
          const rows = [];
        
          // Agregar el encabezado de la tabla en negrita
          const headerRow = [
            { text: 'Plato', bold: true },
            { text: 'Fecha', bold: true },
            { text: 'Con créditos', bold: true },
            { text: 'Sin créditos', bold: true },
          ];
          rows.push(headerRow);
        
          // Iterar sobre los datos y agregar filas
          this.reportesss.forEach((item) => {
            const rowData = [
              item.plato,
              item.fecha,
              item.conCreditos,
              item.sinCreditos,
            ];
            rows.push(rowData);
          });
        
          // Define la estructura del documento PDF
          const anchoPagina = 595.28; // Ancho de la página A4 en puntos
          let columnWidths = [110, 90, 90, 90]; // Anchos de las 4 columnas
          const totalWidth = columnWidths.reduce((total, width) => total + width, 0);
          let escala = 1;
        
          if (totalWidth > anchoPagina) {
            escala = anchoPagina / totalWidth;
            columnWidths = columnWidths.map((width) => width * escala);
          }
        
          const documentoPDF = {
            content: [
              { text: 'Reporte de ingresos de plato por día', style: 'header' },
              '\n',
              {
                table: {
                  headerRows: 1,
                  widths: columnWidths,
                  body: rows,
                },
                layout: {
                  hLineWidth: function () {
                    return 1;
                  },
                  vLineWidth: function () {
                    return 1;
                  },
                  hLineColor: function () {
                    return '#ccc';
                  },
                  vLineColor: function () {
                    return '#ccc';
                  },
                  paddingLeft: function () {
                    return 10;
                  },
                  paddingRight: function () {
                    return 10;
                  },
                  paddingTop: function () {
                    return 10;
                  },
                  paddingBottom: function () {
                    return 10;
                  },
                },
              },
            ],
            styles: {
              header: {
                fontSize: 18,
                bold: true,
                alignment: 'center',
                margin: [0, 20, 0, 20], // Ajustar el margen superior e inferior
              },
            },
          };
        
          pdfMake.vfs = pdfFonts.pdfMake.vfs;
          pdfMake.createPdf(documentoPDF).download('reporte_ingresos_platoXdia.pdf');
        }
        

//---------------------
descargarDatos() {
  const datosParaDescargar = this.reportesss.map(item => ({
    'Plato': item.plato,
    'Fecha ': item.fecha,
    'Con créditos': item.conCreditos,
    'Sin créditos': item.sinCreditos,
  }));

  const nombreHoja = 'data'; // Ajusta el nombre de la hoja según tus necesidades

  this.descargarExcel(datosParaDescargar, nombreHoja);
}

descargarExcel(datos: any[], nombreHoja: string) {
  const workSheet = XLSX.utils.json_to_sheet(datos);
  const workBook: XLSX.WorkBook = { Sheets: { [nombreHoja]: workSheet }, SheetNames: [nombreHoja] };
  const excelBuffer: any = XLSX.write(workBook, { bookType: 'xlsx', type: 'array' });

  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  FileSaver.saveAs(blob, 'Reporte de ingresos de plato por dia .xlsx');
}
}
