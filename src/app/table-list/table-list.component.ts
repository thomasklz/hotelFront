 import { Component, OnInit, ViewChild ,ElementRef, NgZone, ChangeDetectorRef} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
 import { MenuService } from 'app/servicios/menu.service';
import swal from 'sweetalert';
import swal2 from 'sweetalert';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {Observable, Observer} from 'rxjs';
import { CreditosService } from 'app/servicios/creditos.service';
import { UsuarioService } from 'app/servicios/usuario.service';
import { IngredientesService } from 'app/servicios/ingredientes.service';



export interface ExampleTab {
  label: string;
  content: string;
}





@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {
   asyncTabs: Observable<ExampleTab[]>;

  displayedColumns: string[] = ['seleccionar', 'nombre', 'precio', 'cantidad'];
  dataSource = new MatTableDataSource<any>();
  dataSourceCredito = new MatTableDataSource<any>();
  dataSourceUsuario = new MatTableDataSource<any>();
  dataSourcedescripcionplatos= new MatTableDataSource<any>();
  dataSourceUsuarioCedula= new MatTableDataSource<any>();
  platosFiltrados: any[] = []; // Variable para almacenar platos filtrados

  @ViewChild(MatPaginator) paginator: MatPaginator;

  filtro: string = '';
  total: number = 0;
  pageSize: number = 5;
  pageIndex: number = 0;

  constructor(
    private http: HttpClient, private MenuService: MenuService, private router: Router,  private formBuilder: FormBuilder,
    private CreditosService: CreditosService, private zone: NgZone, private changeDetector: ChangeDetectorRef, private UsuarioService: UsuarioService,
    private IngredientesService: IngredientesService,
    
  ) {
     this.getAllpersonas();
    this.getAllcreditos();
    this.getAllplato();
    
  }

  ngOnInit() {
    this.idIngreso = 1;
  console.log(this.idIngreso);
    console.log("Valor de ingredientId:", this.ingredientId);

    this.getAllplato();
    this.loadAsyncTabs();
    this.getAllcreditos();
    this.getAlldescripcionplatos();
    this.getAllpersonascedula();
     this.initializePersonaForm();

    
    this.creditosForm = this.formBuilder.group({
     
      id_persona: new FormControl("", [Validators.required,Validators.maxLength(1),]),
      precio: new FormControl("", [Validators.required]),
      id_plato: new FormControl("", [Validators.required]),
      cantidad: new FormControl("", [Validators.required]),
      id_ingreso: new FormControl(1),
      pagado: new FormControl(""),
      nombreUsuarioInput: new FormControl(""),
      nombre2UsuarioInput: new FormControl(""),
      apellido1UsuarioInput: new FormControl(""),
      apellido2UsuarioInput: new FormControl(""),

    });


    this.reporteIngresosForm = this.formBuilder.group({
       
      id_plato: new FormControl("", [Validators.required,]),
      cantidad: new FormControl("", [  Validators.required ]),
     
      id_ingreso: new FormControl(2),     
    });

    this.inputDatalist.nativeElement.addEventListener("change", () => {
      this.onDescriptionSelected();
    });


    this.personaForm = this.formBuilder.group({
      Nombre1: ['', Validators.required],
      Nombre2: ['', Validators.required],
      Apellido1: ['', Validators.required],
      Apellido2: ['', Validators.required],
      EmailInstitucional: ['', Validators.required],
      TelefonoC: ['', Validators.required],
      Identificacion: ['', Validators.required],
      contrasena: [''],
      id_tipousuario: [''],
    });
      
  
  }

  
  loadAsyncTabs() {
    this.asyncTabs = new Observable((observer: Observer<ExampleTab[]>) => {
      observer.next([
        { label: 'Con créditos', content: 'Content 1' },
        { label: 'Sin Créditos', content: 'Content 2' },
      ]);
    });
  }
  

 
  
  platoSeleccionadov2: any = {};

  getAllplato() {
    this.MenuService.mostrartodoslosplatosMenu().subscribe({
      next: (res) => {
        this.dataSource.data = res.platos.map(plato => {
          return {
            id:plato.id,
            nombre: plato.descripcion,
            precio: plato.precio,
            cantidad2:plato.cantidad,
            cantidad: 0,
            selected: false
          };
        });
        this.platosFiltrados = this.dataSource.data; // Inicializa los platos filtrados
        this.updateTotal();
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        console.error("Error en la carga de datos", err);
      }
    });
  }

  
  // Asegúrate de que platoSeleccionado sea una lista
platosSeleccionados: any[] = [];

updateTotal() {
  // Calcular el total de los platos seleccionados
  this.total = this.platosFiltrados
    .filter(plato => plato.selected)
    .reduce((total, plato) => total + (plato.cantidad * plato.precio), 0);

  // Obtener todos los platos seleccionados
  this.platosSeleccionados = this.platosFiltrados.filter(plato => plato.selected);

  // Verificar si se encontraron platos seleccionados
  if (this.platosSeleccionados.length > 0) {
    console.log("Platos seleccionados:", this.platosSeleccionados);
  } else {
    console.log("Ningún plato seleccionado");
  }

  // Actualizar los valores en el formulario después de cada cambio
  this.updateFormValues();
}


updateFormValues() {
  // Actualizar los valores de platos seleccionados en el formulario
  this.creditosForm.patchValue({
    id_plato: this.platosSeleccionados.map(plato => plato.id),
    precio: this.platosSeleccionados.map(plato => plato.precio),
    cantidad: this.platosSeleccionados.map(plato => plato.cantidad)
  });
}



platos: any[] = []; // Aquí defines la propiedad platos como un array vacío o según tu tipo de datos
 


filtrarPlatos() {
  // Convertir el texto de búsqueda y el nombre de los platos a minúsculas
  const textoBusqueda = this.filtro.toLowerCase();
  this.platosFiltrados = this.dataSource.data.filter(plato => {
    // Convertir el nombre del plato a minúsculas y eliminar espacios en blanco alrededor
    const nombrePlato = plato.nombre.toLowerCase().trim();
    // Verificar si el nombre del plato contiene el texto de búsqueda
    return nombrePlato.includes(textoBusqueda);
  });
}

  

  prevPage() {
    if (this.pageIndex > 0) {
      this.pageIndex--;
    }
  }

  nextPage() {
    const maxPageIndex = Math.max(0, Math.ceil(this.platosFiltrados.length / this.pageSize) - 1);
    if (this.pageIndex < maxPageIndex) {
      this.pageIndex++;
    }
  }

  maxPageIndex(): number {
    return Math.max(0, Math.ceil(this.platosFiltrados.length / this.pageSize) - 1);
  }














  //CREDITOSSSSSSSSSSSSSS-----------------------------------


  @ViewChild("inputDatalist") inputDatalist: ElementRef;
 
  selected = 'option2';
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
 
  creditosForm!: FormGroup;
  reporteIngresosForm!: FormGroup;

  personaForm!: FormGroup;


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




  idIngreso: number = 1;
  //cargar los datos de la seleccion de la tabla  en la modal


  initializePersonaForm() {
    this.personaForm = this.formBuilder.group({
      Nombre1: ['', Validators.required],
      Nombre2: ['', Validators.required],
      Apellido1: ['', Validators.required],
      Apellido2: ['', Validators.required],
      EmailInstitucional: ['', Validators.required],
      TelefonoC: ['', Validators.required],
      Identificacion: ['', Validators.required],
      contrasena: [''],
      id_tipousuario: [''],
    });
  }

  BuscarCedula() {
    const identificacion = this.usuarioSeleccionado.Identificacion;
    
    if (identificacion) {
      this.UsuarioService.cedula(identificacion).subscribe(
        (result: any) => {
          console.log("Respuesta del servicio:", result);
          console.log("Contenido de result.data:", result.data);
  
          if (result.data && result.data.Identificacion) {
            // Verificar si this.personaForm está definido
            if (this.personaForm) {
              console.log("PersonaForm está definido.");
              // Obtener el control de cada campo en personaForm
              const formControls = this.personaForm?.controls;
  
              // Verificar si formControls está definido antes de acceder a sus propiedades
              if (formControls) {
                console.log("Respuesta del uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu:");
                // Asignar los datos obtenidos del servicio a los controles individuales de personaForm
                formControls['Nombre1'].setValue(result.data.Nombre1 || '');
                formControls['Nombre2'].setValue(result.data.Nombre2 || '');
                formControls['Apellido1'].setValue(result.data.Apellido1 || '');
                formControls['Apellido2'].setValue(result.data.Apellido2 || '');
                formControls['EmailInstitucional'].setValue(result.data.EmailInstitucional || '');
                formControls['TelefonoC'].setValue(result.data.TelefonoC || '');
                formControls['Identificacion'].setValue(result.data.Identificacion || '');

               
              // Agregar la contraseña
              const identificacion = formControls['Identificacion'].value;
              const contrasena = identificacion + 'ESPAM';
              formControls['contrasena'].setValue(contrasena);

              // Agregar el id_tipousuario
              formControls['id_tipousuario'].setValue(2);

              // Llamar a la función para crear la persona del cliente
              this.crearPersonaCliente();
             

              this.getAllpersonascedula();
              }
            } else {
              console.log("PersonaForm no está definido.");
            }
          } else {
            this.showModalErrorCI();   
          }
        },
        (error) => {
          console.log("Error al obtener los datos", error);
          
          if (error.status === 404) {
            this.showModalErrorCI();
          }
        }
      );
    } else {
      this.showModalErrorCInull();
    }
  }

  crearPersonaCliente() {
    // Verificar si el formulario es válido
    if (this.personaForm.valid) {
      console.log("El formulario es válido, agregando persona...");
  
      // Llamar al servicio para crear la persona
      this.UsuarioService.crearPersonaCliente(this.personaForm.value).subscribe(
        (result: any) => {
          console.log(result);
          this.showModal();
          this.getAllpersonascedula();
          this.getAllpersonas(); // Actualizar la tabla después de agregar un crédito
  this.onPersonaClick();
          this.personaForm.reset(); // Restablecer los valores del formulario
        },
        (error) => {
          console.log(error);
  
          // Verificar si el error es debido a que ya existe un dato igual
          if (error.status === 409 && error.error && error.error.message === 'El email ya existe') {
            this.showModalDuplicado();
          } else {
            this.showModalError();
          }
        }
      );
    } else {
      console.log("El formulario no es válido. Errores:", this.personaForm.errors);
      // Manejar errores de validación del formulario
      this.showModalError();
    }
  }
  



  showModalErrorCInull() {
    swal({
      title: 'La identificación no tiene un valor',
      icon: 'warning',
    });
  }
  
  showModalDuplicado() {
    swal({
      title: 'Ya existe ese número de cédula registrado',
      icon: 'warning',
    });
  }

  showModalErrorCI() {
    swal({
      title: 'No existe ese número de cédula',
      icon: 'error',
    });
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

/*   getAllplatos() {
    this.MenuService.gettplatoselect().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.plato);
        this.platosss = res.plato;
      },
      error: (err) => {
        // alert("Error en la carga de datos");
      },
    });
  } */

  getAlldescripcionplatos() {
    this.MenuService.mostrarplatocredito().subscribe({
      next: (res) => {
        this.dataSourcedescripcionplatos = new MatTableDataSource(res.platos);
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
        this.dataSourceUsuario = new MatTableDataSource(res.usuarios);
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
        this.dataSourceUsuarioCedula = new MatTableDataSource(res.usuarios);
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
        this.dataSourceCredito = new MatTableDataSource(res.creditos);
        this.creditosss = res.creditos;
        this.creditosssOriginal = [...res.creditos]; 
       },
      error: (err) => {
        //alert("Error en la carga de datos");
      },
    });
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
          this.id_persona=result.id;

          this.changeDetector.detectChanges(); // Forzar la actualización de la vista
          console.log("Nombre del usuario actualizado:", result.Nombre1);
          console.log("Nombre del usuario actualizado:", result.Nombre2);
          console.log("idddddddddddddddddddddddddddd:", this.id_persona);
// Asignar el valor de id_persona al formulario
this.creditosForm.get("id_persona")?.setValue(this.id_persona);

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
    if (this.platosSeleccionados.length > 0) {
       const idIngreso = 2; // Obtener el valor del campo id_ingreso

      const data = {
        platos: this.platosSeleccionados.map(plato => ({
          cantidad: plato.cantidad,
            id_plato: plato.id,
          id_ingreso: idIngreso // Incluir el valor de id_ingreso aquí
        }))
      };
      console.log("Datos a enviar:", data); // Para depuración
      this.CreditosService.crearreporteIngresos(data).subscribe(
        (result: any) => {
          this.resetFormulario();
          this.showModal();
          // Manejar respuesta exitosa
          console.log("Respuesta del servidor:", result); // Para depuración
        },
        (error) => {
          console.error("Error al guardar crédito:", error);
          this.showModalError();
          if (error.status === 400) {
            console.error("Campos requeridos faltantes:", error.error); // Detalles del error
          } else {
            this.showModalError();
          }
        }
      );
    } else {
      console.error("No se han seleccionado platos."); // Manejar caso cuando no hay platos seleccionados
    }
  }


 



  

  addCredito() {
    if (this.platosSeleccionados.length > 0) {
      const idPersona = this.creditosForm.get('id_persona').value;
      const idIngreso = 1; // Obtener el valor del campo id_ingreso
  
      const data = {
        platos: this.platosSeleccionados.map(plato => ({
          cantidad: plato.cantidad,
          precio: plato.precio,
          id_persona: idPersona,
          id_plato: plato.id,
          id_ingreso: idIngreso // Incluir el valor de id_ingreso aquí
        }))
      };
      console.log("Datos a enviar:", data); // Para depuración
      this.CreditosService.crearcredito(data).subscribe(
        (result: any) => {
          this.resetFormulario();
          this.showModal();
          // Manejar respuesta exitosa
          console.log("Respuesta del servidor:", result); // Para depuración
        },
        (error) => {
          console.error("Error al guardar crédito:", error);
          if (error.status === 400) {
            // Suponiendo que el error específico viene en error.error.message
            this.showModalError2(error.error.message);
          } else {
            this.showModalError2("Ocurrió un error inesperado. Inténtalo de nuevo más tarde.");
          }
        }
      );
    } else {
      console.error("No se han seleccionado platos."); // Manejar caso cuando no hay platos seleccionados
    }
  }
  
  
  // Modal de No agg error de Notificacion
showModalError2(errorMessage) {
  swal({
    title: "Error de registro de datos",
    text: errorMessage, // Mostrar el mensaje de error específico
    icon: "error",
  });
}

  
  
  limpiarCantidades() {
    this.platosFiltrados.forEach(plato => {
      plato.cantidad = 0;
    });
  }
  
 
  // Función para restablecer el formulario
  resetFormulario() {
    this.platosSeleccionados = [];
  this.creditosForm.reset(); // Restablecer los valores del formulario
  this.reporteIngresosForm.reset(); // Restablecer los valores del formulario
  this.limpiarCantidades(); // Limpiar las cantidades de los platos seleccionados
 
  
  this.usuarioSeleccionado = { id: null, Identificacion: "" };
  
 
  // Limpiar campos adicionales
  this.nombreUsuarioInput = "";
  
  
  this.filtro = ""; // Limpiar el filtro de búsqueda de platos
  this.total = 0; // Restablecer el total a cero

    
    this.nombreUsuarioInput = "";
    this.nombre2UsuarioInput = "";
    this.apellido1UsuarioInput = "";
    this.apellido2UsuarioInput = "";
    this.creditosForm.reset(); // Restablecer los valores del formulario
    const filtroSelect = document.getElementById("filtroSelect") as HTMLSelectElement;
    if (filtroSelect) {
      filtroSelect.value = "Seleccionar";
    }
    this.platosFiltrados.forEach(plato => {
      plato.selected = false;
    });
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
  

 
 
  
  
 
  



}
