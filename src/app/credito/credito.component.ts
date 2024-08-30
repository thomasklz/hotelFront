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











 import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
 
import { NavigationEnd } from '@angular/router';

 




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
  selector: "app-credito",
  templateUrl: "./credito.component.html",
  styleUrls: ["./credito.component.scss"],
})
export class CreditoComponent implements OnInit {
  @ViewChild("inputDatalist") inputDatalist: ElementRef;
  selected = 'option2';
  dataSource = new MatTableDataSource<any>();
  
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
  creditosFormversion2!: FormGroup;
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
    location: Location, private element: ElementRef,
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
     this.getAllpersonas();
    this.getAllcreditos();
    this.currentRoute = this.router.url;
    this.getAllusuario();
    this.location = location;
   
  this.usuario= localStorage.getItem('usuario');
  this.id= localStorage.getItem('idPersona'); 
  }





  fecha: Date = new Date();




  nombrePersonaABuscar: string = '';


  idIngreso: number = 1;
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
    this.idIngreso = 1;
  console.log(this.idIngreso);
    console.log("Valor de ingredientId:", this.ingredientId);

    this.getAllcreditos();
   
  
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

    this.creditosFormversion2 = this.formBuilder.group({
      pagado: [false, Validators.required],
      funcion: ['']
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



  descargarPDF() {
    const rows = [];
    let previousPersona = '';
    let previousFecha = '';
    this.creditosss.forEach(credito => {
        let firstPersonRow = true;
        credito.creditosPorFecha.forEach(creditoPorFecha => {
            creditoPorFecha.creditos.forEach(creditoDetalle => {
                const persona = (credito.persona.Apellido1 ? `${credito.persona.Apellido1} ${credito.persona.Apellido2} ${credito.persona.Nombre1} ${credito.persona.Nombre2}` : '');
                const fecha = creditoPorFecha.fecha || '';
                const creditoARow = (previousPersona === persona && previousFecha === fecha) ? { text: '', rowSpan: 0 } : {
                    text: persona,
                    rowSpan: creditoPorFecha.creditos.length,
                    alignment: 'left'
                };
                const fechaRow = (previousPersona === persona && previousFecha === fecha) ? { text: '', rowSpan: 0 } : {
                    text: fecha,
                    rowSpan: creditoPorFecha.creditos.length,
                    alignment: 'left'
                };
                const row = [
                    creditoARow,
                    fechaRow,
                    creditoDetalle.plato.descripcion || '',
                    creditoDetalle.precio || '',
                    creditoDetalle.cantidad || '',
                    creditoDetalle.precio_final || ''
                ];
                rows.push(row);
                firstPersonRow = false;
                previousPersona = persona;
                previousFecha = fecha;
            });
        });
    });

    const anchoPagina = 595.28;
    let columnWidths = [100, 70, 120, 40, 50, 75];
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
                            ['Crédito a', 'Fecha', 'Plato', 'Precio', 'Cantidad', 'Precio Final'].map((cell, index) => ({
                                text: cell,
                                bold: true,
                                fillColor: '#D3D3D3',
                            })),
                            ...rows
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
    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Informe de Créditos');

    // Estilos
    const headerStyle = {
        font: { bold: true, color: { argb: '000000' } }, // Letra en negrita y color negro
        alignment: { vertical: 'middle', horizontal: 'center' },
        border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD3D3D3' } } // Fondo gris (plomo)
    };

    const cellStyle = {
        alignment: { vertical: 'middle', horizontal: 'left' },
        border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    };

    // Organizar créditos por persona
    const creditosPorPersona = {};

    this.creditosss.forEach(credito => {
        const persona = `${credito.persona.Apellido1} ${credito.persona.Apellido2} ${credito.persona.Nombre1} ${credito.persona.Nombre2}`;

        credito.creditosPorFecha.forEach(creditoPorFecha => {
            const fecha = creditoPorFecha.fecha;

            creditoPorFecha.creditos.forEach(creditoDetalle => {
                const plato = creditoDetalle.plato.descripcion;

                const key = `${persona}`;

                if (!creditosPorPersona[key]) {
                    creditosPorPersona[key] = {
                        persona,
                        detalles: [],
                        totalPagar: 0
                    };
                }

                creditosPorPersona[key].detalles.push({
                    fecha,
                    plato,
                    precio: creditoDetalle.precio,
                    cantidad: creditoDetalle.cantidad,
                    precio_final: creditoDetalle.precio_final
                });

                creditosPorPersona[key].totalPagar += creditoDetalle.precio_final;
            });
        });
    });

    // Agregar encabezado
    worksheet.addRow(['Crédito a', 'Fecha', 'Plato', 'Precio', 'Cantidad', 'Precio total', 'Total a Pagar']);
    worksheet.getRow(1).eachCell(cell => {
        Object.assign(cell, headerStyle); // Aplicar estilo al encabezado
    });

    // Agregar datos a la hoja de cálculo
    Object.keys(creditosPorPersona).forEach(key => {
        const creditoDetalle = creditosPorPersona[key];
        const persona = creditoDetalle.persona;

        const rowStart = worksheet.rowCount + 1;

        // Crédito a
        worksheet.mergeCells(`A${rowStart}:A${rowStart + creditoDetalle.detalles.length - 1}`);
        worksheet.getCell(`A${rowStart}`).value = persona;

        creditoDetalle.detalles.forEach((detalle, index) => {
            // Detalles del Crédito
            const row = worksheet.getRow(rowStart + index);
            row.getCell(2).value = detalle.fecha;
            row.getCell(3).value = detalle.plato;
            row.getCell(4).value = detalle.precio;
            row.getCell(5).value = detalle.cantidad;
            row.getCell(6).value = detalle.precio_final;

            row.eachCell(cell => {
                Object.assign(cell, cellStyle); // Aplicar estilo a los datos
            });
        });

        // Total a Pagar
        worksheet.mergeCells(`G${rowStart}:G${rowStart + creditoDetalle.detalles.length - 1}`);
        worksheet.getCell(`G${rowStart}`).value = creditoDetalle.totalPagar;

        // Aplicar estilos
        for (let i = rowStart; i < rowStart + creditoDetalle.detalles.length; i++) {
            worksheet.getRow(i).eachCell(cell => {
                cell.border = cellStyle.border;
                cell.alignment = cellStyle.alignment;
            });
        }
    });

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
        saveAs(new Blob([buffer]), 'Informe de Créditos del Restaurante.xlsx');
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
  
   

//----------------filtro
nombreFiltro: string = '';
 fechaFiltro: string = '';
filtroSeleccionado: string = 'nombre';
 
 

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

  //registrar el id persona el nuevo que se selecciona y enviarlo a la data
  getId_persona() {
    this.http
      .get("http://localhost:3000/api/crearPersona/?=" + this.id_persona)
      .subscribe((result: any) => {
        this.personasss = result.creditos;
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

 

  filtrarPorNombre(event: string) {
    this.getAllcreditos();
  }
  
  getAllcreditos() {
    this.CreditosService.getcreditos().subscribe({
      next: (res) => {
        this.creditosss = res.filter(credito => {
          const persona = credito.persona;
          const fullName = `${persona.Apellido1} ${persona.Apellido2} ${persona.Nombre1} ${persona.Nombre2}`;
          return fullName.toLowerCase().includes(this.nombrePersonaABuscar.toLowerCase());
        });
        this.dataSource = new MatTableDataSource<any>(this.creditosss);
      },
      error: (err) => {
        console.error('Error en la carga de datos:', err);
      }
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
    
    this.creditosForm.get("id_persona")?.setValue(null);

    // Reset the selectedOption and clear the form field value
    
    
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

  
  
  selectedCredito: any; // Declara una variable para almacenar el crédito seleccionado
  @ViewChild('ventanaForm') modalElement: ElementRef;

  editarCreditos(credito: any) {
    this.selectedCredito = credito;
    console.log(this.selectedCredito); // Verifica si los datos se asignan correctamente
    this.modalElement.nativeElement.modal('show');
  }
  
  modificarcredito() {
    if (this.creditosFormversion2.invalid) {
      this.showPagadoError = true;
      return;
    }

    const id_persona = this.selectedCredito.persona.id; // Obtener el id de la persona seleccionada
    const pagado = this.creditosFormversion2.value.pagado;

    // Llamar al servicio para modificar el crédito
    this.CreditosService.modificarCredito(id_persona, pagado).subscribe({
      next: (res) => {
        // Actualizar la interfaz o realizar cualquier acción adicional necesaria
        console.log('Crédito modificado exitosamente');
        this.showModalEdit();
        this.getAllcreditos();
      },
      error: (err) => {
        console.error('Error al modificar el crédito:', err);
      }
    });

    // Cerrar el modal después de modificar el crédito
    this.closeModal();
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











     
//-------------------------------------------PER
location: Location;
   usuario:any;
 



   usuariosss: any[] = [];
    private listTitles: any[];
       mobile_menu_visible: any = 0;
    private toggleButton: any;
    private sidebarVisible: boolean;
    idPersona: number;


    id:any;


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

 
 

  navigateToRoute(path: string) {
    this.router.navigate([path]);
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
