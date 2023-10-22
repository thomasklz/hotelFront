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

@Component({
  selector: "app-ingredientes",
  templateUrl: "./ingredientes.component.html",

  styleUrls: ["./ingredientes.component.scss"],
})
export class IngredientesComponent implements OnInit {
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
    private route: ActivatedRoute
    
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
  
 

 

  buscarIngredientePorId() { 
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
      this.buscarDescripcionporId();
    },
    error: (err) => {
      this.showModalErrorsindatos();
    },
  });
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
  
  updateFechaId(event: any) {
    const fecha = event.target.value;
    const fechaSeleccionado = this.fechass.find((menu) => menu.fecha === fecha);
  
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
  
  
  updatePlatoIdddddddddddddddddddddddddddddd(event: any) {
    const descripcion = event.target.value;
    const platoSeleccionado = this.platosss.find(
      (plato) => plato.descripcion === descripcion
    );
    this.platoSeleccionado = platoSeleccionado || {
      id: null,
      descripcion: descripcion,
    };
    this.ingredientesForm.get("id_plato")?.setValue(this.platoSeleccionado.id);
  } 
  updatePlatoIdwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww(event: any) {
    const descripcion = event.target.value;
    const platoSeleccionado = this.platosss.find(
      (plato) => plato.descripcion === descripcion
    );
    this.platoSeleccionado = platoSeleccionado || {
      id: null,
      descripcion: descripcion,
    };
    this.ingredientesForm.get("id_plato")?.setValue(this.platoSeleccionado.id);
  
    console.log("ID de plato seleccionado:", this.platoSeleccionado.id);
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
    this.IngredientesService.deleteingrediente(id).subscribe({
      next: (res) => {
        Swal.fire({
          title: "Datos eliminados exitosamente",
          icon: "success",
        }).then(() => {
          //      this.getAllingredientes();
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

  
}
