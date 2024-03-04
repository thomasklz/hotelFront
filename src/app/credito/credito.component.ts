import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {  FormBuilder,   FormControl,   FormGroup,   Validators, } from "@angular/forms";
import { Router } from "@angular/router";
import { MatTableDataSource } from "@angular/material/table";
import swal from "sweetalert";
import swal2 from "sweetalert";
import { IngredientesService } from "../servicios/ingredientes.service";
import Swal from "sweetalert2";
import { MenuService } from "app/servicios/menu.service";
import { CreditosService } from "app/servicios/creditos.service";
import { UsuarioService } from "../servicios/usuario.service";
import { NgZone } from "@angular/core";
import { ElementRef, ViewChild } from "@angular/core";
import * as XLSX from 'xlsx';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { saveAs } from 'file-saver';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ImageService } from "app/servicios/image.service";

@Component({
  selector: "app-credito",
  templateUrl: "./credito.component.html",
  styleUrls: ["./credito.component.scss"],
})
export class CreditoComponent implements OnInit {
  @ViewChild("inputDatalist") inputDatalist: ElementRef;
  selected = 'option2';
  dataSource = new MatTableDataSource<any>();
  id: string = "";
  id_persona: string = "";
  id_plato: string = "";
  personasss: any[] = [];
  personas: any[] = [];

  platosss: any[] = [];
  creditosss: any[] = [];
  ingredientes: any[] = [];
  ingredientId: string = "";
  ingredientedescripcionsss: any[] = [];
 


  tituloForm;
  tituloForm2;
  creditosForm!: FormGroup;
  reporteIngresosForm!: FormGroup;

  editandoCreditos: boolean = false; // Variable para indicar si se está editando un alimento existente
  idCreditosEditar: string = ""; // Variable para almacenar el ID del alimento en caso de edición
  showPrecioError = false; //evitando que se muestren los mensajes de campo requerido
  showIdplatoError = false; //evitando que se muestren los mensajes de campo requerido
  showFechaError = false;
  showPagadoError = false;
  showPersonaError = false;
  showCantidadError = false;
  nombreUsuarioInput: string = "";
  nombre2UsuarioInput: string = "";
  apellido1UsuarioInput: string = "";
  apellido2UsuarioInput: string = "";

  creditosssOriginal: any[] = [];

  constructor(
    private http: HttpClient,
    private MenuService: MenuService,
    private router: Router,
    private formBuilder: FormBuilder,
    private CreditosService: CreditosService,
    private zone: NgZone,
    private changeDetector: ChangeDetectorRef,
    private UsuarioService: UsuarioService,
    private IngredientesService: IngredientesService,
    private imageService: ImageService
  ) {
    this.getAllplatos();
    this.getAllpersonas();
    this.getAllcreditos();
  }



  idIngreso: number = 1;
  //cargar los datos de la seleccion de la tabla  en la modal
  ngOnInit() {
    this.idIngreso = 1;
  console.log(this.idIngreso);
    console.log("Valor de ingredientId:", this.ingredientId);

    this.getAllcreditos();
    this.getAlldescripcionplatos();
    this.getAllpersonascedula();
    this. aplicarFiltros();
 
    this.creditosForm = this.formBuilder.group({
      precio: new FormControl("", [
        Validators.required,
        Validators.minLength(1),
      ]),
      id_plato: new FormControl("", [
        Validators.required,
        Validators.maxLength(1),
      ]),
      id_persona: new FormControl("", [
        Validators.required,
        Validators.maxLength(1),
      ]),

      id_ingreso: new FormControl("", ),
      pagado: new FormControl(""),

      cantidad: new FormControl("", [
        Validators.required,
        Validators.minLength(1),
      ]),
      nombreUsuarioInput: new FormControl(""),
      nombre2UsuarioInput: new FormControl(""),
      apellido1UsuarioInput: new FormControl(""),
      apellido2UsuarioInput: new FormControl(""),

    });


    this.reporteIngresosForm = this.formBuilder.group({
       
      id_plato: new FormControl("", [
        Validators.required,
        Validators.maxLength(1),
      ]),
     

      id_ingreso: new FormControl("" ),
 
      cantidad: new FormControl("", [
        Validators.required,
        Validators.minLength(1),
      ]),
      precio: ['', Validators.required],
     
    });

    

    this.inputDatalist.nativeElement.addEventListener("change", () => {
      this.onDescriptionSelected();
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

  get pagedCreditos(): any[] {
    return this.creditosss.slice(this.startIndex, this.endIndex + 1);
  }

  // ... otras funciones del componente


  onPageChange(event: number) {
    this.currentPage = event;
  }



 
  


  
//-----------------------






descargarPDF() {
  const rows = this.creditosss.map((item, index) => [
    index + 1,
    item.persona.Apellido1,
    item.persona.Nombre1,
    item.persona.EmailInstitucional,
    item.persona.TelefonoC,
    item.plato.descripcion,
    item.cantidad,
    item.precio,
    item.fecha,
    item.pagado ? 'Sí' : 'No',
  ]);

  const anchoPagina = 595.28;
  let columnWidths = [20, 45, 45, 50, 50, 45, 50, 35, 45, 43];
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
        { text: 'INFORME DE CRÉDITOS DEL RESTAURANTE', style: 'header', alignment: 'center' },
        '\n',
        {
          table: {
            headerRows: 1,
            widths: columnWidths,
            body: [
              ['Nº', 'Apellido','Nombre', 'Email', 'Teléfono', 'Plato', 'Cantidad', 'Precio', 'Fecha', 'Pagado'].map((cell, index) => ({
                text: cell,
                bold: true,
                fillColor: '#D3D3D3',
              })),
              ...rows.map(row => row.map(cell => ({ text: cell }))),
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
    pdfMake.createPdf(documentoPDF).download('INFORME DE CRÉDITOS DEL RESTAURANTE.pdf');
  });
}








//-----------------------


  datosParaDescargar: any[] = []; // Variable para almacenar los datos a descargar


  //'''''''''''''''''''''''
  descargarDatos() {
    const datosParaDescargar = this.creditosss.map(item => ({
      'Apellido': item.persona.Apellido1,
      'Nombre': item.persona.Nombre1,
      'Email': item.persona.EmailInstitucional,
      'Teléfono': item.persona.TelefonoC,
      'Plato': item.plato.descripcion,
      'Cantidad': item.cantidad,
      'Precio': item.precio,
      'Fecha': item.fecha,
      'Pagado': item.pagado ? 'Sí' : 'No',
    }));
  
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosParaDescargar);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Listado de créditos');
    const excelArray = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([new Uint8Array(excelArray)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Listado de créditos.xlsx';
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
  
  
  
  
  
  
  

//----------------filtro
nombreFiltro: string = '';
 fechaFiltro: string = '';
filtroSeleccionado: string = 'nombre';
// ...
aplicarFiltros() {
if (this.filtroSeleccionado === 'nombre') {
  // Aplica el filtro por nombre y restablece el filtro de fecha
  this.fechaFiltro = '';
} else if (this.filtroSeleccionado === 'fecha') {
  // Si se selecciona el filtro de fecha, vacía el filtro de nombre
  this.nombreFiltro = '';
}

this.creditosss = this.creditosssOriginal.filter(item => {
  return !this.nombreFiltro || item.persona.Nombre1.toLowerCase().includes(this.nombreFiltro.toLowerCase());
});
}

aplicarFiltrosfecha() {
if (this.filtroSeleccionado === 'fecha') {
  // Aplica el filtro por fecha y restablece el filtro de nombre
  this.nombreFiltro = '';
} else if (this.filtroSeleccionado === 'nombre') {
  // Si se selecciona el filtro por nombre, vacía el filtro de fecha
  this.fechaFiltro = '';
}

this.creditosss = this.creditosssOriginal.filter(item => {
  return !this.fechaFiltro || item.fecha.includes(this.fechaFiltro);
});
}
// ...


  

  //-----------------------------------------

  onDescriptionSelected() {
    // Llamada a la función buscarPrecioPorDescripcion al seleccionar una descripción
    this.buscarPrecioPorDescripcion();
    this.buscarPrecioPorDescripcionSincredito();
  }

  // ... (resto del código)

  showMoreOptionsplato: boolean = false;
  showMoreOptionspersona: boolean = false;

  selectedOptionplato: any = null;
  selectedOptionpersona: any = null;

  toggleShowMoreOptionsplato() {
    this.showMoreOptionsplato = !this.showMoreOptionsplato;
  }
  toggleShowMoreOptionspersona() {
    this.showMoreOptionspersona = !this.showMoreOptionspersona;
  }

  selectOptionplato(item: any) {
    this.selectedOptionplato = item;
    this.showMoreOptionsplato = false;
    // Asignar el valor del ID del plato seleccionado al formulario
    this.creditosForm.get("id_plato")?.setValue(item.id);
  }

  selectOptionpersona(item: any) {
    this.selectedOptionpersona = item;
    this.showMoreOptionspersona = false;

    // Asignar el valor del ID del alimento seleccionado al formulario
    this.creditosForm.get("id_persona")?.setValue(item.id);
  }

  getSelectedOptionLabelplato() {
    return this.selectedOptionplato
      ? this.selectedOptionplato.descripcion
      : "Seleccione  ";
  }

  getSelectedOptionLabelpersona() {
    return this.selectedOptionpersona
      ? this.selectedOptionpersona.nombre
      : "Seleccione  ";
  }

  //Modal de Agregar Notificacion
  title = "sweetAlert";
  showModal() {
    swal2({
      title: "Datos registrado exitosamente",
      icon: "success",
    });
  }

  //Modal de No agg error de Notificacion
  showModalError() {
    swal({
      title: "Error de registro de datos ",
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

  //registrar el id plato el nuevo que se selecciona y enviarlo a la data
  getId_plato() {
    this.http
      .get("http://localhost:3000/api/crearplato/?=" + this.id_plato)
      .subscribe((result: any) => {
        this.platosss = result.creditos;
      });
  }

  //registrar el id persona el nuevo que se selecciona y enviarlo a la data
  getId_persona() {
    this.http
      .get("http://localhost:3000/api/crearPersona/?=" + this.id_persona)
      .subscribe((result: any) => {
        this.personasss = result.creditos;
      });
  }

  //obtener todos los platos para utlizarlo en el selection

  getAllplatos() {
    this.MenuService.gettplatoselect().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.plato);
        this.platosss = res.plato;
      },
      error: (err) => {
        // alert("Error en la carga de datos");
      },
    });
  }

  getAlldescripcionplatos() {
    this.MenuService.mostrarplatocredito().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.platos);
        this.ingredientes = res.platos;
      },
      error: (err) => {
        //alert("Error en la carga de datos");
      },
    });
  }

  getAllpersonas() {
    this.UsuarioService.getpersonacedula().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.usuarios);
        this.personasss = res.usuarios;
      },
      error: (err) => {
        // alert("Error en la carga de datos");
      },
    });
  }

  getAllpersonascedula() {
    this.UsuarioService.getpersonacedula().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.usuarios);
        this.personas = res.usuarios;
      },
      error: (err) => {
        // alert("Error en la carga de datos");
      },
    });
  }

  //obtener todos los credito
  getAllcreditos() {
    this.CreditosService.getcreditos().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.creditos);
        this.creditosss = res.creditos;
        this.creditosssOriginal = [...res.creditos]; 
        this.totalItems = res.creditos.length; 
      },
      error: (err) => {
        //alert("Error en la carga de datos");
      },
    });
  }
 
  

  //Para el registro de plato usando modal
  nuevoCurso() {
    this.tituloForm = "Registro de créditos"; //cambio de nombre en el encabezado
    this.tituloForm2 = "Registro de consumidor final"; //
    this.creditosForm.reset();
    this.editandoCreditos = false;
    this.idCreditosEditar = "";

    // Reset the selectedOption and clear the form field value
    this.selectedOptionpersona = null;
    this.creditosForm.get("id_persona")?.setValue(null);

    // Reset the selectedOption and clear the form field value
    this.selectedOptionplato = null;
    this.creditosForm.get("id_plato")?.setValue(null);

    this.creditosForm.get("id_ingreso")?.setValue(null);
    
    // Establecer variables a false al editar
    this.showPersonaError = false;
    this.showFechaError = false;
    this.showIdplatoError = false;
    this.showCantidadError = false;
    this.showPrecioError = false;
    this.showPagadoError = false;






    console.log("this.tituloForm:", this.tituloForm);
   
    if (this.tituloForm === "Registro de créditos") {
      this.creditosForm.get('id_ingreso').setValue(1);
    }  
    console.log("id_ingreso:", this.creditosForm.get('id_ingreso').value);
  

 

  }

  nuevoCurso2() {
     this.tituloForm2 = "Registro de consumidor final"; //
    this.reporteIngresosForm.reset();
    this.editandoCreditos = false;
    this.idCreditosEditar = "";

    

    // Reset the selectedOption and clear the form field value
    this.selectedOptionplato = null;
    this.reporteIngresosForm.get("id_plato")?.setValue(null);

    this.reporteIngresosForm.get("id_ingreso")?.setValue(null);
    
    // Establecer variables a false al editar
     this.showIdplatoError = false;
    this.showCantidadError = false;
 





     console.log("this.tituloForm2:", this.tituloForm2);
  
    if (this.tituloForm2 === "Registro de consumidor final") {
      this.reporteIngresosForm.get('id_ingreso').setValue(2);
    }  
    console.log("id_ingreso:", this.reporteIngresosForm.get('id_ingreso').value);
  

 

  }
  //Para el editar de credito usando modal

  editarCreditos(item: any) {
    this.tituloForm = 'Editar  créditos';
    this.creditosForm.patchValue({
      
      precio: item.precio,
      cantidad: item.cantidad,
      pagado: item.pagado,
      id_plato: item.plato.id,
      id_persona: item.persona.id
    });
  
    // Configurar el valor del radio button
    const radioValue = +item.pagado === 1 ? '1' : '0';
    console.log('Radio Value:', radioValue);
    this.creditosForm.get('pagado')?.setValue(radioValue);
  
    // Configurar la descripción del plato seleccionado
    this.platoSeleccionados = {
      id: item.plato.id,
      descripcion: item.plato.descripcion
    };
  
    this.selectedOptionpersona = { nombre: item.persona.nombre, id: item.persona.id };
    this.selectedOptionplato = { descripcion: item.plato.descripcion, id: item.plato.id };
  
    // Actualizar las listas según sea necesario (puede requerir llamadas a servicios)
    this.getId_plato();
    this.getId_persona();
    this.editandoCreditos = true;
    this.idCreditosEditar = item.id;
  
    // Cargar el valor del campo "Crédito a:" con el nombre del usuario
    this.nombreUsuarioInput = item.persona.Nombre1;
    this.nombre2UsuarioInput = item.persona.Nombre2;
    this.apellido1UsuarioInput = item.persona.Apellido1;
    this.apellido2UsuarioInput = item.persona.Apellido2;
    // Establecer variables a false al editar
    this.showPrecioError = false;
    this.showIdplatoError = false;
    this.showPersonaError = false;
    this.showPagadoError = false;
    this.showCantidadError = false;
    this.showFechaError = false;
  
    // Llama a tu método onPersonaClick() para actualizar otros datos según el nombre del usuario
    this.onPersonaClick();
  }
  

  // ... (resto del código)

  updateUsuarioId(event: any) {
    const usuarioInput = event.target.value;
    console.log("Usuario Input:", usuarioInput);

    const usuarioSeleccionado = this.personas.find(
      (Identificacion) => Identificacion.Identificacion === usuarioInput
    );
    console.log("Usuario Seleccionado:", usuarioSeleccionado);

    this.usuarioSeleccionado = usuarioSeleccionado || {
      id: null,
      Identificacion: usuarioInput,
    };
    this.creditosForm.get("id_persona")?.setValue(this.usuarioSeleccionado.id);
    this.onPersonaClick();
  }

  updatePlatoId(event: any) {
    const descripcion = event.target.value;
    const platoSeleccionado = this.ingredientes.find(
      (plato) => plato.descripcion === descripcion
    );
    this.platoSeleccionados = platoSeleccionado || {
      id: null,
      descripcion: descripcion,
    };
    this.creditosForm.get("id_plato")?.setValue(this.platoSeleccionados.id);

    // Actualiza ingredientId con la descripción del plato seleccionado
    this.ingredientId = this.platoSeleccionados.descripcion || "";

    // Llama a buscarPrecioPorDescripcion directamente al seleccionar la descripción
    this.buscarPrecioPorDescripcion();
  }





  


  updatePlatoIdReporteIngresos(event: any) {
    const descripcion = event.target.value;
    const platoSeleccionado = this.ingredientes.find(
      (plato) => plato.descripcion === descripcion
    );
    this.platoSeleccionados = platoSeleccionado || {
      id: null,
      descripcion: descripcion,
    };
    this.reporteIngresosForm.get("id_plato")?.setValue(this.platoSeleccionados.id);

    // Actualiza ingredientId con la descripción del plato seleccionado
    this.ingredientId = this.platoSeleccionados.descripcion || "";

    // Llama a buscarPrecioPorDescripcion directamente al seleccionar la descripción
    this.buscarPrecioPorDescripcionSincredito();
  }
  usuarioSeleccionado: { id: number | null; Identificacion: string } = {
    id: null,
    Identificacion: "",
  };

  // ... (resto del código)
  platoSeleccionados: { id: number | null; descripcion: string } = {
    id: null,
    descripcion: "",
  };

  buscarPrecioPorDescripcionSincredito() {
    // Verifica si ingredientId tiene un valor
    if (this.ingredientId) {
      // Lógica para buscar el precio por descripción
      this.IngredientesService.getobtenerDescripcionPlatoPrecio(
        this.ingredientId
      ).subscribe(
        (result: any) => {
          console.log("Respuesta del servicio:", result);
          const plato = result.platos[0].plato; // Accedemos a la propiedad 'plato' del primer elemento del arreglo
          if (plato && plato.precio !== undefined) {
            // Actualiza el valor del precio en el formulario
            this.reporteIngresosForm.get("precio")?.setValue(plato.precio);
 
          } else {
            // Maneja el caso cuando no se encuentra el plato o el precio no está definido
            console.error("Plato no encontrado o precio no definido");
          }
        },
        (error) => {
          console.error("Error al obtener precio del plato", error);
        }
      );
    } else {
      console.error("ingredientId no tiene un valor");
    }
  }












  buscarPrecioPorDescripcion() {
    // Verifica si ingredientId tiene un valor
    if (this.ingredientId) {
      // Lógica para buscar el precio por descripción
      this.IngredientesService.getobtenerDescripcionPlatoPrecio(
        this.ingredientId
      ).subscribe(
        (result: any) => {
          console.log("Respuesta del servicio:", result);
          const plato = result.platos[0].plato; // Accedemos a la propiedad 'plato' del primer elemento del arreglo
          if (plato && plato.precio !== undefined) {
            // Actualiza el valor del precio en el formulario
            this.creditosForm.get("precio")?.setValue(plato.precio);
          } else {
            // Maneja el caso cuando no se encuentra el plato o el precio no está definido
            console.error("Plato no encontrado o precio no definido");
          }
        },
        (error) => {
          console.error("Error al obtener precio del plato", error);
        }
      );
    } else {
      console.error("ingredientId no tiene un valor");
    }
  }

  onPersonaClick() {
    const nombreUsuario = this.usuarioSeleccionado.Identificacion;
    this.UsuarioService.obtenerNombrePorUsuario(nombreUsuario).subscribe(
      (result: any) => {
        if (result.Nombre1) {
          this.nombreUsuarioInput = result.Nombre1;
          this.nombre2UsuarioInput = result.Nombre2;
          this.apellido1UsuarioInput = result.Apellido1;
          this.apellido2UsuarioInput = result.Apellido2;

          this.changeDetector.detectChanges(); // Forzar la actualización de la vista
          console.log("Nombre del usuario actualizado:", result.Nombre1);
          console.log("Nombre del usuario actualizado:", result.Nombre2);
        } else {
          console.error("Nombre de usuario no encontrado");
        }
      },
      (error) => {
        console.error("Error al obtener el nombre del usuario", error);
      }
    );
  }

  onDescriptionInput() {
    // Se ejecutará cada vez que el usuario escriba o seleccione un valor
    console.log("Valor seleccionado o escrito:", this.ingredientId);
    // Puedes realizar la lógica necesaria aquí
    this.buscarPrecioPorDescripcion();
    this.buscarPrecioPorDescripcionSincredito();
  }

  onDescriptionChange(newValue: string) {
    console.log("Nuevo valor seleccionado o escrito:", newValue);
    this.buscarPrecioPorDescripcion();
    this.buscarPrecioPorDescripcionSincredito();
  }

  // Registro de Credito...




  AddcrearreporteIngresos() {
    console.log("Entro a AddcrearreporteIngresos");
    
    if (this.reporteIngresosForm.valid) {
      console.log("Formulario válido");
  
      this.showCantidadError = false;
      this.showIdplatoError = false;
  
      const datos = {
        cantidad: this.reporteIngresosForm.value.cantidad,
        id_plato: this.reporteIngresosForm.value.id_plato,
        id_ingreso: this.reporteIngresosForm.value.id_ingreso
      };
  
      if (!this.editandoCreditos) {
        this.CreditosService.crearreporteIngresos(datos).subscribe(
          (result: any) => {
            console.log(result);
            this.showModal();
            this.getAllcreditos(); // Actualizar la tabla después de agregar un crédito
            this.reporteIngresosForm.reset(); // Restablecer los valores del formulario
            const filtroSelect = document.getElementById("filtroSelect") as HTMLSelectElement;
            filtroSelect.value = "Seleccionar";
          },
          (error) => {
            console.log(error);
            this.showModalError();
            const filtroSelect = document.getElementById("filtroSelect") as HTMLSelectElement;
            if (filtroSelect) {
                filtroSelect.value = "Seleccionar";
            }
          }
        );
      } 
    } else {
      const filtroSelect = document.getElementById("filtroSelect") as HTMLSelectElement;
      if (filtroSelect) {
          filtroSelect.value = "Seleccionar";
      }
      console.log("Formulario inválido");
      console.dir(this.reporteIngresosForm);
  
      this.showCantidadError = this.reporteIngresosForm.controls.cantidad.invalid;
      this.showIdplatoError = this.reporteIngresosForm.controls.id_plato.invalid;
      // Agregar otras validaciones si es necesario
    }
  }
  

  addCredito() {
    if (this.creditosForm.valid) {
      this.showPrecioError = false;
      this.showIdplatoError = false;
      this.showPersonaError = false;
      this.showPagadoError = false;
      this.showCantidadError = false;
      this.showFechaError = false;
  
      // Set the default value of pagado to false when adding a new credit
      if (!this.editandoCreditos) {
        this.creditosForm.get("pagado")?.setValue("0");
      }
  
     
  
      if (!this.editandoCreditos) {
        this.CreditosService.guardar(this.creditosForm.value).subscribe(
          (result: any) => {
            console.log(result);
            this.showModal();
            this.getAllcreditos(); // Actualizar la tabla después de agregar un crédito
            this.nombreUsuarioInput = "";
            this.nombre2UsuarioInput = "";
            this.apellido1UsuarioInput = "";
            this.apellido2UsuarioInput = "";
  
            this.creditosForm.reset(); // Restablecer los valores del formulario
            const filtroSelect = document.getElementById("filtroSelect") as HTMLSelectElement;
            if (filtroSelect) {
              filtroSelect.value = "Seleccionar";
            }
          },
          (error) => {
            console.log(error);
            this.nombreUsuarioInput = "";
            this.nombre2UsuarioInput = "";
            this.apellido1UsuarioInput = "";
            this.apellido2UsuarioInput = "";
  
            this.showModalError();
            const filtroSelect = document.getElementById("filtroSelect") as HTMLSelectElement;
            if (filtroSelect) {
              filtroSelect.value = "Seleccionar";
            }
          }
        );
      } else {
        // m o d i f i c a r -----------------------------
        this.CreditosService.guardar(this.creditosForm.value, this.idCreditosEditar).subscribe(
          (result: any) => {
            console.log(result);
            this.showModalEdit();
            this.nuevoCurso(); // Restablecer el formulario después de editar
            this.getAllcreditos();
          },
          (error) => {
            console.log(error);
            this.showModalErrorEdit();
            const filtroSelect = document.getElementById("filtroSelect") as HTMLSelectElement;
            if (filtroSelect) {
              filtroSelect.value = "Seleccionar";
            }
          }
        );
      }
  
    } else {
      // Manejar errores de validación del formulario
      this.showModalError();  
      // Mostrar errores de cada control individual
      Object.keys(this.creditosForm.controls).forEach(controlName => {
        const control = this.creditosForm.get(controlName);
        if (control?.invalid) {
          console.log(`Control '${controlName}' tiene errores:`, control.errors);
          this.showModalError();  
        }
      });
  
      // Limpiar el formulario y mostrar mensajes de error
      this.limpiarFormularioYMostrarError();
    }
  }
  
  
  // Función para restablecer el formulario
  resetFormulario() {
    this.nombreUsuarioInput = "";
    this.nombre2UsuarioInput = "";
    this.apellido1UsuarioInput = "";
    this.apellido2UsuarioInput = "";
    this.creditosForm.reset(); // Restablecer los valores del formulario
    const filtroSelect = document.getElementById("filtroSelect") as HTMLSelectElement;
    if (filtroSelect) {
      filtroSelect.value = "Seleccionar";
    }
  }
  
  // Función para limpiar el formulario y mostrar errores
  limpiarFormularioYMostrarError() {
    this.nombreUsuarioInput = "";
    this.nombre2UsuarioInput = "";
    this.apellido1UsuarioInput = "";
    this.apellido2UsuarioInput = "";
    const filtroSelect = document.getElementById("filtroSelect") as HTMLSelectElement;
    if (filtroSelect) {
      filtroSelect.value = "Seleccionar";
    }
    this.showPrecioError = this.creditosForm.controls.precio.invalid;
    this.showPagadoError = this.creditosForm.controls.pagado.invalid;
    this.showCantidadError = this.creditosForm.controls.cantidad.invalid;
    this.showIdplatoError = this.creditosForm.controls.id_plato.invalid;
    this.showPersonaError = this.creditosForm.controls.id_persona.invalid;
  }
  
 
  // ...
  
  showModalEliminar(id: any) {
    Swal.fire({
      title: "¿Estás seguro que deseas eliminar el crédito?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#bf0d0d",
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarcredito(id);
      }
    });
  }
  

  showModalErrorEliminar() {
    Swal.fire({
      title: "Error al eliminar el crédito",
      icon: "error",
    });
  } 
  //aqui hay que corregir porque no hemos hecho eliminar
  eliminarcredito(id: number) {
    this.CreditosService.eliminarcredito(id).subscribe({
      next: (res) => {
        Swal.fire({
          title: "Datos eliminados exitosamente",
          icon: "success",
        }).then(() => {
          this.getAllcreditos();
 
        });
      },
      error: () => {
        this.showModalErrorEliminar();
      },
    });
  }
  
 

  
  openModal(value: string) {
    if (value === 'option1') {
      this.nuevoCurso2();
      (<any>$('#ventanaForm2')).modal('show'); // Open the modal for "Sin crédito"
    } else if (value === 'option3') {
      this.nuevoCurso();
      (<any>$('#ventanaForm')).modal('show'); // Open the modal for "Con crédito"
    }
  }
  
  @ViewChild("filtroSelect") filtroSelect: ElementRef;

  // Restablecer el formulario cuando se cierre el modal
  closeModal() {
    this.creditosForm.reset();
    this.reporteIngresosForm.reset();

    this.nombreUsuarioInput = "";
    this.nombre2UsuarioInput = "";
    this.apellido1UsuarioInput = "";
    this.apellido2UsuarioInput = "";
    this.editandoCreditos = false;
    this.idCreditosEditar = "";

       // Limpiar el valor seleccionado en el filtro
       const filtroSelect = document.getElementById("filtroSelect") as HTMLSelectElement;
       filtroSelect.value = "Seleccionar";
     }

  }
