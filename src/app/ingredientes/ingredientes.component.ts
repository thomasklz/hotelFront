import { Component, OnInit,ViewChild  } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { FormBuilder,  FormControl,  FormGroup,  Validators,} from "@angular/forms";
import { Router } from "@angular/router";
import { MatTableDataSource } from "@angular/material/table";
import swal from "sweetalert";
import swal2 from "sweetalert";
import Swal from "sweetalert2";
import { IngredientesService } from "../servicios/ingredientes.service";
import { AlimentosService } from "app/servicios/alimentos.service";
import { MenuService } from "app/servicios/menu.service";
import { PesosService } from "app/servicios/pesos.service";
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
 import { debounceTime, startWith, map } from 'rxjs/operators';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatPaginator } from '@angular/material/paginator';
import { data } from 'jquery';
import {Observable, Observer} from 'rxjs';

import * as XLSX from 'xlsx';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as FileSaver from 'file-saver';
 import { ImageService } from "app/servicios/image.service";

 

  import { saveAs } from 'file-saver';
import { RecetarioService } from 'app/servicios/recetario.service';
 

  export interface ExampleTab {
    label: string;
    content: string;
  }
  
   

  @Component({
    selector: "app-ingredientes",
    templateUrl: "./ingredientes.component.html",
  
    styleUrls: ["./ingredientes.component.scss"],
  })
  export class IngredientesComponent implements OnInit {
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatAutocomplete) autocomplete: MatAutocomplete;

  id: string = "";
  estado: boolean = true;
    id_plato: string = "";
  id_alimento: string[] = [];
   productosplatosss: any[] = [];
  datosRecetariosss: any[] = [];
   descripcplato: any[] = [];
   alimentoss: any[] = [];
   tituloForm;
  ingredientId: string = "";
  listaId: string = "";
  platoId: string = "";
  
  ingredientesForm!: FormGroup;
  listaPlatos: any[] = [];

   editandoIngredientes: boolean = false;
  idIngredientesEditar: string = "";
  showIdplatoError = false;
  showCantidadPersonaError = false;
  showIdalimentoError = false;
  showIdPlatoError = false;
  showAlimentoError = false;

  

   selectedOptionplato: any = null;
  selectedOptionalimento: any = null;

  mostrarTabla: boolean = false;

  filteredToppings: Observable<string[]>;
  @ViewChild('auto') autoCompleteInput: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private http: HttpClient,
    private IngredientesService: IngredientesService,
    private AlimentosService: AlimentosService,
    private imageService:ImageService,
    private MenuService: MenuService,
    private PesosService: PesosService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
   private RecetarioService: RecetarioService
  ) {
    this.alimentosSeleccionadosControl = new FormControl([]);

  }
  alimentosSeleccionadosControl: FormControl;

  ngOnInit() {

    this.obtenerListaplatosconIngrediente();
    this.getAllRecetarioPlatos();
    $('#ventanaForm').on('hidden.bs.modal', () => {
      this.ingredientId = ''; // Limpiar el campo de búsqueda al cerrar la modal
    });
    this.loadAsyncTabs(); 
 
    this.ingredientesForm = this.formBuilder.group({
      id_plato: ["", [Validators.required, Validators.maxLength(1)]],
  id_alimentos: this.alimentosSeleccionadosControl, // Agrega el FormControl aquí
  cantidadPersonaCome: [""],
       
    });
  
  }
  asyncTabs: Observable<ExampleTab[]>;
  loadAsyncTabs() {
    this.asyncTabs = new Observable((observer: Observer<ExampleTab[]>) => {
      observer.next([
        { label: 'Receta para un sólo menú', content: 'Content 1' },
        { label: 'Receta para n menú', content: 'Content 2' },
      ]);
    });
  }
  
  filtrarIngredientes(termino: string): void {
    const terminoLowerCase = termino.toLowerCase();
  
    // Filtrar ingredientes según el término de búsqueda
    this.ingredientesUnicos.forEach((ingrediente) => {
      ingrediente.visible = ingrediente.descripcion.toLowerCase().includes(terminoLowerCase);
    });
  }
         
  showModal() {
    swal2({
      title: 'Datos registrado exitosamente',
      icon: 'success',
    }).then(() => {
      this.ingredientesSeleccionados = [];
      this.id_alimento = [];

      // Otro código necesario

    });
  }
  
  showModalErrorM() {
    swal({
      title: "No se han seleccionado productos o plato ",
      icon: "error",
    });
  }

  showModalErrorr() {
    swal({
      title: "Error de registro de datos, ya existe un registro con este plato  ",
      icon: "error",
    });
  }
  ingredientesUnicos: any[] = [];
  




  ingredientesSeleccionados: any[] = []; 
  descripcion: string = '';
  alimentosSeleccionados: any[] = [];
  
  
 
  buscarIngredientePorIdRecetario() {
    // Verificar que this.platoId no sea undefined o null antes de continuar
    if (this.platoId) {
      // Asignar el valor de this.platoId a params
      const params = { descripcion: this.platoId };
  
      // Envía la solicitud GET con la descripción del plato como parámetro de ruta
      this.RecetarioService.buscarPlatoRecetario(params)
        .subscribe((data: any) => {
          if (data.platos.length > 0) {
            // Obtener el primer plato encontrado en la respuesta
            const platoEncontrado = data.platos[0];
  
            // Asignar el ID del plato encontrado a platoId
            this.platoId = platoEncontrado.id;
            console.log("ID del plato encontrado:", this.platoId);

            // Asignar los ingredientes del plato a datosRecetariosss
            this.datosRecetariosss = platoEncontrado.ingredientes;
            this.alimentosFiltrados = this.datosRecetariosss; 
            console.log("Ingredientes del plato encontrado:", this.datosRecetariosss);

            this.datosRecetariosss.forEach(alimento => {
              alimento.selected = true;
              
              alimento.cantidadPersonaCome = 0;
            });
          } else {
            // Si no se encuentra ningún plato, puedes manejar la situación de alguna manera
            console.log("No se encontró ningún plato para la descripción:", this.ingredientId);
            this.platoId = null; // Puedes asignar null al platoId si no se encuentra ningún plato
            this.datosRecetariosss = []; // También puedes vaciar los ingredientes
          }
        });
    } else {
      console.error("this.platoId es indefinido o null. No se puede realizar la solicitud GET.");
    }
  }
  
  
  ingredientedescripcionsss: any[] = [];

  buscarIngredientePorId() {
    this.productosplatosss = [];

    if (this.listaId) {
      this.RecetarioService.getplatoconIngredienteporid(this.listaId).subscribe({
        next: (res: any) => {
          if (res.productosplato.length === 0) {
            this.showModalErrorsindatos();
          } else {
            this.productosplatosss = res.productosplato;

            this.mostrarTabla = true;
          }
        },
        error: (err) => {
          console.error(err);
          this.showModalErrorsindatos();
        },
      });

      this.buscarDescripcionporId();
    } else {
      this.ingredientedescripcionsss = [];
    }
  }
 
  buscarDescripcionporId() {
    if (this.listaId) {
      this.RecetarioService.getobtenerDescripcionPlatoproductos(
        this.listaId
      ).subscribe({
        next: (res: any) => {
          this.ingredientedescripcionsss = res.productosplato;

          if (this.ingredientedescripcionsss.length === 0) {
            this.ingredientedescripcionsss = [];
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
    } else {
      this.ingredientedescripcionsss = [];
    }
  }

   
  showModalErrorsindatos() {
    swal({
      title: "No existen ingredientes para ese plato",
      icon: "error",
    });
  }

 
  getAllRecetarioPlatos() {
    this.RecetarioService.obtenerplatosdeproductos().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.platosUnicos);
        this.descripcplato = res.platosUnicos;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  obtenerListaplatosconIngrediente() {
    this.RecetarioService.obtenerListaplatosconIngrediente().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.platosUnicos);
        this.listaPlatos = res.platosUnicos;
        console.log("lista",this.listaPlatos)
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  

  updateTotal() {
    // Obtener todos los platos seleccionados
    this.alimentosSeleccionados = this.datosRecetariosss.filter(platos => platos.selected);
  
    // Verificar si se encontraron platos seleccionados
    if (this.alimentosSeleccionados.length > 0) {
      console.log("Platos seleccionados:", this.alimentosSeleccionados);
    } else {
      console.log("Ningún plato seleccionado");
    }
  
    // Mostrar lo que se ha seleccionado en la consola antes de enviar los datos al backend
   
    // Actualizar los valores en el formulario después de cada cambio
    this.updateFormValues();
  }
  
  updateFormValues() {
    // Actualizar los valores de platos seleccionados en el formulario
    this.ingredientesForm.patchValue({
      descripcion: this.alimentosSeleccionados.map(platos => platos.descripcion),
       unidadMedida: this.alimentosSeleccionados.map(platos => platos.unidadMedida),
 
      cantidad: this.alimentosSeleccionados.map(platos => platos.cantidad)

     
     
     
      
    });
  }
  allSelected: boolean = false;

  toggleSelectAll(event: any) {
    const isChecked = event.target.checked;
    this.datosRecetariosss.forEach(alimentos => alimentos.selected = isChecked);
    this.allSelected = isChecked;
    this.updateTotal();
    this.updateFormValues();
  }

  checkIfAllSelected() {
    this.allSelected = this.datosRecetariosss.every(alimentos => alimentos.selected);
  }
  
  filtro: string = '';

  filtrarPlatos() {
    // Convertir el texto de búsqueda y el nombre de los platos a minúsculas
    const textoBusqueda = this.filtro.toLowerCase();
    this.alimentosFiltrados = this.dataSource.data.filter(alimentos => {
      // Convertir el nombre del plato a minúsculas y eliminar espacios en blanco alrededor
      const nombrePlato = alimentos.nombre.toLowerCase().trim();
      // Verificar si el nombre del plato contiene el texto de búsqueda
      return nombrePlato.includes(textoBusqueda);
    });
  }



  alimentosFiltrados: any[] = []; 
   
  total: number = 0;
  pageSizecc: number = 5;
  pageIndex: number = 0;
  
    prevPage() {
      if (this.pageIndex > 0) {
        this.pageIndex--;
      }
    }
  
    nextPage() {
      const maxPageIndex = Math.max(0, Math.ceil(this.alimentosFiltrados.length / this.pageSizecc) - 1);
      if (this.pageIndex < maxPageIndex) {
        this.pageIndex++;
      }
    }
  
    maxPageIndex(): number {
      return Math.max(0, Math.ceil(this.alimentosFiltrados.length / this.pageSizecc) - 1);
    }
  
  












   

  pageSize = 10;
  currentPage = 1;
  totalItems = 0;

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
    return this.productosplatosss.slice(this.startIndex, this.endIndex + 1);
  }

  pageSizes = 10;
  currentPages = 1;
  totalItemss = 0;

  get totalPagess(): number {
    return Math.ceil(this.totalItems / this.pageSizes);
  }

  get startIndexs(): number {
    return (this.currentPages - 1) * this.pageSizes;
  }

  get endIndexs(): number {
    return Math.min(this.startIndexs + this.pageSizes - 1, this.totalItemss - 1);
  }

  get pagedMenuss(): any[] {
    return this.ingredientesUnicos.slice(this.startIndexs, this.endIndexs + 1);
  }

 
  onPageChange(event: number) {
    this.currentPage = event;
  }
   

  nuevoCurso() {
      this.datosRecetariosss.forEach(alimento => {
      alimento.selected = false;
      alimento.cantidadPersonaCome = 0;
    });
    this.pageIndex = 0;
  
    // Forzar la detección de cambios
    this.cdr.detectChanges();
    this.mostrarTabla = false;
    this.tituloForm = "Registro de receta ";
    this.cdr.detectChanges();

    this.ingredientesForm.reset();
    this.editandoIngredientes = false;
    this.idIngredientesEditar = "";

    this.selectedOptionalimento = null;
    this.ingredientesForm.get("id_alimento")?.setValue(null);

    this.selectedOptionplato = null;
    this.ingredientesForm.get("id_plato")?.setValue(null);

    this.showIdalimentoError = false;
    this.showIdplatoError = false;
    this.showAlimentoError = false;
    this.showCantidadPersonaError = false;

    this.ingredientesSeleccionados = [];

  }

  

platoSeleccionado: { id: number | null; descripcion: string } = {
  id: null,
  descripcion: "",
};

alimentoSeleccionado: { id: number | null; descripcion: string } = {
  id: null,
  descripcion: "",
};

updatePlatoId(event: any) {
  const descripcion = event.target.value;
  const platoSeleccionado = this.descripcplato.find(
    (plato) => plato.descripcion === descripcion
  );
  this.platoSeleccionado = platoSeleccionado || {
    id: null,
    descripcion: descripcion,
  };
  this.ingredientesForm.get("id_plato")?.setValue(this.platoSeleccionado.id);
  this.platoId = this.platoSeleccionado.descripcion;
}

  cantidadPersonaCome:any;
 

  addIngredientes() {
    console.log("Datos a enviar:", this.alimentosSeleccionados); // Para depuración
  
    // Obtener el ID del plato seleccionado del formulario
    const idPlato = this.ingredientesForm.get('id_plato').value;
     console.log("ID del plato:", idPlato); // Para depuración
  
    if (this.alimentosSeleccionados.length > 0 && idPlato) {
      // Construir el array de id_alimentos
      const idAlimentos = this.alimentosSeleccionados.map(alimento => ({
        id_alimento: alimento.id, // Asegúrate de usar la propiedad correcta que contiene el ID del alimento
        cantidadPersonaCome: alimento.cantidadPersonaCome
      }));
  
      // Datos a enviar
      const data = {
        id_plato: idPlato,
        id_alimentos: idAlimentos
      };
  
      console.log("Datos a enviar:", data); // Para depuración
  
      // Llamar al servicio para guardar los datos
      this.RecetarioService.crearplatoconIngrediente(data).subscribe(
        (result: any) => {
          this.obtenerListaplatosconIngrediente();
          this.resetFormulario();
          this.resetForm();
          this.showModal();
          this.ingredientId = null;
          this.ingredientesForm.reset();
          // Manejar respuesta exitosa
          console.log("Respuesta del servidor:", result); // Para depuración
        },
        (error) => {
          console.error("Error al guardar crédito:", error);
          if (error.status === 400 && error.error && error.error.message === 'Este plato ya existe') {
            this.showModalErrorPlatoExistente();

            this.resetForm();
          } else {
            this.showModalError(error.error); // Mostrar mensaje de error
            this.resetForm();
          }
        }
      );
    } else {
      this.showModalErrorCamposFaltantes();
      this.resetForm();
    }
  }
  
  showModalErrorPlatoExistente() {
    swal({
      title: "Error al registrar productos con su plato",
      text: "Este plato ya existe.",
      icon: "error",
    });
  }
  
  showModalErrorCamposFaltantes() {
    swal({
      title: "Campos requeridos faltantes",
      text: "Asegúrate de seleccionar alimentos y el plato válido.",
      icon: "error",
    });
  }
  
  showModalError(error: any) {
    let errorMessage = "Error de registro de datos";
    if (error && error.errores && error.errores.length > 0) {
     errorMessage = error.errores[0].message;
    }
    swal({
      title: "Error de registro de datos",
      text:errorMessage,
      icon: "error",
    });
  }
  
  resetFormulario() {
    this.ingredientesForm.reset(); // Restablecer los valores del formulario
    this.ingredientesForm.reset(); // Restablecer los valores del formulario
    const filtroSelect = document.getElementById("filtroSelect") as HTMLSelectElement;
    if (filtroSelect) {
      filtroSelect.value = "Seleccionar";
    }
  
  }  
  

  showModalEliminar(id: any) {
    Swal.fire({
      title: "¿Estás seguro que deseas eliminar el ingrediente?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#bf0d0d",
    }).then((result) => {
      if (result.isConfirmed) {

      }
    });
  }

  showModalErrorEliminar() {
    Swal.fire({
      title: "Error al eliminar el alimento",
      icon: "error",
    });
  }

  

  closeModal() {
    this.ingredientesForm.reset();
    this.editandoIngredientes = false;
    this.idIngredientesEditar = "";

    this.datosRecetariosss.forEach(alimento => {
      alimento.selected = false;
       
      alimento.cantidadPersonaCome = 0;
    });
    this.allSelected = false;
    this.pageIndex = 0;
  }

  
  
  resetForm() {
    this.ingredientesForm.reset();
    this.editandoIngredientes = false;
    this.idIngredientesEditar = "";
    this.ingredientesSeleccionados = [];

    this.platoSeleccionado = { id: null, descripcion: "" };
    this.alimentoSeleccionado = { id: null, descripcion: "" };

    this.showIdplatoError = false;
     this.showIdalimentoError = false;
     this.showCantidadPersonaError = false;
     this.datosRecetariosss.forEach(alimento => {
      alimento.selected = false;
      
      alimento.cantidadPersonaCome = 0;
    });
    this.allSelected = false;
    this.pageIndex = 0;
  }
  
  
  
  
  

  closeModalAfterSave() {
    this.resetForm();
  }
   

  closeModalAfterCancel() {
    this.resetForm();
  }
 
  

    cantidad:number;
    
    descargarPDF() {
      const n = this.cantidad;
      const rows = this.productosplatosss.map((item, index) => [
        (index + 1).toString(), // Número
        item.alimento.descripcion, // Producto
        item.unidadMedida.unidadMedida, // Unidad de medida
        item.cantidadPersonaCome,
        `${item.cantidadPersonaGramo} ${this.getUnidadMedida(item.unidadMedida.unidadMedida.toLowerCase())}`, // Porción por persona
        `${item.cantidadPersonaGramo * this.cantidad} ${this.getUnidadMedida(item.unidadMedida.unidadMedida.toLowerCase())}` // Porción para n personas
      ]);
    
      const anchoPagina = 595.28;
      let columnWidths = [30, 70, 70, 70, 70, 70]; // Ajusta según tus necesidades
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
                { text: `Menú: ${this.ingredientedescripcionsss[0].plato.descripcion}`, bold: true, fillColor: '#D3D3D3', border: [true, true, true, true] },
                { text: `Cantidad de personas: ${this.cantidad}`, bold: true, fillColor: '#D3D3D3', border: [true, true, true, true] },
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
            { text: 'INFORME DE PRODUCTOS CON SU MENÚ', style: 'header', alignment: 'center' },
            '\n\n',
            { text: 'Cálculos para menú-persona', style: 'subheader', alignment: 'left', bold: true },
            '\n',
            ingredientHeaders,
            {
              // Contenedor externo para la tabla
              alignment: 'center',
              table: {
                headerRows: 1,
                // Ancho de la tabla
                widths: columnWidths,
                // Alineación de la tabla en el centro
                alignment: 'center',
                body: [
                  ['Nº', 'Producto', 'Unidad de medida', 'Cantidad persona come', 'Porción por persona', `Porción para ${n} personas`].map((cell, index) => ({
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
        pdfMake.createPdf(documentoPDF).download('INFORME_DE_PRODUCTOS_CON_SU_MENÚ.pdf');
      });
    }

    descargarExcel() {
      const n = this.cantidad;
      const ExcelJS = require('exceljs');
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Informe de productos con su menú');
      
      // Organizar créditos por persona
      const creditosPorPersona = {};
      
      this.ingredientedescripcionsss.forEach(item => {
      const platoDescripcion = `Menú: ${item.plato.descripcion}`;
       const cantidadpersona = `Cantidad de personas: ${this.cantidad}`;
       
      const row = worksheet.addRow([platoDescripcion ,cantidadpersona]);
      
      row.eachCell(cell => {
          cell.font = { size: 12, bold: true }; // Letra más grande y negrita
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFCCCCFF' } }; // Fondo color (lavanda)
      });
      });
      
      // Agregar encabezados de la tabla
      const headers = [
        'Nº', 'Producto', 'Unidad de medida','Cantidad persona come             ', 'Porción por cantidad de persona',`Porción para ${n} personas`   ];
      
      worksheet.addRow(headers);
      worksheet.getRow(worksheet.lastRow.number).font = { bold: true }; // Negrita para encabezado
      
      // Establecer estilos para encabezados
      worksheet.getRow(worksheet.lastRow.number).eachCell(cell => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD3D3D3' } }; // Fondo gris (plomo)
      });
      
      // Agregar datos a la hoja de cálculo
      this.productosplatosss.forEach((item, index) => {
      const rowData = [
          index + 1,
          
          item.alimento.descripcion, // Producto
          item.unidadMedida.unidadMedida, // Unidad de medida
          item.cantidadPersonaCome,
          `${item.cantidadPersonaGramo} ${this.getUnidadMedida(item.unidadMedida.unidadMedida.toLowerCase())}`, // Porción por persona
          `${item.cantidadPersonaGramo * this.cantidad} ${this.getUnidadMedida(item.unidadMedida.unidadMedida.toLowerCase())}` // Porción para n personas
      
          
           
      ];
      
      worksheet.addRow(rowData);
      });
      
      // Establecer estilos para datos
      for (let i = worksheet.lastRow.number - this.productosplatosss.length + 1; i <= worksheet.lastRow.number; i++) {
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
      saveAs(new Blob([buffer]), 'Informe de productos con su menú.xlsx');
      });
      }
      
    
    getUnidadMedida(unidad: string): string {
      switch (unidad) {
        case 'libra':
        case 'kilo':
        case 'onza':
        case 'atado':
        case 'medio atado':
        case '1/2 atado':
        case 'cucharada':
        case 'taza':
          return 'gramos';
        case 'litro':
        case 'vaso':
        case 'cucharadita':
          return 'mililitros';
        case 'pieza':
        case 'unidad':
        case 'cubeta':
          return 'unidad';
        default:
          return '';
      }
    }
    
    









    

}


