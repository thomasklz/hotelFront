 import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from "@angular/core";
  import { HttpClient } from "@angular/common/http";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialog } from '@angular/material/dialog';

import { Router } from "@angular/router";
import { MatTableDataSource } from "@angular/material/table";
import { AlimentosService } from "app/servicios/alimentos.service";
import swal from "sweetalert";
import swal2 from "sweetalert";
import Swal from "sweetalert2";
import { saveAs } from 'file-saver';
import { ImageService } from "app/servicios/image.service";
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as XLSX from 'xlsx';
import { Observable, Observer } from "rxjs";
import { ExampleTab } from "app/table-list/table-list.component";
import { ComprasService } from 'app/servicios/compras.service';



 import * as FileSaver from 'file-saver';
 declare var $: any;

@Component({
  selector: "app-alimentos",
  templateUrl: "./alimentos.component.html",
  styleUrls: ["./alimentos.component.scss"],
})
export class AlimentosComponent implements OnInit {
  @ViewChild('ventanaForm') ventanaForm!: any;
    @ViewChild('ventanaFormOtro') ventanaFormOtro!: ElementRef;
   dataSource = new MatTableDataSource<any>();
  id: string = "";
  id_unidadMedida: string = "";
  unidadMedidasss: any[] = [];
  alimentosss: any[] = [];
  tituloForm;
  titulo2Form;
  alimentoForm!: FormGroup;
  editandoAlimento: boolean = false; // Variable para indicar si se está editando un alimento existente
  idAlimentoEditar: string = ""; // Variable para almacenar el ID del alimento en caso de edición
  showDescripcionError = false; //evitando que se muestren los mensajes de campo requerido
  showCantidadPersonaError = false;
  showEquivalenteGramoError = false;
  showIdTipoalimentoError = false; //evitando que se muestren los mensajes de campo requerido
  showPrecioError = false; //evitando que se muestren los mensajes de campo requerido

  unidadMedidaForm!: FormGroup;
  showTipoError = false; //evitando que se muestren los mensajes de campo requerido
  editandoTipoAlimento: boolean = false; // Variable para indicar si se está editando un alimento existente
  idTipoAlimentoEditar: string = ""; // Variable para almacenar el ID del alimento en caso de edición
  alimentosssOriginal: any[] = [];
  tituloFormOtro;
  constructor(
    private http: HttpClient,
    private AlimentosService: AlimentosService,

    private router: Router,
    private formBuilder: FormBuilder,
    private imageService: ImageService,
    private ComprasService: ComprasService,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
    private dialog: MatDialog,



  ) {
    this.getAllunidadMedida();
    this.getAllalimento();
  }
 
  
  ngOnInit() {
    this.getAllalimento();
    this.getAllunidadMedida();
    this.loadPageData();
    this.loadAsyncTabs();
    this.mostrarCompra();

    
    this.fechaControl.setValue(this.getCurrentDate());

    this.alimentoForm = this.formBuilder.group({
      descripcion: new FormControl("", [
        Validators.required,
        Validators.minLength(3),
      ]),
     
      id_unidadMedida: new FormControl("", [
        Validators.required,
        Validators.minLength(1),
      ]),
    });
 
    this.ingredientesForm = this.formBuilder.group({
      id_alimento: ["", Validators.required],
      cantidadmedidaUnidad: ["", Validators.required],
      precio: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{0,2})?$/)]],
      fecha: [this.getCurrentDate(), Validators.required]
    });

    this.getAllunidadMedida();

    this.unidadMedidaForm = this.formBuilder.group({
      unidadMedida: new FormControl("", [Validators.required, Validators.minLength(3)]),
      valorMedida: new FormControl("", [
        Validators.required,
        Validators.minLength(1),
      ]),
    });
  }


  hideSelectText() {}

  asyncTabs: Observable<ExampleTab[]>;

  loadAsyncTabs() {
    this.asyncTabs = new Observable((observer: Observer<ExampleTab[]>) => {
      observer.next([
        { label: 'Registro de producto', content: 'Content 1' },
        { label: 'Registro de compra', content: 'Content 2' },
      ]);
    });
  }

  showMoreOptions: boolean = false;
  selectedOption: any = null;

 
  toggleShowMoreOptions() {
    this.showMoreOptions = !this.showMoreOptions;
  }


  selectOption(item: any) {
    this.selectedOption = item;
    this.showMoreOptions = false;

    // Update the form control with the selected option's ID
    this.alimentoForm.get('id_unidadMedida')?.setValue(item.id);
  }

  getSelectedOptionLabel() {
    return this.selectedOption ? this.selectedOption.unidadMedida : 'Seleccione  ';
  }

  getSelectedOptionLabelotro() {
    return this.selectedOption ? this.selectedOption.unidadMedida : 'Otro  ';
  }




  //CPMPRA---------------



  
  totalItemsv2 = 0;
  pageSizev2 = 10; // Tamaño de la página
  currentPagev2 = 1; // Página actual
 
  get totalPagesv2(): number {
    return Math.ceil(this.totalItemsv2 / this.pageSizev2);
  }

  get startIndexv2(): number {
    return (this.currentPagev2 - 1) * this.pageSizev2;
  }

  get endIndexv2(): number {
    return Math.min(this.startIndexv2 + this.pageSizev2 - 1, this.totalItemsv2 - 1);
  }
  
  get pagedMenusv2(): any[] {
    return this.comprasss2.slice(this.startIndexv2, this.endIndexv2 + 1);
  }
  

  onPageChangev2(event: number) {
    this.currentPagev2 = event;
  }


  nombreproductoFiltro2: string = '';
  filtroSeleccionado2: string = '';
  comprasss2: any[] = [];
  alimentosssOriginal2: any[] = [];

  aplicarFiltros2() {
    // Aplica los filtros aquí según el valor de filtroSeleccionado
    if (this.filtroSeleccionado2 === 'nombre') {
      // Aplica el filtro por nombre
      if (this.nombreproductoFiltro) {
        this.comprasss2 = this.alimentosssOriginal2.filter(item => item.persona.nombre.includes(this.nombreproductoFiltro2));
      } else {
        this.comprasss2 = [...this.alimentosssOriginal2];
      }
      // Limpia el filtro de fecha
    }
  }

  mostrarCompra() {
    this.ComprasService.mostrarCompra().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.compras);
        this.comprasss2 = res.compras;
        this.totalItemsv2 = res.compras.length;
        console.log("estasss", this.comprasss2);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  get pagedMenus2(): any[] {
    return this.comprasss2.slice(this.startIndex, this.endIndex + 1);
  }
  ingredientesForm!: FormGroup;
  mostrarTabla: boolean = false;
  tituloFormV2;
  editandoIngredientes: boolean = false;
  idIngredientesEditar: string = "";
  selectedOptionalimento: any = null;
  showIdalimentoError = false;
  showAlimentoError = false;
  ingredientesSeleccionados: any[] = [];

  nuevoCursoV2() {
    this.ingredientesForm.reset();
    this.ingredientesForm.patchValue({ fecha: this.getCurrentDate() });
    this.mostrarTabla = false;
    this.tituloFormV2 = "Registros de compras de productos";
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
           
          this.resetFormulario();
          this.showModal();
          this.fechaControl.setValue(this.getCurrentDate());
          this.ingredientesForm.patchValue({ fecha: this.getCurrentDate() });

          // Manejar respuesta exitosa
          console.log("Respuesta del servidor:", result); // Para depuración
        },
        (error) => {
          console.error("Error al guardar compra:", error);
          this.showModalErrorV2(error.error); // Mostrar mensaje de error
        }
      );
    } else {
      this.showModalErrorCamposFaltantes();
    }
  }
  showModalErrorCamposFaltantes() {
    swal({
      title: "Campos requeridos faltantes",
      text: "Asegúrate de seleccionar alimentos y el plato válido.",
      icon: "error",
    });
  }

  showModalErrorV2(error: any) {
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
  total: number = 0;
  filtro: string = '';

  alimentosFiltrados: any[] = []; // Variable para almacenar platos filtrados
  showId_cantidadplatoError = false;
  closeModalAfterCancel() {
    this.resetForm();
    this.ventanaForm.nativeElement.modal('hide');
    $(this.elementRef.nativeElement).find('.modal').modal('hide');
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

  get showPrecioError3() {
    const precioControl = this.ingredientesForm.get('precio');
    return precioControl.invalid && precioControl.dirty && !precioControl.errors?.required;
  }
  fechaControl = new FormControl(this.getCurrentDate());

  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
  alimentosSeleccionados: any[] = [];

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
  alimentoSeleccionado: { id: number | null; descripcion: string } = {
    id: null,
    descripcion: "",
  };



  //----------------------

  //PAGINATOR------------------------------
  pageSize = 10; // Tamaño de la página
  currentPage = 1; // Página actual
  totalItems = 0; // Total de elementos

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
    return this.alimentosss.slice(this.startIndex, this.endIndex + 1);
  }

  // ... otras funciones del componente

  loadPageData() {
    // Lógica para cargar datos de la página actual (no es necesario pasar parámetros a la API)
    this.AlimentosService.mostraralimentoss().subscribe({
      next: (res) => {
        this.alimentosss = res.alimentos;
        this.totalItems = res.alimentos.length; // Actualizar el total de elementos
      },
      error: (err) => {
        console.error(err);
        // Manejo de errores si la llamada a la API falla
      },
    });
  }

    //obtener todos los alimentos
    getAllalimento() {
      this.AlimentosService.mostraralimentoss().subscribe({
        next: (res) => {
          this.dataSource = new MatTableDataSource(res.alimentos);
          this.alimentosss = res.alimentos;
          this.alimentosssOriginal = [...res.alimentos]; 
        },
        error: (err) => {
          //alert("Error en la carga de datos");
        },
      });
    }

  onPageChange(event: number) {
    this.currentPage = event;
  }


  nombreproductoFiltro: string = '';
  filtroSeleccionado: string = ''; 
  //filtrado
  aplicarFiltros() {
    // Aplica los filtros aquí según el valor de filtroSeleccionado
    if (this.filtroSeleccionado === 'nombre') {
      // Aplica el filtro por nombre
      if (this.nombreproductoFiltro) {
        this.alimentosss = this.alimentosssOriginal.filter(item => item.persona.nombre.includes(this.nombreproductoFiltro));
      } else {
        this.alimentosss = [...this.alimentosssOriginal];
      }
      // Limpia el filtro de fecha
     
    }
  }


  nuevoCursoOtro(){
    this.tituloFormOtro='Registro de unidad de medida'
   }
  //Modal cuando los datos se agg Notificacion
  title = "sweetAlert";
  showModal() {
    swal2({
      title: "Datos registrado exitosamente",
      icon: "success",
    });
  }

  //Modal cuando los datos No se agg error de Notificacion

  showModalError() {
    swal({
      title: "Error de registro de datos ",
      icon: "error",
    });
  }

  //Modal cuando se modifica datos  Notificacion

  showModalEdit() {
    swal2({
      title: "Datos modificado exitosamente",
      icon: "success",
    });
  }

  //Modal de  error de Modificacion  datos Notificacion

  showModalErrorEdit() {
    swal({
      title: "Error de modificación de datos ",
      icon: "error",
    });
  }


  showModalErrorConflict() {
    swal({
      title: "Ya existe ese producto  ",
      icon: "error",
    });
  }


  //registrar el id tipo alimento el nuevo que se selecciona y enviarlo a la data
  getId_unidadMedida() {
    this.http
      .get(
        "http://localhost:3000/api/crearunidadMedida?=" + this.id_unidadMedida
      )
      .subscribe((result: any) => {
        this.unidadMedidasss = result.nuevaUnidadMedida;
      });
  }

  //obtener todos los tipos alimentos
  getAllunidadMedida() {
    this.AlimentosService.obtenerUnidadMedida().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.unidadesMedida);
        this.unidadMedidasss = res.unidadesMedida;
      },
      error: (err) => {
        // alert("Error en la carga de datos");
      },
    });
  }



  //Para el registro de alimento usando modal
  nuevoCurso() {
    this.tituloForm = "Registros de productos";
    this.alimentoForm.reset();
    this.editandoAlimento = false;
    this.idAlimentoEditar = "";
  
    // Restablecer la opción seleccionada y borrar el valor del campo de formulario
    this.selectedOption = null;
    this.alimentoForm.get("id_unidadMedida")?.patchValue({}); // Establecer como un objeto vacío
  
    // Establecer variables a false al editar
    this.showDescripcionError = false;
    this.showCantidadPersonaError = false;
    this.showEquivalenteGramoError = false;
    this.showIdTipoalimentoError = false;
    this.showPrecioError=false;
  }
  
  //Para el registro de alimento usando modal
  nuevaModaltipoAlimento() {
    this.titulo2Form = "Registro de Tipo Alimento"; // cambio de nombre en el encabezado
    this.unidadMedidaForm.reset();
    this.editandoTipoAlimento = false;
    this.idTipoAlimentoEditar = "";

    // Restablecer la opción seleccionada y borrar el valor del campo de formulario
    this.selectedOption = null;
    
    this.unidadMedidaForm.get("id_tipoalimento")?.setValue(null);

    // Establecer variables a false al editar
    this.showTipoError = false;
  }







  

  addUnidadMedida () {
    if (this.unidadMedidaForm.valid) {
      this.showDescripcionError = false;
     

      const datos = {
        
        unidadMedida: this.unidadMedidaForm.value.unidadMedida,
        valorMedida: this.unidadMedidaForm.value.valorMedida

       
      };

      if (!this. editandoAlimento) {
        this.AlimentosService.crearunidadMedida(datos).subscribe(
          (tipo) => {
            console.log(tipo);
            this.showModal();
            this.getAllunidadMedida(); // Actualizar la tabla después de agregar un menú
            this.loadPageData();
            this.unidadMedidaForm.reset(); // Restablecer los valores del formulario
          },
          (error) => {
            console.log(error);
        
            if (error.status === 409) {
              this.showModalErrorConflictotro(); // Mostrar modal específico para conflicto
            } else {
              this.showModalError(); // Mostrar modal genérico para otros errores
            }
          }
        );
      } else {
        // m o d i f i c a r -----------------------------
        this.AlimentosService.guardar(datos, this.idAlimentoEditar).subscribe(
          (plato) => {
            console.log(plato);
            this.showModalEdit();
            this.nuevoCurso(); // Restablecer el formulario después de editar
            this.loadPageData();
            this.getAllalimento();
          },
          (error) => {
            console.log(error);
            this.showModalErrorEdit();
          }
        );
      }
    } else {
      this.showDescripcionError = this.unidadMedidaForm.controls.descripcion.invalid;
       this.showPrecioError =  this.unidadMedidaForm.controls.precio.invalid;

    }
  }

  showModalErrorConflictotro() {
    swal({
      title: "Ya existe esa unidad de medida ",
      icon: "error",
    });
  }

  editarAlimento(item: any) {
    this.tituloForm = "Editar producto";
    
    // Asignar los valores del alimento seleccionado al formulario de edición
    this.alimentoForm.patchValue({
      descripcion: item.descripcion,
     
      id_unidadMedida: item.unidadMedida.id // Asignar el ID de la unidad de medida
    });
    
    // Establecer la opción seleccionada para la unidad de medida
    this.selectedOption = { unidadMedida: item.unidadMedida.unidadMedida, id: item.unidadMedida.id };
  
    // Establecer el estado de edición y el ID del alimento
    this.editandoAlimento = true;
    this.idAlimentoEditar = item.id;
  
    // Restablecer las variables de error a false
    this.showDescripcionError = false;
   
  }
  
  
  // Método para guardar o actualizar el alimento
  addAlimento() {
    console.log('Editando alimento:', this.editandoAlimento);
    console.log('ID del alimento a editar:', this.idAlimentoEditar);
    console.log('Estado del formulario antes de la validación:', this.alimentoForm.value);
    
    if (this.alimentoForm.valid) {
      console.log('El formulario es válido. Procediendo a guardar los datos...');
  
      const datos = {
        descripcion: this.alimentoForm.value.descripcion,
        id_unidadMedida: this.alimentoForm.get('id_unidadMedida')?.value,
      };
  
      if (!this.editandoAlimento) {
        this.AlimentosService.guardar(datos).subscribe(
          (alimentos) => {
            console.log(alimentos);
            this.showModal(); // Método para mostrar modal de éxito
            this.getAllalimento(); // Actualizar la lista de alimentos
            this.loadPageData();
            this.alimentoForm.reset(); // Reiniciar el formulario
            this.selectedOption = null;
          },
          (error) => {
            console.log(error);
            if (error.status === 400) {
              this.showModalErrorConflict(); // Mostrar modal de conflicto si ya existe el alimento
            } else {
              this.showModalError(); // Mostrar modal de error genérico
            }
          }
        );
      } else {
        this.AlimentosService.guardar(datos, this.idAlimentoEditar).subscribe(
          (alimentos) => {
            console.log('Guardado exitoso:', alimentos);
  
            console.log(alimentos);
            this.showModalEdit(); // Método para mostrar modal de éxito al editar
            this.getAllalimento(); // Actualizar la lista de alimentos
            this.loadPageData();
            this.resetAlimentoForm(); // Reiniciar el formulario
            this.selectedOption = null;
             ($('#ventanaForm') as any).modal('hide'); // Cerrar la modal al editar
            },
          (error) => {
            console.log('Error al guardar:', error);
            console.log(error);
            this.showModalErrorEdit(); // Mostrar modal de error al editar
          }
        );
      }
    } else {
      console.log('El formulario NO es válido. No se pueden guardar los datos.');
  
      this.validateForm(); 
    }
  }
  

 
  // Método para restablecer el formulario de alimento
  resetAlimentoForm() {
    this.alimentoForm.reset();
    this.editandoAlimento = false;
    this.idAlimentoEditar = "";
  }

  // Método para validar el formulario de alimento y mostrar errores
  validateForm() {
    this.showDescripcionError = this.alimentoForm.get('descripcion')?.invalid;
     this.showEquivalenteGramoError = this.alimentoForm.get('id_unidadMedida')?.invalid;
   }



 
  














  
  
  

  //registro de tipo alimento
  
  // ...
  showModalEliminar(id: number) {
    Swal.fire({
      title: "¿Estás seguro que deseas eliminar el producto?",
      icon: "warning",
      showCancelButton: true,

      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#bf0d0d",
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarAlimento(id);
      }
    });
  }

  showModalErrorEliminar() {
    Swal.fire({
      title: "Error al eliminar el producto",
      icon: "error",
    });
  }

  eliminarAlimento(id: number) {
    this.AlimentosService.deletealimentos(id).subscribe({
      next: (res) => {
        Swal.fire({
          title: "Datos eliminados exitosamente",
          icon: "success",
        }).then(() => {
          this.getAllalimento();
          this.loadPageData();
        });
      },
      error: () => {
        this.showModalErrorEliminar();
      },
    });
  }

  // Restablecer el formulario cuando se cierre el modal
  closeModal() {
    this.alimentoForm.reset();
    this.editandoAlimento = false;
    this.idAlimentoEditar = "";
    this.unidadMedidaForm.reset();
    this.selectedOption = null;
    this.ventanaForm.nativeElement.modal('hide');
  }
  closeModal2() {
    this.dialog.closeAll();
    this.ingredientesForm.reset();
    this.editandoIngredientes = false;
    this.idIngredientesEditar = "";
    $(this.elementRef.nativeElement).find('.modal').modal('hide');
  }























  

  descargarPDF() {
    
    const rows = this.alimentosss.map((item, index) => [
      (index + 1).toString(), // Número
      item.descripcion,
      item.unidadMedida.unidadMedida,
       
      ]);
    
    
     
    
      const anchoPagina = 595.28;
      let columnWidths = [30, 115, 115, ];
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
            { text: 'INFORME DE PRODUCTOS', style: 'header', alignment: 'center' },
            ' \n',   ' \n',  
            { text: 'Productos con su unidad de medida', style: 'subheader', alignment: 'left' , bold: true },
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
                  ['N°','Productos', 'Unidades de medidas'].map((cell, index) => ({
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
        pdfMake.createPdf(documentoPDF).download('INFORME DE PRODUCTOS.pdf');
      });
   
   
  }


  
  
  descargarPDFCompra() {
    const rows = this.comprasss2.map((item, index) => [
      (index + 1).toString(), // Número
      item.alimento.descripcion, // Producto
      item.unidadMedida.unidadMedida, // Unidad de medida
      item.cantidadmedidaUnidad,
      
      `${item.porcion} ${this.getUnidadMedida(item.unidadMedida.unidadMedida.toLowerCase())}`, // Porción por persona
    ]);

    const anchoPagina = 595.28;
    let columnWidths = [30, 195, 80, 80, 80];
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
                ['Nº', 'Producto', 'Unidad de medida', '  Cantidad de medida', 'Porción'].map((cell, index) => ({
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

  
  
  


//-----------------------


  datosParaDescargar: any[] = []; // Variable para almacenar los datos a descargar


  //'''''''''''''''''''''''
 
 
   

  

 
  
  descargarDatos() {
    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte de Productos');
    
    // Organizar créditos por persona
    const creditosPorPersona = {};
    
   
    
    // Agregar encabezados de la tabla
    const headers = [
    'Nº',
     'Productos' ,
     'Unidad de medida' 
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
    this.alimentosss.forEach((item, index) => {
    const rowData = [
        index + 1,
        item.descripcion,
        item.unidadMedida.unidadMedida,
      
    ];
    
    worksheet.addRow(rowData);
    });
    
    // Establecer estilos para datos
    for (let i = worksheet.lastRow.number - this.alimentosss.length + 1; i <= worksheet.lastRow.number; i++) {
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
    saveAs(new Blob([buffer]), 'Reporte de Productos.xlsx');
    });
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
  
  
  
  


  
  // Función para convertir datos binarios en un array
  s2ab(s: string): Uint8Array {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i) & 0xFF;
    }
    return new Uint8Array(buf);
  }
  
   




  descargarExcelCompra() {
    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('INFORME DE COMPRA PRODUCTOS');

    // Organizar créditos por persona
    const creditosPorPersona = {};

    // Agregar encabezados de la tabla
    const headers = [
      'Nº', 'Producto', 'Unidad de medida', '  Cantidad de medida', 'Porción'
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
    this.comprasss2.forEach((item, index) => {
      const rowData = [
        index + 1,
        item.alimento.descripcion, // Producto
        item.unidadMedida.unidadMedida, // Unidad de medida
        item.cantidadmedidaUnidad,
       
        `${item.porcion} ${this.getUnidadMedida(item.unidadMedida.unidadMedida.toLowerCase())}`, // Porción por persona
      ];

      worksheet.addRow(rowData);
    });

    // Establecer estilos para datos
    for (let i = worksheet.lastRow.number - this.comprasss2.length + 1; i <= worksheet.lastRow.number; i++) {
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
