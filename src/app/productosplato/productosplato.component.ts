import { Component, OnInit, ElementRef, ViewChild,Renderer2 } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { MatTableDataSource } from "@angular/material/table";
import swal from "sweetalert";
import swal2 from "sweetalert";
import { IngredientesService } from "../servicios/ingredientes.service";
import Swal from "sweetalert2";
import { AlimentosService } from "app/servicios/alimentos.service";
import { MenuService } from "app/servicios/menu.service";
import { PesosService } from "app/servicios/pesos.service";
import { ActivatedRoute } from '@angular/router';
import { format, parse } from 'date-fns';




import * as XLSX from 'xlsx';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as FileSaver from 'file-saver';
 import { ImageService } from "app/servicios/image.service";



  import { saveAs } from 'file-saver';
 

@Component({
  selector: 'app-productosplato',
  templateUrl: './productosplato.component.html',
  styleUrls: ['./productosplato.component.scss']
})
export class ProductosplatoComponent implements OnInit {

  @ViewChild('fechaInput') fechaInput: ElementRef;


  dataSource = new MatTableDataSource<any>();
  id: string = "";
  estado: boolean = true;
  precio: string = "";
  id_peso: string = "";
  id_plato: string = "";
  id_alimento: string = "";
  pesosss: any[] = [];
  platosss: any[] = [];
  alimentosss: any[] = [];
  ingredientesss: any[] = [];
  ingredientes: any[] = [];
  alimentoss: any[] = [];
  fechass: any[] = [];
  Registrofechass: any[] = [];
Registroplatoss: any[] = [];

  ingredientedescripcionsss: any[] = [];
  tituloForm;
  ingredientId: string = "";
  platoId: string = "";
  ingredientesForm!: FormGroup;
  platos!: FormGroup;
  editandoIngredientes: boolean = false; // Variable para indicar si se está editando un alimento existente
  idIngredientesEditar: string = ""; // Variable para almacenar el ID del alimento en caso de edición

  showIdplatoError = false; //evitando que se muestren los mensajes de campo requerido
  showCantidadPersonaError = false; //evitando que se muestren los mensajes de campo requerido
  showIdalimentoError = false; //evitando que se muestren los mensajes de campo requerido
  showIdPlatoError = false; //evitando que se muestren los mensajes de campo requerido
  showAlimentoError = false; //evitando que se muestren los mensajes de campo requerido
  showDiasError = false; //evitando que se muestren los mensajes de campo requerido
  showPrecioError = false; //evitando que se muestren los mensajes de campo requerido
  // En la parte superior de tu componente
  platoDescripcion: string = "";
  alimentoDescripcion: string = "";

  // Resto de tu componente...

  showMoreOptionsplato: boolean = false;
  showMoreOptionsalimento: boolean = false;
  selectedOptionplato: any = null;
  selectedOptionalimento: any = null;
 
  
  
fecha: string = '';
  constructor(
    private http: HttpClient,
    private IngredientesService: IngredientesService,
    private AlimentosService: AlimentosService,
    private MenuService: MenuService,
    private PesosService: PesosService,
    private router: Router,
    private formBuilder: FormBuilder,
    private renderer: Renderer2 ,
    private route: ActivatedRoute, private imageService:ImageService,
    
  ) {
    this.platoSeleccionado = { id: null, descripcion: "" };
  }

  //cargar los datos de la seleccion de la tabla  en la modal

  ngOnInit() {
    this.getAllingredientes();
    this.getAllFechas();
    this.getAllFechasRegistro();
    this.id_plato = "1";
    this.fecha = "2023-10-15";
    // Set id_plato and fecha_menu with some values
   
    // Ensure they are set before calling buscarIngredientePorId
    if (this.id_plato && this.fecha) {
     
    }
  
    this.ingredientesForm = this.formBuilder.group({
      precio: new FormControl("", [
        Validators.required,
        Validators.minLength(1),
      ]),
      numDias: new FormControl("", [
        Validators.required,
        Validators.minLength(1),
      ]),
      cantidadPersona: new FormControl("", [
        Validators.required,
        Validators.minLength(1),
      ]),
      id_plato: new FormControl("", [
        Validators.required,
        Validators.maxLength(1),
      ]),
      fecha: new FormControl("", [
        Validators.required,
      ]),
    });
  }
  
 
  pageSize = 10;  // Tamaño de la página
  currentPage = 1;  // Página actual
  totalItems = 0;  // Total de elementos

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.pageSize - 1, this.totalItems - 1);
  }

  get pagedIngredientes(): any[] {
    return this.ingredientesss.slice(this.startIndex, this.endIndex + 1);
  }

  // ... otras funciones del componente

  onPageChange(event: number) {
    this.currentPage = event;
  }

 

/*   buscarIngredientePorId() { 
  const fecha = this.fechaSeleccionado.fecha;
  const id = this.platoSeleccionado.id;
  console.log("Plato seleccionado ID:", id);
  console.log(" seleccionado ID fechaaa:", fecha);

  if (!this.platoSeleccionado || !this.platoSeleccionado.id) {
    console.error("this.platoSeleccionado.id is null or undefined.");
    return;
  }
 

  this.IngredientesService.buscarFechaYPlato(id, fecha).subscribe({
    next: (res: any) => {
      console.log("Ingredientes encontrados:", res.ingredientes);
      this.ingredientesss = res.ingredientes;
      this.totalItems = res.ingredientes.length; 
      this.buscarDescripcionporId();
    },
    error: (err) => {
      this.showModalErrorsindatos();
    },
  });
} */

  
  total:any;
  totalPrecio: number = 0;


  personas: number = 0;
  fechaa: Date; // Mantener fechaa como Date
  fechaFormateada: string; // Nueva variable para la fecha formateada

  
  formatDateCustom(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getUTCDate(); // Obtener el día correcto
    const month = date.getUTCMonth() + 1; // Obtener el mes correcto (0-11)
    const year = date.getUTCFullYear(); // Obtener el año
    return `${day}/${month}/${year}`;
  }

  buscarIngredientePorId() { 
    const fecha = this.fechaSeleccionado.fecha || this.formatDate(this.fechaInput.nativeElement.value);
  
    if (!this.platoSeleccionado || !this.platoSeleccionado.id) {
      console.error("this.platoSeleccionado.id is null or undefined.");
      return;
    }
    
    this.IngredientesService.buscarFechaYPlato(this.platoSeleccionado.id, fecha).subscribe({
      next: (res: any) => {
        console.log("Ingredientes encontrados:", res.ingredientes);
        this.ingredientesss = res.ingredientes;
        
        // Calcular la suma de precios
        this.totalPrecio = this.calculateTotalPrice(this.ingredientesss);

        // Tomar la cantidad del primer ingrediente y formatear la fecha
        if (this.ingredientesss.length > 0) {
          this.personas = this.ingredientesss[0].cantidad;
          this.fechaa = new Date(this.ingredientesss[0].fecha);
          this.fechaFormateada = this.formatDateCustom(this.ingredientesss[0].fecha);
        } else {
          this.personas = 0; // O cualquier valor por defecto
          this.fechaFormateada = '';
        }
      
        this.totalItems = res.ingredientes.length;
        console.log("Total de personas:", this.personas);
        console.log("Fecha formateada:", this.fechaFormateada);

        this.buscarDescripcionporId();
      },
      error: (err) => {
        this.showModalErrorsindatos();
      },
    });
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
 
buscarDescripcionporId() {
  const ingredientId = this.platoSeleccionado.descripcion; // Use the ID, not the description
  if (ingredientId) {
    this.IngredientesService.getobtenerDescripcionPlato(ingredientId).subscribe({
      next: (res: any) => {
        this.ingredientedescripcionsss = res.ingredientes;

        // Si no hay resultados, vaciar ingredientesss para ocultar la tabla
        if (this.ingredientedescripcionsss.length === 0) {
          this.ingredientedescripcionsss = [];
        }
      },
      error: (err) => {
        // Maneja errores de búsqueda, por ejemplo, muestra un mensaje de error al usuario.
        console.error(err);
      },
    });
  } else {
    // Si el usuario borra el ID de búsqueda, vacía ingredientesss para ocultar la tabla
    this.ingredientedescripcionsss = [];
  }
}
calculateTotalPrice(items: any[]): number {
  const total = items.reduce((acc, item) => acc + item.costeo, 0);
  return parseFloat(total.toFixed(2)); // Redondea el total a 2 decimales
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
    const platoSeleccionado = this.platosss.find(
      (plato) => plato.descripcion === descripcion
    );
  
    // Log the value to check if it's assigned correctly
    console.log("Plato seleccionado:", platoSeleccionado);
  
    // Update the value only if a plato is found
    if (platoSeleccionado) {
      this.platoSeleccionado = platoSeleccionado;
      this.ingredientesForm.get("id_plato")?.setValue(platoSeleccionado.id);
    } else {
      // Reset values if plato is not found
      this.platoSeleccionado = { id: null, descripcion: "" };
      this.ingredientesForm.get("id_plato")?.setValue(null);
    }
  }
  
 // ...


 platoInputValue: string = '';

  // ... Resto del componente

  updateFechaId(event: any) {
    const fecha = this.fechaSeleccionado?.fecha || this.formatDate(event.target.value);
  
    if (fecha) {
      this.MenuService.buscarmenuporfecha(fecha).subscribe({
        next: (res) => {
          if (res.platos.length > 0) {
            this.dataSource = new MatTableDataSource(res.platos);
            this.platosss = res.platos;
  
            // Reset the value of the plate field
            this.platoSeleccionado = { id: null, descripcion: "" };
            this.ingredientesForm.get("id_plato")?.setValue(null);
  
            // Update the value of the fecha_menu field in ingredientesForm
            this.ingredientesForm.get("fecha")?.setValue(fecha);
            
            // Clear the table data
            this.ingredientesss = [];
          } else {
            console.error(`No existen registro de platos para la fecha ${fecha}`);
            // Puedes agregar un mensaje en la consola o mostrar una notificación al usuario
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
  }
  
  
  
 // ... Otras partes de tu código ...

 onFechaInput(event: any) {
  const manuallyEnteredDate = event.target.value;
  const selectedDate = this.fechass.find(item => item.fecha === manuallyEnteredDate);

  // Si la fecha ingresada no está en la lista, restablecer el valor del campo de plato y limpiar la lista
  if (!selectedDate) {
    this.platoSeleccionado = { id: null, descripcion: '' };
    this.ingredientesForm.get('id_plato').setValue(null);
    
    // Limpiar la lista de opciones para plato
    this.platosss = [];
    
    // Limpiar la tabla
    this.ingredientesss = [];
  }
}


// ... Otras partes de tu código ...





 

private formatDate(dateString: string): string {
  
 
  const date = parse(dateString, 'yyyy-MM-dd', new Date());
    return format(date, 'yyyy-MM-dd');
  }
  
  




  
  private padZero(value: number): string {
    return value.toString().padStart(2, '0');
  }
  
  
  updateRegistroFechaId(event: any) {
    const fecha = event.target.value;
    const fechaSeleccionado = this.Registrofechass.find((menu) => menu.fecha === fecha);
  
    if (fechaSeleccionado) {
      this.fechaSeleccionado=fechaSeleccionado;
      this.MenuService.buscarmenuporfecha(fechaSeleccionado.fecha).subscribe({
        next: (res) => {
          this.dataSource = new MatTableDataSource(res.platos);
          this.platosss = res.platos;
  
          // Actualizar el valor del campo fecha_menu en ingredientesForm
          this.ingredientesForm.get("fecha")?.setValue(fechaSeleccionado.fecha);
        },
        error: (err) => {
          console.error(err);
        },
      });
    }


  }
  onPlatoInputChange(event: any) {
    const descripcion = event.target.value;
    const platoSeleccionado = this.platosss.find((plato) => plato.descripcion === descripcion);
  
    if (platoSeleccionado) {
      // Almacena internamente el id del plato seleccionado
      this.ingredientesForm.get("id_plato")?.setValue(platoSeleccionado.id);
    } else {
      // Si no se encuentra un plato, restablece los valores
      this.ingredientesForm.get("id_plato")?.setValue(null);
      this.buscarIngredientePorId();
    }
  }
  
  
 
 
  
  



 //'------------------------------------------------------
 fechaSeleccionado: { id: number | null; fecha: string } = {
  id: null,
  fecha: "",
};




 //-------------------------------------------------------
  //Modal de Agregar Notificacion
  title = "sweetAlert";
  
  showModal() {
    swal2({
      title: 'Datos registrado exitosamente',
      icon: 'success',
    }).then(() => {
      // Forzar una recarga de la página
      window.location.reload();
    });
  }
  

  //Modal de No agg error de Notificacion

  showModalError() {
    swal({
      title: "Error de registro de datos ",
      icon: "error",
    });
  }

  showModalErrorsindatos() {
    swal({
      title: "No existen ingredientes para ese plato",
      icon: "error",
    });
  }

  //Modal de Modificacion Notificacion

  showModalEdit() {
    swal2({
      title: "Datos modificado exitosamente",
      icon: "success",
    });
  }

  //Modal de  error de Modificacion Notificacion

  showModalErrorEdit() {
    swal({
      title: "Error de modificación de datos ",
      icon: "error",
    });
  }



  getAllingredientes() {
    this.MenuService.gettplato().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.platos);
        this.ingredientes = res.platos;
        
      },
      error: (err) => {
        //alert("Error en la carga de datos");
      },
    });
  }
  

  getAllFechas() {
    this.MenuService.gettfechaMenu().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.menu);
        this.fechass = res.menu;
        
      },
      error: (err) => {
        //alert("Error en la carga de datos");
      },
    });
  }

  getAllFechasRegistro() {
    this.MenuService.gettfechaMenuregistro().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.menu);
        this.Registrofechass = res.menu;
        
      },
      error: (err) => {
        //alert("Error en la carga de datos");
      },
    });
  }
  


  //Para el registro de ingredientes usando modal
  nuevoCurso() {
    this.tituloForm = "Registro de Ingredientes"; //cambio de nombre en el encabezado
    this.ingredientesForm.reset();
    this.editandoIngredientes = false;
    this.idIngredientesEditar = "";

    // Reset the selectedOption and clear the form field value
    this.selectedOptionalimento = null;
    this.ingredientesForm.get("id_alimento")?.setValue(null);

    // Reset the selectedOption and clear the form field value
    this.selectedOptionplato = null;
    this.ingredientesForm.get("id_plato")?.setValue(null);

    // Establecer variables a false al editar
    this.showIdalimentoError = false;
    this.showIdplatoError = false;
    this.showAlimentoError = false;
    this.showCantidadPersonaError = false;
    this.showDiasError = false;
  }
  //Para el editar de ingredientes usando modal

  editarIngrediente(item: any) {
    this.tituloForm = "Editar Ingredientes";
    this.ingredientesForm.patchValue({
      precio: item.precio,
      cantidadPersona: item.cantidadPersona,
      numDias: item.numDias,
      id_plato: item.id_plato,         // Establecer el valor del campo id_plato
    /*   id_alimento: item.id_alimento,   // Establecer el valor del campo id_alimento */
    });
    console.log("ID de plato:", item.id_plato);
    // Verificar si item.plato está definido y tiene una propiedad descripcion
    if (item.plato && item.plato.descripcion) {
    
      this.platoSeleccionado = {
        id: item.id_plato,
        descripcion: item.plato.descripcion
       
      };  console.log("Plato Descripción:", this.id);
    } else {
      // Maneja el caso en que item.plato o item.plato.descripcion sean undefined
      // Puedes asignar un valor predeterminado o dejar el campo vacío
      this.platoSeleccionado = {
        id: null,
        descripcion: ""
      };
    }
    

    this.editandoIngredientes = true;
    this.idIngredientesEditar = item.id;
  console.log("idddddddddddddd:", this.idIngredientesEditar);
    // Asegúrate de establecer las variables de validación en false
    this.showIdplatoError = false;
    this.showPrecioError = false;
    this.showIdalimentoError = false;
    this.showDiasError = false;
    this.showCantidadPersonaError = false;
  }
  
  
  // Registro de ingredientes...

  addIngredientes() {
    if (this.ingredientesForm.valid) {
      this.showIdplatoError = false;
      this.showPrecioError = false;
      this.showIdalimentoError = false;
      this.showDiasError = false;
      this.showCantidadPersonaError = false;

      const datos = {
        precio: this.ingredientesForm.value.precio,
        numDias: this.ingredientesForm.value.numDias,
        cantidadPersona: this.ingredientesForm.value.cantidadPersona,
        id_plato: this.ingredientesForm.value.id_plato,
        
        fecha: this.ingredientesForm.value.fecha,
/*         id_alimento: this.ingredientesForm.value.id_alimento,
 */

        
        
      };

      console.log("Datos a enviar:", datos);
      if (!this.editandoIngredientes) {
        this.IngredientesService.guardar(datos).subscribe(
          (result: any) => {
            console.log(result);
            this.showModal();
            // this.getAllingredientes(); // Actualizar la tabla después de agregar un ingrediente
            this.ingredientesForm.reset(); // Restablecer los valores del formulario
            
            this.platoSeleccionado.descripcion = ""; // Limpiar el valor del campo de plato
            this.alimentoSeleccionado.descripcion = ""; // Limpiar el valor del campo de alimento
    
           
          },
          (error) => {
            console.log(error);
            this.showModalError();
          }
        );
      } else {
        // m o d i f i c a r -----------------------------
        this.IngredientesService.guardar(
          datos, this.idIngredientesEditar
        ).subscribe(
          (result: any) => {
            console.log(result);
            this.showModalEdit();
            this.nuevoCurso(); // Restablecer el formulario después de editar
            // this.getAllingredientes();
          },
          (error) => {
            console.log(error);
            this.showModalErrorEdit();
          }
        );
      }
    } else {
      this.showPrecioError = this.ingredientesForm.controls.precio.invalid;
      this.showIdplatoError = this.ingredientesForm.controls.id_plato.invalid;
      this.showIdalimentoError =
      this.showDiasError = this.ingredientesForm.controls.numDias.invalid;
      this.showCantidadPersonaError =
        this.ingredientesForm.controls.cantidadPersona.invalid;
    }
  }

  // ...
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
    this.IngredientesService.deleteingredientescreados(id).subscribe({
      next: (res) => {
        Swal.fire({
          title: "Datos eliminados exitosamente",
          icon: "success",
        }).then(() => {
          //      this.getAllingredientes();
          this.buscarIngredientePorId(); 
        });
      },
      error: () => {
        this.showModalErrorEliminar();
      },
    });
  }

  // Restablecer el formulario cuando se cierre el modal
  closeModal() {
    this.ingredientesForm.reset();
    this.editandoIngredientes = false;
    this.idIngredientesEditar = "";
  }

  resetForm() {
    this.ingredientesForm.reset();
    this.editandoIngredientes = false;
    this.idIngredientesEditar = "";
  
    // Limpia los valores seleccionados para plato y alimento
    this.platoSeleccionado = { id: null, descripcion: "" };
    this.alimentoSeleccionado = { id: null, descripcion: "" };
  
    // Restablece las variables de validación a false
    this.showIdplatoError = false;
    this.showPrecioError = false;
    this.showIdalimentoError = false;
    this.showDiasError = false;
    this.showCantidadPersonaError = false;
  }
  // Lógica para cerrar el modal después de guardar los cambios
closeModalAfterSave() {
  // Restablece el formulario
  this.resetForm();

  // Cierra el modal
  // Aquí puedes agregar la lógica para cerrar el modal, si es necesario
}

// Lógica para cerrar el modal después de hacer clic en "Cancelar"
closeModalAfterCancel() {
  // Restablece el formulario
  this.resetForm();

  // Cierra el modal
  // Aquí puedes agregar la lógica para cerrar el modal, si es necesario
}




      
      



descargarPDF() {
  const n = this.cantidad;
  const rows = this.ingredientesss.map((item, index) => [
    (index + 1).toString(), // Número
    item.alimento.descripcion, // Producto
    item.unidadMedida.unidadMedida, // Unidad de medida
    item.cantidadPersonaCome,
    `${item.cantidadPersonaGramo} ${this.getUnidadMedida(item.unidadMedida.unidadMedida.toLowerCase())}`, // Porción por persona

    
     
     this.formatPrice(item.preciounidad),
    this.formatPrice(item.costeounaPersona),
    `${item.porcion} ${this.getUnidadMedida(item.unidadMedida.unidadMedida.toLowerCase())}`, // Porción por persona

    
     this.formatPrice(item.costeo)
  ]);

  const anchoPagina = 595.28;
  let columnWidths = [30, 55, 45, 50, 50,40,60,60,50 ];
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
            { text: `Precio del Menú: ${this.formatPrice(this.ingredientedescripcionsss[0].plato.precio)}`, bold: true, fillColor: '#D3D3D3', border: [true, true, true, true] },
            { text: `Costeo del Menú: ${this.formatPrice(this.totalPrecio)}`, bold: true, fillColor: '#D3D3D3', border: [true, true, true, true] },
            { text: `Cantidad de personas: ${this.personas}`, bold: true, fillColor: '#D3D3D3', border: [true, true, true, true] },
            { text: `Fecha: ${this.fechaFormateada}`, bold: true, fillColor: '#D3D3D3', border: [true, true, true, true] },
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
        { text: 'Cálculos para  menú-persona', style: 'subheader', alignment: 'left', bold: true },
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
              [  'Nº', 'Producto', 'Unidad de medida','Cantidad persona come	       			', 'Porción por cantidad de persona','	Precio unidad','Costeo una persona',`Porción para  ${this.personas} personas`, 'Costo por cantidad de persona'
            ].map((cell, index) => ({
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
    pdfMake.createPdf(documentoPDF).download('INFORME DE PRODUCTOS CON SU MENÚ.pdf');
  });
}


cantidad:number;

descargarExcel() {
  
const ExcelJS = require('exceljs');
const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('Informe de productos con su menú');

// Organizar créditos por persona
const creditosPorPersona = {};

this.ingredientedescripcionsss.forEach(item => {
const platoDescripcion = `Menú: ${item.plato.descripcion}`;
const precioMenu = `Precio del Menú: ${this.formatPrice(item.plato.precio)}`;
const costeoMenu = `Costeo del Menú: ${this.formatPrice(this.totalPrecio)}`;
const cantidadpersona = `Cantidad de personas: ${this.personas}`;
const fecha = `Costeo del Menú: ${this.fechaFormateada}`;

const row = worksheet.addRow([platoDescripcion, precioMenu, costeoMenu,cantidadpersona,fecha]);

row.eachCell(cell => {
    cell.font = { size: 12, bold: true }; // Letra más grande y negrita
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFCCCCFF' } }; // Fondo color (lavanda)
});
});

// Agregar encabezados de la tabla
const headers = [
  'Nº', 'Producto', 'Unidad de medida','Cantidad persona come	       			', 'Porción por cantidad de persona','	Precio unidad','Costeo una persona',`Porción para  ${this.personas} personas`, 'Costo por cantidad de persona'
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
this.ingredientesss.forEach((item, index) => {
 
const rowData = [
    index + 1,
    item.alimento.descripcion, // Producto
    item.unidadMedida.unidadMedida, // Unidad de medida
    item.cantidadPersonaCome,
    `${item.cantidadPersonaGramo} ${this.getUnidadMedida(item.unidadMedida.unidadMedida.toLowerCase())}`, // Porción por persona

    
     this.formatPrice(item.preciounidad),
     this.formatPrice(item.costeounaPersona),
    `${item.porcion} ${this.getUnidadMedida(item.unidadMedida.unidadMedida.toLowerCase())}`, // Porción por persona

    
     this.formatPrice(item.costeo)
];

worksheet.addRow(rowData);
});

// Establecer estilos para datos
for (let i = worksheet.lastRow.number - this.ingredientesss.length + 1; i <= worksheet.lastRow.number; i++) {
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

formatPrice(price: number): string {
  if (price === null) return 'N/A';
  if (price.toString().startsWith('0')) {
    return `${this.truncateZeros(price)} ctvs`;
  } else {
    return `${price} $`;
  }
}

  
}


