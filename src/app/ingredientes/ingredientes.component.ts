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
    this.getAllplatos();
    // this.getAllalimento();
    //this.getAllingredientes();
  }

  //cargar los datos de la seleccion de la tabla  en la modal

  ngOnInit() {
    this.getAllingredientes();
    this.getAllalimentos();
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
      id_alimento: new FormControl("", [
        Validators.required,
        Validators.maxLength(1),
      ]),
    });
  }


  
 /*  buscarIngredientePorId() {
    if (this.ingredientId) {
      this.IngredientesService.getingredienteporid(this.ingredientId).subscribe(
        {
          next: (res: any) => {
            this.ingredientesss = res.ingredientes;

            // Si no hay resultados, vaciar ingredientesss para ocultar la tabla
            if (this.ingredientesss.length === 0) {
              this.ingredientesss = [];

              // Mostrar la modal de errores si no hay resultados
              this.showModalErrorsindatos();
            }
          },
          error: (err) => {
            // Maneja errores de búsqueda, por ejemplo, muestra un mensaje de error al usuario.
            console.error(err);

            // Mostrar la modal de errores en caso de un error
            this.showModalErrorsindatos();
          },
        }
      );
      // Llama a otra función para buscar descripción por ID
      this.buscarDescripcionporId();
    } else {
      // Si el usuario borra el ID de búsqueda, vacía ingredientesss para ocultar la tabla
      this.ingredientesss = [];
    }
  }
 */


  botonBuscarPresionado = false;


  buscarIngredientePorId() {
    // Vacía la tabla antes de realizar la búsqueda
    this.ingredientesss = [];
  
    if (this.ingredientId) {
      this.IngredientesService.getingredienteporid(this.ingredientId).subscribe({
        next: (res: any) => {
          // Si no hay resultados, muestra la modal de errores
          if (res.ingredientes.length === 0) {
            this.showModalErrorsindatos();
          } else {
            // Actualiza this.ingredientesss solo si hay resultados
            this.ingredientesss = res.ingredientes;
          }
        },
        error: (err) => {
          console.error(err);
          this.showModalErrorsindatos();
        },
      });
  
      // Llama a otra función para buscar descripción por ID
      this.buscarDescripcionporId();
    } else {
      // Si el usuario borra el ID de búsqueda, no es necesario hacer nada más aquí
    }
  }
  

  
  buscarDescripcionporId() {
    if (this.ingredientId) {
      this.IngredientesService.getobtenerDescripcionPlato(
        this.ingredientId
      ).subscribe({
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
    const platoSeleccionado = this.ingredientes.find(
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

  //obtener todos los  alimentos
  getAllalimentos() {
    this.AlimentosService.getalimentos().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.alimentos);
        this.alimentoss = res.alimentos;
      },
      error: (err) => {
        // alert("Error en la carga de datos");
      },
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
    this. getAllalimentos();
  }
  //Para el editar de ingredientes usando modal

  editarIngrediente(item: any) {
    this.tituloForm = "Editar Ingredientes";
    this.ingredientesForm.patchValue({
      precio: item.precio,
      cantidadPersona: item.cantidadPersona,
      numDias: item.numDias,
      id_plato: item.id_plato,         // Establecer el valor del campo id_plato
      id_alimento: item.id_alimento,   // Establecer el valor del campo id_alimento
    });
    console.log("ID de plato:", item.id_plato);
  console.log("ID de alimento:", item.id_alimento);
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
    
  
    // Verificar si item.alimento está definido y tiene una propiedad descripcion
    if (item.alimento && item.alimento.descripcion) {
     
      this.alimentoSeleccionado.descripcion = item.alimento.descripcion;
      this.selectedOptionalimento = {
        descripcion: item.alimento.descripcion,
        id: item.id_alimento,
      };
    } else {
      // Manejar el caso en que item.alimento o item.alimento.descripcion sean undefined
      // Puedes asignar un valor predeterminado o realizar alguna otra acción aquí
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
        id_alimento: this.ingredientesForm.value.id_alimento,


        
        
      };
      this. getAllalimentos();
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
        this.ingredientesForm.controls.id_alimento.invalid;
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
