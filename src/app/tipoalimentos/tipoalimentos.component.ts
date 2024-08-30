import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MenuService } from 'app/servicios/menu.service';
import { ChangeDetectorRef } from '@angular/core';

import swal from 'sweetalert';
import swal2 from 'sweetalert';

import Swal from 'sweetalert2';
import { RecetarioService } from 'app/servicios/recetario.service';






import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { CreditosService } from 'app/servicios/creditos.service';
  import { NavigationEnd } from '@angular/router';

import { ElementRef, ViewChild } from "@angular/core";
import * as XLSX from 'xlsx';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { UsuarioService } from 'app/servicios/usuario.service';
import { ImageService } from 'app/servicios/image.service';
import { saveAs } from 'file-saver';





declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
 
  { path: '/editarperfilcajero', title: ' Configuración y privacidad',  icon:'settings', class: '' },

  
 
   { path: '/login', title: ' Cerrar sesión',  icon:'exit_to_app', class: '' },
     
  
  
];
@Component({
  selector: 'app-tipoalimentos',
  templateUrl: './tipoalimentos.component.html',
  styleUrls: ['./tipoalimentos.component.scss']
})
export class TipoalimentosComponent implements OnInit {

  dataSource = new MatTableDataSource<any>();
   estado: boolean = true;
  descripcion: string = '';
  id_plato: string = '';
  tipomenusss: any[] = [];
  platosss: any[] = [];



  menusss: any[] = [];
  tituloForm;
  menuForm!: FormGroup;
  editandoPlato: boolean = false; // Variable para indicar si se está editando un plato existente
  idPlatoEditar: string = ''; // Variable para almacenar el ID del plato en caso de edición



  showId_cantidadplatoError = false; //evitando que se muestren los mensajes de campo requerido 
  showId_tipomenuError = false;//evitando que se muestren los mensajes de campo requerido
  showFechaError = false; //evitando que se muestren los mensajes de campo requerido 
  showHabilitadoError = false;//evitando que se muestren los mensajes de campo requerido 
  showDiasError= false;
   showPrecioError= false;
  showMoreOptions: boolean = false;
  selectedOption: any = null;
  menusssOriginal: any[] = [];

  toggleShowMoreOptions() {
    this.showMoreOptions = !this.showMoreOptions;
  }
   

  getSelectedOptionLabel() {
    return this.selectedOption ? this.selectedOption.descripcion : 'Seleccione  ';
  }


  

 
  constructor(
    private http: HttpClient,
    private MenuService: MenuService,
    private router: Router,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef  ,
    private RecetarioService:RecetarioService,



    location: Location,private imageService:ImageService ,private element: ElementRef,private  CreditosService:CreditosService,   private UsuarioService:UsuarioService

  ) {
    this.getAllplatos();
    this.getAllmenus();
    this.currentRoute = this.router.url;
    this.getAllusuario();
    this.location = location;
   
  this.usuario= localStorage.getItem('usuario');
  this.id= localStorage.getItem('idPersona'); 

  }

  //cargar los datos de la seleccion de la tabla  en la modal

  ngOnInit() {
    this.getAllusuario();
    setInterval(() => {
      this.getAllusuario();
      
    }, 5000);
    this.getAllcreditos();
    this.fecha = new Date();



    this.listTitles = ROUTES.filter(listTitle => listTitle);
    const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
    this.router.events.subscribe((event) => {
      this.sidebarClose();
       var $layer: any = document.getElementsByClassName('close-layer')[0];
       if ($layer) {
         $layer.remove();
         this.mobile_menu_visible = 0;
       }
   });




  

    ///
    this.menuItems = ROUTES.filter(menuItem => menuItem);

      
    this.router.events.subscribe(event => {
          
     
      if (event instanceof NavigationEnd) {
              
             
      
       
      this.currentRoute = this.router.url;
            }
          });
    //-------
    this.obtenerListaplatosconIngrediente();

    this.getAllmenus();
  this.loadPageData();
  this.aplicarFiltros();
    this.menuForm = this.formBuilder.group({

      id_plato: new FormControl("", [Validators.required, Validators.maxLength(1)]),
     
      habilitado: new FormControl("", [Validators.required, Validators.minLength(1)]),
      fecha: new FormControl("", [Validators.required, Validators.minLength(1)]),
      
      cantidad: new FormControl("", [
        Validators.required,
        Validators.pattern(/^[0-9]+$/), // Acepta solo números
        Validators.minLength(1),
      ]),
     });


    this.menuForm.get('cantidad')?.valueChanges.subscribe(() => {
      this.showId_cantidadplatoError = this.menuForm.get('cantidad')?.invalid;
    });
    this.menuForm.get('habilitado')?.setValue('1');

    // Suscríbete a los cambios en el control 'habilitado' para detectar cuando se selecciona "No"
    this.menuForm.get('habilitado')?.valueChanges.subscribe((value) => {
      if (value === '0') {
        // Cambia el valor del control 'habilitado' a 0 si se selecciona "No"
        this.menuForm.get('habilitado')?.setValue('0');
      }
    });
  }



 
  fecha: Date = new Date();
 


  listaPlatos: any[] = [];


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

  get pagedMenus(): any[] {
    return this.menusss.slice(this.startIndex, this.endIndex + 1);
  }

  // ... otras funciones del componente
 
  loadPageData() {
    // Lógica para cargar datos de la página actual (no es necesario pasar parámetros a la API)
    this.MenuService.gettMenu().subscribe({
      next: (res) => {
        this.menusss = res.menu;
        this.totalItems = res.menu.length;  // Actualizar el total de elementos
      },
      error: (err) => {
        console.error(err);
        // Manejo de errores si la llamada a la API falla
      },
    });
  }

  onPageChange(event: number) {
    this.currentPage = event;
  }
  //Modal de Agregar Notificacion
  title = 'sweetAlert';
  showModal() {
    swal2({
      title: 'Datos registrado exitosamente',
      icon: "success",
    });
  }

  //Modal de No agg error de Notificacion

  showModalError() {
    swal({

      title: 'Error de registro de datos ',
      icon: "error",

    });
  }

  showModalErrorr() {
    swal({

      title: 'Error de registro de datos, ya existe un menú para este plato en la misma fecha  ',
      icon: "error",

    });
  }

  //Modal de Modificacion Notificacion

  showModalEdit() {
    swal2({
      title: 'Datos modificado exitosamente',
      icon: "success",
    });
  }

  //Modal de  error de Modificacion Notificacion

  showModalErrorEdit() {
    swal({
      title: 'Error de modificación de datos ',
      icon: "error",
    });
  }

  platoSeleccionado: { id: number | null; descripcion: string } = {
    id: null,
    descripcion: "",
  };
  
  updatePlatoId(event: any) {
    const descripcion = event.target.value;
    const platoSeleccionado = this.listaPlatos.find(
      (plato) => plato.descripcion === descripcion
    );
    this.platoSeleccionado = platoSeleccionado || {
      id: null,
      descripcion: descripcion,
    };
    this.menuForm.get("id_plato")?.setValue(this.platoSeleccionado.id);
  }

  
  
  

 //registrar el id plato el nuevo que se selecciona y enviarlo a la data
 getId_plato() {
  this.http
    .get("http://localhost:3000/api/crearplato/?=" + this.id_plato)
    .subscribe((result: any) => {
      this.platosss = result.menus;
    });
}
  //obtener todos los tipos menu desayuno almuerzo y merienda 

  getAlltipomenu() {
    this.MenuService.gettipomenu().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.tipo_menus);
        this.tipomenusss = res.tipo_menus;
      },
      error: (err) => {
        // alert("Error en la carga de datos");
      },
    });
  }


//----------------filtro
  nombreplatoFiltro: string = '';
  filtroSeleccionado: string = 'nombre'; 
  fechaFiltro: string = '';

  // ...
aplicarFiltros() {
  if (this.filtroSeleccionado === 'nombre') {
    // Aplica el filtro por nombre y restablece el filtro de fecha
    this.fechaFiltro = '';
  } else if (this.filtroSeleccionado === 'fecha') {
    // Si se selecciona el filtro de fecha, vacía el filtro de nombre
    this.nombreplatoFiltro = '';
  }

  this.menusss = this.menusssOriginal.filter(item => {
    return !this.nombreplatoFiltro || item.plato.descripcion.toLowerCase().includes(this.nombreplatoFiltro.toLowerCase());
  });
}

aplicarFiltrosfecha() {
  if (this.filtroSeleccionado === 'fecha') {
    // Aplica el filtro por fecha y restablece el filtro de nombre
    this.nombreplatoFiltro = '';
  } else if (this.filtroSeleccionado === 'nombre') {
    // Si se selecciona el filtro por nombre, vacía el filtro de fecha
    this.fechaFiltro = '';
  }

  this.menusss = this.menusssOriginal.filter(item => {
    return !this.fechaFiltro || item.fecha.includes(this.fechaFiltro);
  });
}
// ...

  //obtener todos los menus 
  getAllmenus() {
    this.MenuService.gettMenu().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.menu);
        this.menusss = res.menu;
        this.menusssOriginal = [...res.menu]; 
      },
      error: (err) => {
        //alert("Error en la carga de datos");
      },
    });
  }
  //obtener todos los platos para utlizarlo en el selection
  getAllplatos() {
    this.MenuService.obtenerplatosdeproductos().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.platosUnicos);
        this.platosss = res.platosUnicos;
      },
      error: (err) => {
        // alert("Error en la carga de datos");
      },
    });
  }

/*   getAllplatos() {
    this.MenuService.obtenerplatosdeproductos().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.productosplatos);
        this.platosss = res.productosplatos;
        console.log(this.platosss);
      },
      error: (err) => {
        // alert("Error en la carga de datos");
      },
    });
  } */
  //Para el registro de plato usando modal
  nuevoCurso() {
    this.tituloForm = 'Registros de menús diarios';
    this.menuForm.reset();
    this.editandoPlato = false;
    this.idPlatoEditar = '';
  
    this.selectedOption = null;
    this.menuForm.get('id_plato')?.setValue(null);
    this.showId_tipomenuError = false;
    
    this.showId_cantidadplatoError = false;
    this.showFechaError = false;
    this.showHabilitadoError = false;
    this.showDiasError = false;
    this.showPrecioError = false;
  
    // Establecer el valor del radio button predeterminado
    this.menuForm.get('habilitado')?.setValue('1'); // Puedes ajustar esto según tu lógica
  }
  

  editarMenu(item: any) {
    this.tituloForm = 'Editar menús diarios';
    this.menuForm.patchValue({
      id_plato: item.plato.id,
      cantidad: item.cantidad,
      habilitado: item.habilitado,
      fecha:item.fecha
     });
  
    // Selecciona automáticamente el radio button correspondiente
    const radioValue = +item.habilitado === 1 ? '1' : '0';
    this.menuForm.get('habilitado')?.setValue(radioValue);
  
    // Actualiza la descripción del plato seleccionado
    this.platoSeleccionado = {
      id: item.plato.id,
      descripcion: item.plato.descripcion
    };
  
    this.editandoPlato = true;
    this.idPlatoEditar = item.id;
  
    // Establecer variables a false al editar
    this.showId_cantidadplatoError = false;
    this.showId_tipomenuError = false;
    this.showFechaError = false;
    this.showHabilitadoError = false;
  }
  




  // Registro de Plato...
 
 
  addMenu() {
    const idPlato = this.menuForm.get('id_plato').value;
    if (this.menuForm.valid) {
      

      const datos = {
        id_plato:idPlato,
        cantidad: this.menuForm.value.cantidad,
        habilitado: this.menuForm.value.habilitado,
        fecha: this.menuForm.value.fecha
      };

      if (!this.editandoPlato) {
        this.MenuService.guardarMenu(datos).subscribe(
          (platos) => {
            console.log(platos);
            this.showModal();
            this.getAllmenus(); // Actualizar la tabla después de agregar/editar un menú
          this.loadPageData();
          this.menuForm.reset();// Restablecer los valores del formulario
          },
          (error) => {
            console.error("Error al guardar menú:", error);
            if (error.status === 400 && error.error && error.error.message === 'Ya existe un menú para este plato en la misma fecha') {
              this.showModalErrorrq(error.error.message); // Mostrar mensaje de error específico
            } else if (error.status === 400 && error.error && error.error.message) {
              const errorMessage = error.error.message;
              this.showModalErrorrq(errorMessage); // Mostrar mensaje de error del servidor
            } else {
              this.showModalError2(error.error); // Mostrar mensaje de error genérico
            }
          }
        );
      } else {
        // m o d i f i c a r -----------------------------
        this.MenuService.guardarMenu(datos, this.idPlatoEditar).subscribe(
          (plato) => {
            console.log(plato);
            this.showModalEdit();
             this.getAllmenus(); // Actualizar la tabla después de agregar/editar un menú
            this.loadPageData();
            this.menuForm.reset();
           this.loadPageData();
           },
          (error) => {
            console.log(error);
            this.showModalErrorEdit();
          }
        );
      }
    } else {
      this.showId_cantidadplatoError = this.menuForm.controls.cantidad.invalid;
      this.showId_tipomenuError = this.menuForm.controls.id_plato.invalid;
      this.showFechaError = this.menuForm.controls.fecha.invalid;
      this.showHabilitadoError = this.menuForm.controls.habilitado.invalid;
    }
  }



  showModalErrorrq(message: string) {
    swal({
      title: "Error al registrar menú",
      text: message,
      icon: "error",
    });
  }





    
  showModalErrorPlatoExistente() {
    swal({
      title: "Error al registrar menú",
      text: "Este plato ya tiene un menú registrado para la misma fecha.",
      icon: "error",
    });
  }
  

 



  
  showModalError2(error: any) {
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
  

  

  
  

  








 
  
  

 
  showModalEliminar(id: number) {
    Swal.fire({
      title: '¿Estás seguro que deseas eliminar el menú diario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#bf0d0d',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarPlato(id);
        // Actualiza la variable menuList
        this.menusss = this.menusss.filter(menu => menu.id !== id);
        this.totalItems = this.menusss.length;
      }
    });
  }
  

 


  showModalErrorEliminar() {
    Swal.fire({
      title: 'Error al eliminar el plato',
      icon: 'error',
    });
  }
  eliminarPlato(id: number) {
    this.MenuService.deletemenudiario(id).subscribe({
      next: (res) => {
        Swal.fire({
          title: 'Datos eliminados exitosamente',
          icon: 'success',
        }).then(() => {
          this.getAllmenus();
          this.loadPageData(); // Actualizar la tabla y la paginación después de eliminar un menú
          this.cdr.detectChanges(); // Forzar la detección de cambios
        });
      },
      error: () => {
        this.showModalErrorEliminar();
      },
    });
  }

  // Restablecer el formulario cuando se cierre el modal
  closeModal() {
    this.menuForm.reset();
    this.editandoPlato = false;
    this.idPlatoEditar = '';
  }


  //REFA
  location: Location;
  creditosss: any[] = [];
  usuario:any;
  id:any;
   @ViewChild("inputDatalist") inputDatalist: ElementRef;





   usuariosss: any[] = [];
    private listTitles: any[];
       mobile_menu_visible: any = 0;
    private toggleButton: any;
    private sidebarVisible: boolean;
    idPersona: number;



    //obtener el usuario 
    getAllusuario() {
      this.UsuarioService.buscarUsuario(this.id).subscribe({
        next: (res) => {
          this.dataSource = new MatTableDataSource(res.usuario);
          this.usuariosss = res.usuario;
  
        },
        error: (err) => {
          // Maneja el error de carga de datos aquí
        },
      });
    }

  getAllcreditos() {
    this.CreditosService.getReporteUsuario(this.id).subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.creditos);
        this.creditosss = res.creditos;
      },
      error: (err) => {
        //alert("Error en la carga de datos");
      },
    });
  }
  generarPDF() {
    const content = document.getElementById('report-content')!;

    // Creamos una nueva instancia de jsPDF
    const pdf = new jsPDF();

    // Convertimos el contenido del reporte a una imagen
    html2canvas(content).then(canvas => {
      const imgData = canvas.toDataURL('image/png');

      // Agregamos la imagen al PDF
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);

      // Descargamos el PDF
      pdf.save('reporte_usuario.pdf');
    });
  }
  calcularTotal() {
    return this.creditosss
      .filter(item => item.pagado === false)
      .reduce((total, item) => total + item.precio_final, 0);
  }



  showModalcerrar() {
    Swal.fire({
      title: '¿Estás seguro que deseas cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
     
      confirmButtonText: 'Sí, cerrar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#bf0d0d',
      
      
    }).then((result) => {
      if (result.isConfirmed) {
        this.logout();
      }
    });
  }
logout() {
    localStorage.removeItem('idPersona');
    localStorage.removeItem('idUsuario');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }




  //-----------------------

 


  isMaps(path){
    var titlee = this.location.prepareExternalUrl(this.location.path());
    titlee = titlee.slice( 1 );
    if(path == titlee){
        return false;
    }
    else {
        return true;
    }
}

  descargarPDF() {
    const rows = this.creditosss.map((item, index) => [
      index + 1,
      item.plato.descripcion,
      item.precio,
      item.cantidad,
      item.precio_final,
      item.fecha,
    ]);
  
    const anchoPagina = 595.28;
    let columnWidths = [30, 145, 60, 60, 70, 90];
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
              { text: `Total a pagar: ${this.calcularTotal()}`, bold: true, fillColor: '#D3D3D3', border: [true, true, true, true] },
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
          { text: 'INFORME DE CRÉDITOS DEL RESTAURANTE', style: 'header', alignment: 'center' },
          '\n',
          {
            table: {
              headerRows: 1,
              widths: columnWidths,
              body: [
                ['Nº', 'Plato', 'Precio', 'Cantidad', 'Precio final', 'Fecha'].map((cell, index) => ({
                  text: cell,
                  bold: true,
                  fillColor: '#D3D3D3',
                })),
                ...rows.map(row => row.map(cell => ({ text: cell }))),
              ],
            },
          },
          ingredientHeaders // Añadimos los encabezados adicionales aquí
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


 

  navigateToRoute(path: string) {
    this.router.navigate([path]);
  }

  async descargarDatos() {
    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('INFORME DE REPORTE CRÉDITO');
  
    // Agregar encabezados de la tabla
    const headers = [
      'Nº',
      'Plato',
      'Cantidad',
      'Precio',
      'Fecha'
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
    this.creditosss.forEach((item, index) => {
      const rowData = [
        index + 1,
        item.plato.descripcion,
        item.cantidad,
        item.precio,
        item.fecha,
      ];
      worksheet.addRow(rowData);
    });
  
    // Agregar fila del total
    const totalRowData = [
      
      'Total a pagar:',
      this.calcularTotal()
    ];
    worksheet.addRow(totalRowData);
  
    // Establecer estilos para datos
    for (let i = 2; i <= worksheet.lastRow.number; i++) {
      const row = worksheet.getRow(i);
      row.eachCell(cell => {
        cell.font = { bold: i === worksheet.lastRow.number }; // Negrita para la fila del total
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });
    }
  
    // Establecer ancho de columnas
    worksheet.getColumn(1).width = 5; // Set fixed width for "Nº" column
    worksheet.getColumn(2).width = 30; // Set fixed width for "Plato" column
  
    worksheet.columns.forEach((column, index) => {
      if (index > 1) { // Adjust width for other columns
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
    saveAs(new Blob([buffer]), 'INFORME DE REPORTE CRÉDITO.xlsx');
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
  
  
































  menuItems: any[];
  currentRoute: string;
 
  
  
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };

  // Function to check if a route is the current active route
  
 
isActiveRoute(route: string): boolean {
    
    
return this.currentRoute === route;
  }
  



  
  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const body = document.getElementsByTagName('body')[0];
    setTimeout(function(){
        toggleButton.classList.add('toggled');
    }, 500);

    body.classList.add('nav-open');

    this.sidebarVisible = true;
};
sidebarClose() {
    const body = document.getElementsByTagName('body')[0];
    this.toggleButton.classList.remove('toggled');
    this.sidebarVisible = false;
    body.classList.remove('nav-open');
};


  sidebarToggle() {
    // const toggleButton = this.toggleButton;
    // const body = document.getElementsByTagName('body')[0];
    var $toggle = document.getElementsByClassName('navbar-toggler')[0];

    if (this.sidebarVisible === false) {
        this.sidebarOpen();
    } else {
        this.sidebarClose();
    }
    const body = document.getElementsByTagName('body')[0];

    if (this.mobile_menu_visible == 1) {
        // $('html').removeClass('nav-open');
        body.classList.remove('nav-open');
        if ($layer) {
            $layer.remove();
        }
        setTimeout(function() {
            $toggle.classList.remove('toggled');
        }, 400);

        this.mobile_menu_visible = 0;
    } else {
        setTimeout(function() {
            $toggle.classList.add('toggled');
        }, 430);

        var $layer = document.createElement('div');
        $layer.setAttribute('class', 'close-layer');


        if (body.querySelectorAll('.main-panel')) {
            document.getElementsByClassName('main-panel')[0].appendChild($layer);
        }else if (body.classList.contains('off-canvas-sidebar')) {
            document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
        }

        setTimeout(function() {
            $layer.classList.add('visible');
        }, 100);

        $layer.onclick = function() { //asign a function
          body.classList.remove('nav-open');
          this.mobile_menu_visible = 0;
          $layer.classList.remove('visible');
          setTimeout(function() {
              $layer.remove();
              $toggle.classList.remove('toggled');
          }, 400);
        }.bind(this);

        body.classList.add('nav-open');
        this.mobile_menu_visible = 1;

    }
}
}
