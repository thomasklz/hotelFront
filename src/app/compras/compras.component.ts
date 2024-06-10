import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
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
import { Observable, Observer } from 'rxjs';
import { debounceTime, startWith, map } from 'rxjs/operators';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatPaginator } from '@angular/material/paginator';
import { data } from 'jquery';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import * as XLSX from 'xlsx';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as FileSaver from 'file-saver';
import { ImageService } from "app/servicios/image.service";
declare var $: any;

import { saveAs } from 'file-saver';
import { ComprasService } from 'app/servicios/compras.service';

export interface ExampleTab {
  label: string;
  content: string;
}

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.scss']
})
export class ComprasComponent implements OnInit {
  @ViewChild('ventanaForm') ventanaForm!: any;

  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatAutocomplete) autocomplete: MatAutocomplete;

  id: string = "";
  estado: boolean = true;
  precio: string = "";
  id_unidadMedida: string = "";
  id_alimento: string[] = [];
  alimentosss: any[] = [];
  comprasss: any[] = [];

  compratodosss: any[] = [];
  compraconexistenciasss: any[] = [];
  comprasinexistenciasss: any[] = [];

  descripcplato: any[] = [];
  ingredientedescripcionsss: any[] = [];
  tituloForm;
  ingredientId: string = "";
  ingredientesForm!: FormGroup;
  editandoIngredientes: boolean = false;
  idIngredientesEditar: string = "";

  showCantidadPersonaError = false;
  showIdalimentoError = false;
  showAlimentoError = false;
  showPrecioError = false;
  platoDescripcion: string = "";
  alimentoDescripcion: string = "";
  showMoreOptionsplato: boolean = false;
  showMoreOptionsalimento: boolean = false;
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
    private imageService: ImageService,
    private dialog: MatDialog,
    private MenuService: MenuService,
    private PesosService: PesosService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private ComprasService: ComprasService,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.fechaControl.setValue(this.getCurrentDate());
    this.getAllalimento();
    this.mostrarCompra();
    this.loadAsyncTabs();
    this.mostrarCompratodo();
    this.mostrarCompraExistente();
    this.mostrarCompraNoExistente();
    this.buscarFechaCompra();

    this.ingredientesForm = this.formBuilder.group({
      id_alimento: ["", Validators.required],
      cantidadmedidaUnidad: ["", Validators.required],
      precio: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{0,2})?$/)]],
      fecha: [this.getCurrentDate(), Validators.required]
    });

    this.mostrarImagen = true; // Mostrar la imagen inicialmente
  }
  get showPrecioError3() {
    const precioControl = this.ingredientesForm.get('precio');
    return precioControl.invalid && precioControl.dirty && !precioControl.errors?.required;
  }
  mostrarContenido: boolean = true;
  actualizando: boolean = false; // Variable para controlar si se está actualizando

  // Función para manejar el evento de clic en el botón "Refrescar"
  Actualizar() {
    this.filtroSeleccionado2 = "";
    this.mostrarSeleccionar = true;
    this.filtro = "";
    this.fechaSeleccionada = "";
    this.fechacomprasss = null;
    this.actualizando = true; 
    // Mostrar la imagen al hacer clic en Actualizar
    this.mostrarImagen = true;
  
  
  }

  mostrarSpinner: boolean = false;
  filtroSeleccionado3: boolean = false; // Variable para controlar si se ha seleccionado un filtro

  onFilterChange() {
    this.filtroSeleccionado3 = true; 
    // Ocultar la imagen al cambiar el filtro
    this.mostrarImagen = false;
    this.actualizando = true; 
    // Mostrar el spinner
    this.mostrarSpinner = true;

    // Simular una carga durante 3 segundos
    this.mostrarSeleccionar = false;
    setTimeout(() => {
      this.mostrarSpinner = false;
    }, 800);
  }

  mostrarSeleccionar: boolean = true;
  filtroSeleccionado2: string = "";
  todoFiltro: string = "";
  consalidailtro: string = "";
  sinsalidaFiltro: string = "";
  asinsalidaFiltro: string = "";

 
  sumaPrecios: number = 0;
  mostrarImagen: boolean = false;


  buscarIngredientePorFiltro() {
    // Limpia el arreglo de ingredientes
    this.comprasss = [];

    switch (this.filtroSeleccionado2) {
      case 'todo':
       
        this.mostrarCompratodo();
       
        break;
      case 'conExistencia':
        this.mostrarCompraExistente();
       
        break;
      case 'sinExistencia':
        this.mostrarCompraNoExistente();
        
        break;
      case 'buscar':
        this.buscarFechaCompra();
        break;
      default:
        break;
    }
  }

  hideSelectText() {}

  asyncTabs: Observable<ExampleTab[]>;

  loadAsyncTabs() {
    this.asyncTabs = new Observable((observer: Observer<ExampleTab[]>) => {
      observer.next([
        { label: 'Registro de compra', content: 'Content 1' },
        { label: 'Filtros de compra', content: 'Content 2' },
      ]);
    });
  }

  fechaControl = new FormControl(this.getCurrentDate());

  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  filtrarIngredientes(termino: string): void {
    const terminoLowerCase = termino.toLowerCase();

    // Filtrar ingredientes según el término de búsqueda
    this.ingredientesUnicos.forEach((ingrediente) => {
      ingrediente.visible = ingrediente.descripcion.toLowerCase().includes(terminoLowerCase);
    });
  }

  getAllalimento() {
    this.AlimentosService.mostraralimentoss().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.alimentos);
        this.alimentosss = res.alimentos;
        console.log("sssss", this.alimentosss);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  mostrarCompra() {
    this.ComprasService.mostrarCompra().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.compras);
        this.comprasss = res.compras;
        this.totalItems = res.compras.length;
        console.log("estasss", this.comprasss);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  fechaSeleccionada: string = "";
  fechacomprasss: any[] = [];

  onDateSelected(event: any) {
    // Obtener la fecha seleccionada del evento
    this.fechaSeleccionada = event.target.value;
    // Ocultar la imagen al seleccionar una fecha
    this.mostrarImagen = false;
    // Llamar a la función para buscar compras con la fecha seleccionada
    this.buscarFechaCompra();
  }

  fechaMostrada:string;
  buscarFechaCompra() {
    this.ComprasService.buscarFechaCompra(this.fechaSeleccionada).subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.compras);
        this.fechacomprasss = res.compras;
        this.sumaPrecios=res.sumaPrecios;
        this.fechaMostrada = res.compras.length > 0 ? res.compras[0].fecha : null; // Almacenar la fecha una sola vez

        this.totalItems = res.compras.length;
        console.log("estasss", this.fechacomprasss);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  mostrarCompratodo() {
    
    this.ComprasService.mostrarCompra().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.compras);
         this.compratodosss = res.compras;
        this.totalItems = res.compras.length;
      },
      error: (err) => {},
    });
  }

  mostrarCompraNoExistente() {
    this.ComprasService.mostrarNoCompraExistente().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.compras);
        this.comprasinexistenciasss = res.compras;
        this.totalItems = res.compras.length;
        console.log("estasss", this.comprasinexistenciasss);
      },
      error: (err) => {},
    });
  }

  mostrarCompraExistente() {
    this.ComprasService.mostrarCompraExistente().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.compras);
        this.compraconexistenciasss = res.compras;
        this.totalItems = res.compras.length;
        console.log("estasss", this.comprasss);
      },
      error: (err) => {},
    });
  }

  nombreproductoFiltro: string = '';
  filtroSeleccionado: string = '';

  aplicarFiltros() {
    // Aplica los filtros aquí según el valor de filtroSeleccionado
    if (this.filtroSeleccionado === 'nombre') {
      // Aplica el filtro por nombre
      if (this.nombreproductoFiltro) {
        this.comprasss = this.alimentosssOriginal.filter(item => item.persona.nombre.includes(this.nombreproductoFiltro));
      } else {
        this.comprasss = [...this.alimentosssOriginal];
      }
      // Limpia el filtro de fecha
    }
  }

  totalPrecio: number = 0;

  botonBuscarPresionado = false;

  alimentoSeleccionado: { id: number | null; descripcion: string } = {
    id: null,
    descripcion: "",
  };

  addCompras() {
    console.log("Datos a enviar:", this.alimentosSeleccionados); // Para depuración

    // Obtener la fecha seleccionada del formulario
    const fecha = this.ingredientesForm.get('fecha').value;
    const precio = this.ingredientesForm.get('precio').value;
    const cantidadmedidaUnidad = this.ingredientesForm.get('cantidadmedidaUnidad').value;
    console.log("Fecha de la compra:", fecha); // Para depuración

    if (this.alimentoSeleccionado.id && fecha && precio && cantidadmedidaUnidad) {
      // Datos a enviar
      const data = {
        id_alimento: this.alimentoSeleccionado.id,
        cantidadmedidaUnidad: cantidadmedidaUnidad,
        precio: precio,
        fecha: fecha
      };

      console.log("Datos a enviar:", data); // Para depuración

      // Llamar al servicio para guardar los datos de compra
      this.ComprasService.gestionarAlimento(data).subscribe(
        (result: any) => {
          this.getAllalimento();
          this.mostrarCompra();
          this.mostrarCompraExistente();
          this.mostrarCompraNoExistente();
          this.mostrarCompratodo();
          this.buscarFechaCompra();
          this.resetFormulario();
          this.showModal();
          this.fechaControl.setValue(this.getCurrentDate());
          this.ingredientesForm.patchValue({ fecha: this.getCurrentDate() });

          // Manejar respuesta exitosa
          console.log("Respuesta del servidor:", result); // Para depuración
        },
        (error) => {
          console.error("Error al guardar compra:", error);
          this.showModalError(error.error); // Mostrar mensaje de error
        }
      );
    } else {
      this.showModalErrorCamposFaltantes();
    }
  }

  obtenerIngredientesUnicos() {
    const uniqueIngredientes = new Set(this.alimentosss.map(ingrediente => ingrediente.descripcion));
    this.ingredientesUnicos = Array.from(uniqueIngredientes).map(descripcion => ({ descripcion }));
  }

  updateAlimentoId(event: any) {
    const descripcion = event.target.value;
    const alimentos = this.alimentosss.find(p => p.descripcion === descripcion);
    if (alimentos) {
      this.alimentoSeleccionado = alimentos;
      this.ingredientesForm.get('id_alimento').setValue(alimentos.id);
      this.alimentosSeleccionados.push({
        id: alimentos.id,
        cantidadmedidaUnidad: this.ingredientesForm.get('cantidadmedidaUnidad').value,
        precio: this.ingredientesForm.get('precio').value,
        fecha: this.ingredientesForm.get('fecha').value,
      });
    }
  }

  showModal() {
    swal2({
      title: 'Datos registrado exitosamente',
      icon: 'success',
    }).then(() => {
      this.ingredientesSeleccionados = [];
      this.id_alimento = [];
      this.getAllalimento(); // Actualizar la lista de ingredientes
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

  showModalErrorsindatos() {
    swal({
      title: "No existen ingredientes para ese plato",
      icon: "error",
    });
  }

  showModalEdit() {
    swal2({
      title: "Datos modificado exitosamente",
      icon: "success",
    });
  }

  showModalErrorEdit() {
    swal({
      title: "Error de modificación de datos ",
      icon: "error",
    });
  }

  ingredientesUnicos: any[] = [];

  ingredientesSeleccionados: any[] = [];

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
    return this.comprasss.slice(this.startIndex, this.endIndex + 1);
  }

  onPageChange(event: number) {
    this.currentPage = event;
  }

  showId_cantidadplatoError = false;
  showId_precioError = false;

  nuevoCurso() {
    this.ingredientesForm.reset();
    this.ingredientesForm.patchValue({ fecha: this.getCurrentDate() });
    this.mostrarTabla = false;
    this.tituloForm = "Registros de compras de productos";
    this.cdr.detectChanges();

    this.editandoIngredientes = false;
    this.idIngredientesEditar = "";

    this.selectedOptionalimento = null;
    this.ingredientesForm.get("id_alimento")?.setValue(null);

    this.showIdalimentoError = false;
    this.showAlimentoError = false;
    this.showCantidadPersonaError = false;
    this.getAllalimento();
    this.ingredientesSeleccionados = [];
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
      text: errorMessage,
      icon: "error",
    });
  }

  resetFormulario() {
    this.alimentosSeleccionados = [];
    this.ingredientesForm.reset(); // Restablecer los valores del formulario

    this.filtro = ""; // Limpiar el filtro de búsqueda de platos
    this.total = 0; // Restablecer el total a cero

    this.ingredientesForm.reset(); // Restablecer los valores del formulario
    const filtroSelect = document.getElementById("filtroSelect") as HTMLSelectElement;
    if (filtroSelect) {
      filtroSelect.value = "Seleccionar";
    }
    this.alimentosFiltrados.forEach(alimentos => {
      alimentos.selected = false;
    });
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
        this.eliminarIngrediente(id);
        this.getAllalimento();
        this.mostrarCompra();
      }
    });
  }

  showModalErrorEliminar() {
    Swal.fire({
      title: "Error al eliminar el alimento",
      icon: "error",
    });
  }

  eliminarIngrediente(id: number) {
    this.ComprasService.deletealimentos(id).subscribe({
      next: (res) => {
        this.mostrarCompra();
        Swal.fire({
          title: "Datos eliminados exitosamente",
          icon: "success",
        }).then(() => {});
      },
      error: () => {
        this.showModalErrorEliminar();
      },
    });
  }

  closeModal() {
    this.dialog.closeAll();
    this.ingredientesForm.reset();
    this.editandoIngredientes = false;
    this.idIngredientesEditar = "";
    $(this.elementRef.nativeElement).find('.modal').modal('hide');
  }

  closeModalAfterCancel() {
    this.resetForm();
    this.ventanaForm.nativeElement.modal('hide');
    $(this.elementRef.nativeElement).find('.modal').modal('hide');
  }

  resetForm() {
    this.ingredientesForm.reset();
    this.editandoIngredientes = false;
    this.idIngredientesEditar = "";
    this.ingredientesSeleccionados = [];

    this.alimentoSeleccionado = { id: null, descripcion: "" };

    this.showPrecioError = false;
    this.showIdalimentoError = false;
    this.showCantidadPersonaError = false;
  }

  closeModalAfterSave() {
    this.resetForm();
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

  alimentosssOriginal: any[] = [];

  alimentosFiltrados: any[] = []; // Variable para almacenar platos filtrados

  // Asegúrate de que platoSeleccionado sea una lista
  alimentosSeleccionados: any[] = [];

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

  
  
  

  descargarExcel() {
    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('INFORME DE COMPRA PRODUCTOS');

    // Organizar créditos por persona
    const creditosPorPersona = {};

    // Agregar encabezados de la tabla
    const headers = [
      'Nº', 'Producto', 'Unidad de medida', '  Cantidad de medida', '   Precio unitario', 'Precio', 'Porción'
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
    this.comprasss.forEach((item, index) => {
      const rowData = [
        index + 1,
        item.alimento.descripcion, // Producto
        item.unidadMedida.unidadMedida, // Unidad de medida
        item.cantidadmedidaUnidad,
        this.formatPrice(item.preciounidad),
        this.formatPrice(item.precio),
        `${item.porcion} ${this.getUnidadMedida(item.unidadMedida.unidadMedida.toLowerCase())}`, // Porción por persona
      ];

      worksheet.addRow(rowData);
    });

    // Establecer estilos para datos
    for (let i = worksheet.lastRow.number - this.comprasss.length + 1; i <= worksheet.lastRow.number; i++) {
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
      saveAs(new Blob([buffer]), 'INFORME DE COMPRA DE PRODUCTOS.xlsx');
    });
  }


  descargarPDFFechacompra() {
    
    const rows = this.fechacomprasss.map((item, index) => [
      index + 1,
      item.alimento.descripcion, // Producto
      item.unidadMedida.unidadMedida, // Unidad de medida
      item.cantidadmedidaUnidad,
      this.formatPrice(item.preciounidad),
      this.formatPrice(item.precio),
      `${item.porcion} ${this.getUnidadMedida(item.unidadMedida.unidadMedida.toLowerCase())}`, // Porción por persona
 
    ]);
  
    const anchoPagina = 595.28;
    let columnWidths = [23, 75, 60, 65, 80, 80, 70]; // Ajusta según tus necesidades
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
          widths: ['*', '*', '*', '*', '*', '*', '*'],
          body: [
            [
              { text: `Fecha: ${this.fechacomprasss[0].fecha}`, bold: true,    fillColor: '#D3D3D3', border: [true, true, true, true] },
              { 
                text: `Precio final: ${this.sumaPrecios.toFixed(2)} $`,   bold: true,    alignment: 'right' },      
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
          { text: 'INFORME DE LISTA COMPRAS DE PRODUCTOS POR FECHA', style: 'header', alignment: 'center' },
          '\n\n',
          { text: 'Cálculo de la factura por fecha', style: 'subheader', alignment: 'left', bold: true },
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
                ['Nº', 'Productos', 'Unidades de medidas', '  Cantidades de medidas', '   Precios unitarios', 'Precios', 'Porciones' ].map((cell, index) => ({
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
      pdfMake.createPdf(documentoPDF).download('INFORME DE LISTA DE COMPRAS DE PRODUCTOS POR FECHA.pdf');
    });
  }

  descargarExcelFechacompra() {
     
    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Informe de compras de productos con su fecha de compra');
    
    // Organizar créditos por persona
    const creditosPorPersona = {};
    
    this.fechacomprasss.forEach(item => {
    const platoDescripcion = `Fecha: ${item.fecha}`;
     const cantidadpersona = `Cantidad de personas: ${this.sumaPrecios}`;
     
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
      'Nº', 'Productos', 'Unidades de medidas', '  Cantidades de medidas', '   Precios unitarios', 'Precios', 'Porciones'   ];
    
    worksheet.addRow(headers);
    worksheet.getRow(worksheet.lastRow.number).font = { bold: true }; // Negrita para encabezado
    
    // Establecer estilos para encabezados
    worksheet.getRow(worksheet.lastRow.number).eachCell(cell => {
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD3D3D3' } }; // Fondo gris (plomo)
    });
    
    // Agregar datos a la hoja de cálculo
    this.fechacomprasss.forEach((item, index) => {
    const rowData = [
        index + 1,
        
        item.alimento.descripcion, // Producto
      item.unidadMedida.unidadMedida, // Unidad de medida
      item.cantidadmedidaUnidad,
      this.formatPrice(item.preciounidad),
      this.formatPrice(item.precio),
      `${item.porcion} ${this.getUnidadMedida(item.unidadMedida.unidadMedida.toLowerCase())}`, // Porción por persona
 
         
    ];
    
    worksheet.addRow(rowData);
    });
    
    // Establecer estilos para datos
    for (let i = worksheet.lastRow.number - this.fechacomprasss.length + 1; i <= worksheet.lastRow.number; i++) {
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
    saveAs(new Blob([buffer]), 'Informe de compras de productos con su fecha de compra.xlsx');
    });
    }













  descargarPDFTodos() {
    const rows = this.compratodosss.map((item, index) => [
      (index + 1).toString(), // Número
      item.alimento.descripcion, // Producto
      item.unidadMedida.unidadMedida, // Unidad de medida
      item.cantidadmedidaUnidad,
      this.formatPrice(item.preciounidad),
      this.formatPrice(item.precio),
      `${item.porcion} ${this.getUnidadMedida(item.unidadMedida.unidadMedida.toLowerCase())}`, // Porción por persona
    ]);

    const anchoPagina = 595.28;
    let columnWidths = [23, 75, 60, 65, 80, 80, 70];
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
          { text: 'INFORME DE COMPRA DE PRODUCTOS ', style: 'header', alignment: 'center' },
          '\n',
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
                ['Nº', 'Producto', 'Unidad de medida', '  Cantidad de medida', '   Precio unitario', 'Precio', 'Porción'].map((cell, index) => ({
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
      pdfMake.createPdf(documentoPDF).download('INFORME DE COMPRA  PRODUCTOS.pdf');
    });
  }

  descargarExcelTodos() {
    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('INFORME DE PRODUCTOS');

    // Organizar créditos por persona
    const creditosPorPersona = {};

    // Agregar encabezados de la tabla
    const headers = [
      'Nº', 'Producto', 'Unidad de medida', '  Cantidad de medida', '   Precio unitario', 'Precio', 'Porción'
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
    this.compratodosss.forEach((item, index) => {
      const rowData = [
        index + 1,
        item.alimento.descripcion, // Producto
        item.unidadMedida.unidadMedida, // Unidad de medida
        item.cantidadmedidaUnidad,
        this.formatPrice(item.preciounidad),
        this.formatPrice(item.precio),
        `${item.porcion} ${this.getUnidadMedida(item.unidadMedida.unidadMedida.toLowerCase())}`, // Porción por persona
      ];

      worksheet.addRow(rowData);
    });

    // Establecer estilos para datos
    for (let i = worksheet.lastRow.number - this.compratodosss.length + 1; i <= worksheet.lastRow.number; i++) {
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
      saveAs(new Blob([buffer]), 'INFORME DE PRODUCTOS.xlsx');
    });
  }

  descargarPDFExistencia() {
    const rows = this.compraconexistenciasss.map((item, index) => [
      (index + 1).toString(), // Número
      item.alimento.descripcion, // Producto
      item.unidadMedida.unidadMedida, // Unidad de medida
      item.cantidadmedidaUnidad,
      this.formatPrice(item.preciounidad),
      this.formatPrice(item.precio),
      `${item.porcion} ${this.getUnidadMedida(item.unidadMedida.unidadMedida.toLowerCase())}`, // Porción por persona
    ]);

    const anchoPagina = 595.28;
    let columnWidths = [23, 75, 60, 65, 80, 80, 70];
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
          { text: 'INFORME DE PRODUCTOS CON EXISTENCIA ', style: 'header', alignment: 'center' },
          '\n',
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
                ['Nº', 'Producto', 'Unidad de medida', '  Cantidad de medida', '   Precio unitario', 'Precio', 'Porción'].map((cell, index) => ({
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
      pdfMake.createPdf(documentoPDF).download('INFORME DE PRODUCTOS CON EXISTENCIA.pdf');
    });
  }

  descargarExcelExistencia() {
    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('INFORME DE PRODUCTOS CON EXISTENCIA');

    // Organizar créditos por persona
    const creditosPorPersona = {};

    // Agregar encabezados de la tabla
    const headers = [
      'Nº', 'Producto', 'Unidad de medida', '  Cantidad de medida', '   Precio unitario', 'Precio', 'Porción'
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
    this.compraconexistenciasss.forEach((item, index) => {
      const rowData = [
        index + 1,
        item.alimento.descripcion, // Producto
        item.unidadMedida.unidadMedida, // Unidad de medida
        item.cantidadmedidaUnidad,
        this.formatPrice(item.preciounidad),
        this.formatPrice(item.precio),
        `${item.porcion} ${this.getUnidadMedida(item.unidadMedida.unidadMedida.toLowerCase())}`, // Porción por persona
      ];

      worksheet.addRow(rowData);
    });

    // Establecer estilos para datos
    for (let i = worksheet.lastRow.number - this.compraconexistenciasss.length + 1; i <= worksheet.lastRow.number; i++) {
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
      saveAs(new Blob([buffer]), 'INFORME DE PRODUCTO CON EXISTENCIA.xlsx');
    });
  }

  descargarPDFSinExistencia() {
    const rows = this.comprasinexistenciasss.map((item, index) => [
      (index + 1).toString(), // Número
      item.alimento.descripcion, // Producto
      item.unidadMedida.unidadMedida, // Unidad de medida
      item.cantidadmedidaUnidad,
      this.formatPrice(item.preciounidad),
      this.formatPrice(item.precio),
      `${item.porcion} ${this.getUnidadMedida(item.unidadMedida.unidadMedida.toLowerCase())}`, // Porción por persona
    ]);

    const anchoPagina = 595.28;
    let columnWidths = [23, 75, 60, 65, 80, 80, 70];
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
          { text: 'INFORME DE PRODUCTOS AGOTADOS ', style: 'header', alignment: 'center' },
          '\n',
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
                ['Nº', 'Producto', 'Unidad de medida', '  Cantidad de medida', '   Precio unitario', 'Precio', 'Porción'].map((cell, index) => ({
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
      pdfMake.createPdf(documentoPDF).download('INFORME DE PRODUCTOS AGOTADOS.pdf');
    });
  }

  descargarExcelSinExistencia() {
    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('INFORME DE PRODUCTOS AGOTADOS');

    // Organizar créditos por persona
    const creditosPorPersona = {};

    // Agregar encabezados de la tabla
    const headers = [
      'Nº', 'Producto', 'Unidad de medida', '  Cantidad de medida', '   Precio unitario', 'Precio', 'Porción'
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
    this.comprasinexistenciasss.forEach((item, index) => {
      const rowData = [
        index + 1,
        item.alimento.descripcion, // Producto
        item.unidadMedida.unidadMedida, // Unidad de medida
        item.cantidadmedidaUnidad,
        this.formatPrice(item.preciounidad),
        this.formatPrice(item.precio),
        `${item.porcion} ${this.getUnidadMedida(item.unidadMedida.unidadMedida.toLowerCase())}`, // Porción por persona
      ];

      worksheet.addRow(rowData);
    });

    // Establecer estilos para datos
    for (let i = worksheet.lastRow.number - this.comprasinexistenciasss.length + 1; i <= worksheet.lastRow.number; i++) {
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
      saveAs(new Blob([buffer]), 'INFORME DE PRODUCTOS AGOTADOS.xlsx');
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

  formatPrice(price: number): string {
    if (price === null) return 'N/A';
    if (price.toString().startsWith('0')) {
      return `${this.truncateZeros(price)} ctvs`;
    } else {
      return `${price} $`;
    }
  }
}
