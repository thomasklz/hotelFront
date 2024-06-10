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
import { Observable } from 'rxjs';
import { debounceTime, startWith, map } from 'rxjs/operators';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatPaginator } from '@angular/material/paginator';
import { data } from 'jquery';

import * as XLSX from 'xlsx';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as FileSaver from 'file-saver';
 import { ImageService } from "app/servicios/image.service";



  import { saveAs } from 'file-saver';
import { RecetarioService } from 'app/servicios/recetario.service';
 


   

@Component({
  selector: 'app-recetario',
  templateUrl: './recetario.component.html',
  styleUrls: ['./recetario.component.scss']
})
export class RecetarioComponent implements OnInit {

  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatAutocomplete) autocomplete: MatAutocomplete;


  id: string = "";
  estado: boolean = true;
  precio: string = "";
  id_peso: string = "";
  id_plato: string = "";
  id_alimento: string[] = [];
  pesosss: any[] = [];
  platosss: any[] = [];
  alimentosss: any[] = [];
  productosplatosss: any[] = [];
  
  productosplato: any[] = [];
  descripcplato: any[] = [];
  alimentoss: any[] = [];
  ingredientedescripcionsss: any[] = [];
  tituloForm;
  ingredientId: string = "";
  platoId: string = "";
  ingredientesForm!: FormGroup;
  platos!: FormGroup;
  editandoIngredientes: boolean = false;
  idIngredientesEditar: string = "";
  showIdplatoError = false;
  showCantidadPersonaError = false;
  showIdalimentoError = false;
  showIdPlatoError = false;
  showAlimentoError = false;
  showDiasError = false;
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
    private imageService:ImageService,
    private MenuService: MenuService,
    private PesosService: PesosService,
    private router: Router,
    private RecetarioService:RecetarioService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.getAllplatos();
  }
  

 

  
  ngOnInit() {
    this.getAllingredientes();
    this.getAllalimento();
    this.loadPageData();

    this.loadPageDatasss();
    this.getAllPlatosDescripcion();
    this.ingredientesForm = this.formBuilder.group({
      id_plato: ["", [Validators.required, Validators.maxLength(1)]],
      id_alimento: ["", Validators.required],
     
       
    });



    
  }
  




        
      

  
    

  // Método para alternar la selección de un ingrediente
  
  

  









  filtrarIngredientes(termino: string): void {
    const terminoLowerCase = termino.toLowerCase();
  
    // Filtrar ingredientes según el término de búsqueda
    this.ingredientesUnicos.forEach((ingrediente) => {
      ingrediente.visible = ingrediente.descripcion.toLowerCase().includes(terminoLowerCase);
    });
  }
         













































































  totalPrecio: number = 0;

  botonBuscarPresionado = false;

  buscarIngredientePorId() {
    this.productosplatosss = [];

    if (this.ingredientId) {
      this.RecetarioService.getproductosporid(this.ingredientId).subscribe({
        next: (res: any) => {
          if (res.productosplato.length === 0) {
            this.showModalErrorsindatos();
          } else {
            this.productosplatosss = res.productosplato;
            this.totalPrecio = this.calculateTotalPrice(this.productosplatosss);
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

  calculateTotalPrice(items: any[]): number {
    const total = items.reduce((acc, item) => acc + item.costeo, 0);
    return parseFloat(total.toFixed(2)); // Redondea el total a 2 decimales
  }
  
  buscarDescripcionporId() {
    if (this.ingredientId) {
      this.IngredientesService.getobtenerDescripcionPlatoproductos(
        this.ingredientId
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
    const platoSeleccionado = this.productosplato.find(
      (plato) => plato.descripcion === descripcion
    );
    this.platoSeleccionado = platoSeleccionado || {
      id: null,
      descripcion: descripcion,
    };
    this.ingredientesForm.get("id_plato")?.setValue(this.platoSeleccionado.id);
  }

  updateAlimentoId(event: any) {
    const descripcion = event.target.value;
    const alimentoSeleccionado = this.alimentoss.find(
      (alimento) => alimento.descripcion === descripcion
    );
    this.alimentoSeleccionado = alimentoSeleccionado || {
      id: null,
      descripcion: descripcion,
    };
    this.ingredientesForm
      .get("id_alimento")
      ?.setValue(this.alimentoSeleccionado.id);
  }

   

  showModal() {
    swal2({
      title: 'Datos registrado exitosamente',
      icon: 'success',
    }).then(() => {
      this.ingredientesSeleccionados = [];
      this.id_alimento = [];
      this.getAllplatos(); // Actualizar la lista de ingredientes
      // Otro código necesario
      this.  getAllingredientes();
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

  getAllplatos() {
    this.MenuService.gettplatoselect().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.plato);
        this.platosss = res.plato;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  ingredientesUnicos: any[] = [];




  obtenerIngredientesUnicos() {
    const uniqueIngredientes = new Set(this.alimentoss.map(ingrediente => ingrediente.descripcion));
    this.ingredientesUnicos = Array.from(uniqueIngredientes).map(descripcion => ({ descripcion }));
  }

  ingredientesSeleccionados: any[] = [];

  // ... tu código existente

/*   seleccionarIngrediente(ingrediente: any) {
    // Verificar si el ingrediente ya está seleccionado
    const index = this.ingredientesSeleccionados.findIndex(i => i.descripcion === ingrediente.descripcion);
    ingrediente.seleccionado = !ingrediente.seleccionado;
    if (index === -1) {
      // Si no está seleccionado, agregarlo a la lista de seleccionados
      this.ingredientesSeleccionados.push(ingrediente);
    } else {
      // Si ya está seleccionado, quitarlo de la lista de seleccionados
      this.ingredientesSeleccionados.splice(index, 1);
    }
  } */
 
  

  seleccionarIngrediente(ingrediente: any) {
    const index = this.ingredientesUnicos.findIndex(
      (i) => i.descripcion === ingrediente.descripcion
    );
    ingrediente.seleccionado = !ingrediente.seleccionado;
  
    if (index !== -1) {
      if (ingrediente.seleccionado) {
        // Asignar un identificador único basado en la posición
        ingrediente.id = index + 1;
      } else {
        // Remover el identificador cuando se deselecciona
        delete ingrediente.id;
      }
    }
  
    // Obtener los identificadores de los ingredientes seleccionados
    this.id_alimento = this.ingredientesUnicos
      .filter((i) => i.seleccionado && i.id !== undefined)
      .map((i) => i.id.toString());
  
    console.log("Identificadores de ingredientes seleccionadossssssssssssss:", this.id_alimento);


    this.ingredientesSeleccionados = this.ingredientesUnicos
    .
 
filter(i => i.seleccionado)
    .
   
map(i => ({ descripcion: i.descripcion }));

  }
  
  
  
  

  getAllPlatosDescripcion() {
    this.MenuService.gettplato().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.platos);
        this.productosplato = res.platos;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }


  getAllingredientes() {
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

  loadPageDatasss() {
    this.AlimentosService.getalimentos().subscribe({
      next: (res) => {
        this.ingredientesUnicos = res.alimentos;
        this.ingredientesUnicos= res.alimentos;
        this.totalItemss = res.alimentos.length;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }


  loadPageData() {
    this.MenuService.gettplato().subscribe({
      next: (res) => {
        this.productosplatosss = res.productosplato;
        this.ingredientesUnicos= res.productosplato;
        this.totalItems = res.productosplato.length;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  onPageChange(event: number) {
    this.currentPage = event;
  }

  nuevoCurso() {
    this.mostrarTabla = false;
    this.tituloForm = "Registros de recetas básicas";
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
    this.showDiasError = false;
    this.getAllalimento();
    this.ingredientesSeleccionados = [];

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
        id_alimento: alimento.id
      }));
  
      // Datos a enviar
      const data = {
        id_plato: idPlato,
        id_alimentos: idAlimentos
      };
  
      console.log("Datos a enviar:", data); // Para depuración
  
      // Llamar al servicio para guardar los datos
      this.RecetarioService.crearRecetario(data).subscribe(
        (result: any) => {
          this.resetFormulario();
          this.showModal();
          // Manejar respuesta exitosa
          console.log("Respuesta del servidor:", result); // Para depuración
        },
        (error) => {
          console.error("Error al guardar crédito:", error);
          if (error.status === 400 && error.error && error.error.message === 'Este plato ya existe') {
            this.showModalErrorPlatoExistente();
          } else {
            this.showModalError(error.error); // Mostrar mensaje de error
          }
        }
      );
    } else {
      this.showModalErrorCamposFaltantes();
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
    this.RecetarioService.deleteproductoPlato(id).subscribe({
      next: (res) => {
        Swal.fire({
          title: "Datos eliminados exitosamente",
          icon: "success",
        }).then(() => {
           this.buscarIngredientePorId();
        });
      },
      error: () => {
        this.showModalErrorEliminar();
      },
    });
  }
  closeModal() {
    this.ingredientesForm.reset();
    this.editandoIngredientes = false;
    this.idIngredientesEditar = "";
  }

  resetForm() {
    this.ingredientesForm.reset();
    this.editandoIngredientes = false;
    this.idIngredientesEditar = "";
    this.ingredientesSeleccionados = [];


    this.platoSeleccionado = { id: null, descripcion: "" };
    this.alimentoSeleccionado = { id: null, descripcion: "" };

    this.showIdplatoError = false;
    this.showPrecioError = false;
    this.showIdalimentoError = false;
    this.showDiasError = false;
    this.showCantidadPersonaError = false;
  }

  closeModalAfterSave() {
    this.resetForm();
  }

  closeModalAfterCancel() {
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
  


















        //---------------------------------------------------------------------------------

        alimentosssOriginal: any[] = [];

  
        
      
      
        alimentosFiltrados: any[] = []; // Variable para almacenar platos filtrados

        getAllalimento() {
          this.AlimentosService.mostraralimentoss().subscribe({
            next: (res) => {
              this.dataSource.data = res.alimentos.map(alimentos => {
                return {
                  id:alimentos.id,
                  nombre: alimentos.descripcion,
                  
                  selected: false
                };
               
              }); console.log("datossss "+ data);
              console.log("datosssshhh "+ this.dataSource.data);
              this.alimentosFiltrados = this.dataSource.data; // Inicializa los platos filtrados
              this.updateTotal();
              this.dataSource.paginator = this.paginator;
            },
            error: (err) => {
              console.error("Error en la carga de datos", err);
            }
          });
        }
      
        
        // Asegúrate de que platoSeleccionado sea una lista
        alimentosSeleccionados: any[] = [];
      
      updateTotal() {
       
      
        // Obtener todos los platos seleccionados
        this.alimentosSeleccionados = this.alimentosFiltrados.filter(alimentos => alimentos.selected);
      
        // Verificar si se encontraron platos seleccionados
        if (this.alimentosSeleccionados.length > 0) {
          console.log("Platos seleccionados:", this.alimentosSeleccionados);
        } else {
          console.log("Ningún plato seleccionado");
        }
      
        // Actualizar los valores en el formulario después de cada cambio
        this.updateFormValues();
      }
      
      
      updateFormValues() {
        // Actualizar los valores de platos seleccionados en el formulario
        this.ingredientesForm.patchValue({
          descripcion: this.alimentosSeleccionados.map(alimentos => alimentos.descripcion),
           unidadMedida: this.alimentosSeleccionados.map(alimentos => alimentos.unidadMedida),
        


         
         
         
          
        });
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
      
      
      
      
      
      
        descargarPDF() {
          const rows = this.productosplatosss.map((item, index) => [
            (index + 1).toString(), // Número
            item.alimento.descripcion, // Producto
          
          
          ]);
        
          const anchoPagina = 595.28;
          let columnWidths = [23, 470];
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
            const ingredientHeaders = this.ingredientedescripcionsss.map(item => ({
              columns: [
                { text: `Menú: ${item.plato.descripcion}`, bold: true },
              ],
              margin: [0, 10, 0, 10], // Margen entre encabezados y tabla
            }));
        
            const documentoPDF = {
              content: [
                headerTable,
                '\n\n',
                { text: 'INFORME DE LISTA DE RECETAS BÁSICAS', style: 'header', alignment: 'center' },
                '\n\n',
                 
                ...ingredientHeaders,
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
                      ['Nº', 'Ingredientes'].map((cell, index) => ({
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
            pdfMake.createPdf(documentoPDF).download('INFORME DE LISTA DE RECETAS BÁSICAS.pdf');
          });
        }
        
    
   
   

        
        async descargarExcel() {
          const ExcelJS = require('exceljs');
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet('INFORME DE LISTA DE RECETAS BÁSICAS');
      
          // Organizar créditos por persona
          const creditosPorPersona = {};
      
          this.ingredientedescripcionsss.forEach(item => {
              const platoDescripcion = `Menú: ${item.plato.descripcion}`;
      
              const row = worksheet.addRow([platoDescripcion]);
              row.eachCell(cell => {
                  cell.font = { size: 12, bold: true }; // Letra más grande y negrita
                  cell.alignment = { vertical: 'middle', horizontal: 'center' };
                  cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
               });
          });
      
          // Agregar encabezados de la tabla
          const headers = [
              'Nº',
              'Ingredientes'
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
          this.productosplatosss.forEach((item, index) => {
              const rowData = [
                  index + 1,
                  item.alimento.descripcion
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
          worksheet.getColumn(1).width = 5; // Set fixed width for "Nº" column
          worksheet.getColumn(2).width = 30; // Optionally set width for "Producto" column or let it auto-adjust
      
          worksheet.columns.forEach((column, index) => {
              if (index !== 0 && index !== 1) { // Skip first two columns as they are already set
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
          saveAs(new Blob([buffer]), 'INFORME DE LISTA DE RECETAS BÁSICAS.xlsx');
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
