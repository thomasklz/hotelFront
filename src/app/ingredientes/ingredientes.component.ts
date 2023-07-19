import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';


import swal from 'sweetalert';
import swal2 from 'sweetalert';
import { IngredientesService } from '../servicios/ingredientes.service';
import Swal from 'sweetalert2';
import { AlimentosService } from 'app/servicios/alimentos.service';
import { MenuService } from 'app/servicios/menu.service';
@Component({
  selector: 'app-ingredientes',
  templateUrl: './ingredientes.component.html',
  styleUrls: ['./ingredientes.component.scss']
})
export class IngredientesComponent implements OnInit {

  dataSource = new MatTableDataSource<any>();
  id: string = '';
  estado: boolean = true;
  precio: string = '';
  id_peso: string = '';
  id_plato: string = '';
  id_alimento: string = '';
  
  pesosss: any[] = [];
  platosss: any[] = [];
  alimentosss: any[] = [];
  ingredientesss: any[] = [];
  tituloForm;
  ingredientesForm!: FormGroup;
  editandoIngredientes: boolean = false; // Variable para indicar si se está editando un alimento existente
  idIngredientesEditar: string = ''; // Variable para almacenar el ID del alimento en caso de edición
  showPrecioError = false; //evitando que se muestren los mensajes de campo requerido 
  showIdpesoError = false;//evitando que se muestren los mensajes de campo requerido 
  showIdplatoError = false
  showIdalimentoError = false
  constructor(
    private http: HttpClient,
    private IngredientesService: IngredientesService,
    private AlimentosService: AlimentosService,
    private MenuService: MenuService,
    
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.getAllpesos();
    this.getAllplatos();
    this.getAllalimentos();
    this.getAllingredientes();
  }

//cargar los datos de la seleccion de la tabla  en la modal

  ngOnInit() {
    this.getAllingredientes();
    this.ingredientesForm = this.formBuilder.group({
      precio: new FormControl("", [Validators.required, Validators.minLength(1)]),
      id_plato: new FormControl("", [Validators.required, Validators.maxLength(1)]),
      id_alimento: new FormControl("", [Validators.required, Validators.maxLength(1)]),
      id_peso: new FormControl("", [Validators.required, Validators.maxLength(1)])
    });
  }

  //Modal de Agregar Notificacion
  title= 'sweetAlert';
  showModal(){
    swal2({
      title:'Datos registrado exitosamente',
      icon: "success",
    });
  }
  
  //Modal de No agg error de Notificacion

  showModalError(){
    swal({
      title:'Error de registro de datos ',
      icon: "error",
      
    });
  }
 
  //Modal de Modificacion Notificacion
  
  showModalEdit(){
    swal2({
      title:'Datos modificado exitosamente',
      icon: "success",
    });
  }
  
    //Modal de  error de Modificacion Notificacion

    showModalErrorEdit(){
      swal({
        title:'Error de modificación de datos ',
        icon: "error",
      });
    }

//registrar el id plato el nuevo que se selecciona y enviarlo a la data
getId_plato() {
  this.http
    .get("http://localhost:3000/api/crearplato/?=" + this.id_plato)
    .subscribe((result: any) => {
      this.platosss = result.ingredientes;
    });
}

//registrar el id alimento el nuevo que se selecciona y enviarlo a la data
getId_alimento() {
  this.http
    .get("http://localhost:3000/api/crearalimento/?=" + this.id_alimento)
    .subscribe((result: any) => {
      this.alimentosss = result.ingredientes;
    });
}

//registrar el id tipo alimento el nuevo que se selecciona y enviarlo a la data
  getId_peso() {
    this.http
      .get("http://localhost:3000/api/crearpeso?=" + this.id_peso)
      .subscribe((result: any) => {
        this.pesosss = result.ingredientes;
      });
  }
 
//obtener todos los pesos 

  getAllpesos() {
    this.IngredientesService.gettpesos().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.pesos);
        this.pesosss = res.pesos;
      },
      error: (err) => {
       // alert("Error en la carga de datos");
      },
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


  getAllalimentos() {
    this.AlimentosService.getalimentos().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.alimentos);
        this.alimentosss = res.alimentos;
      },
      error: (err) => {
       // alert("Error en la carga de datos");
      },
    });
  }
  
//obtener todos los ingredientes 
  getAllingredientes() {
    this.IngredientesService.getingrediente().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.ingredientes);
        this.ingredientesss = res.ingredientes;
      },
      error: (err) => {
        //alert("Error en la carga de datos");
      },
    });
  }

//Para el registro de plato usando modal
  nuevoCurso() {
    this.tituloForm = 'Registro de Ingredientes'; //cambio de nombre en el encabezado
    this.ingredientesForm.reset();
    this.editandoIngredientes = false;
    this.idIngredientesEditar = '';
  }
//Para el editar de plato usando modal

editarIngrediente(item: any) {
  this.tituloForm = 'Editar  Ingredientes';
  this.ingredientesForm.patchValue({
    precio: item.precio,
    id_plato: item.plato.id,
    id_alimento: item.alimento.id,
    id_peso: item.peso.id


  });
  this.getId_peso();
  this.getId_plato();
  this.getId_alimento();
  this.editandoIngredientes = true;
  this.idIngredientesEditar = item.id;

  // Establecer variables a false al editar
  this.showPrecioError = false;
  this.showIdpesoError = false;
  this.showIdplatoError = false;
  this.showIdalimentoError = false;
  } 



// Registro de Plato...

addIngredientes() {
  if (this.ingredientesForm.valid) {
    this.showPrecioError = false;
    this.showIdpesoError = false;
    this.showIdplatoError = false;
    this.showIdalimentoError = false;
    const datos = {
      precio: this.ingredientesForm.value.precio,
      id_peso: this.ingredientesForm.value.id_peso,
      id_plato: this.ingredientesForm.value.id_plato,
      id_alimento: this.ingredientesForm.value.id_alimento
    };

    if (!this.editandoIngredientes) {
      this.IngredientesService.guardar(datos).subscribe(
        (ingredientes) => {
          console.log(ingredientes);
          this.showModal();
          this.getAllingredientes(); // Actualizar la tabla después de agregar un ingredientes
          this.ingredientesForm.reset(); // Restablecer los valores del formulario
          
        },
        (error) => {
          console.log(error);
          this.showModalError();
        }
      );
    } else {
      // m o d i f i c a r -----------------------------
      this.IngredientesService.guardar(datos, this.idIngredientesEditar).subscribe(
        (ingredientes) => {
          console.log(ingredientes);
          this.showModalEdit();
          this.nuevoCurso(); // Restablecer el formulario después de editar
          this.getAllingredientes();
        },
        (error) => {
          console.log(error);
          this.showModalErrorEdit();
        }
      );
    }
  } else {
    this.showPrecioError = this.ingredientesForm.controls.precio.invalid;
    this.showIdpesoError = this.ingredientesForm.controls.id_peso.invalid;
    this.showIdplatoError = this.ingredientesForm.controls.id_plato.invalid;
    this.showIdalimentoError = this.ingredientesForm.controls.id_alimento.invalid;
  }
}


// ...
showModalEliminar(id: any) {
  Swal.fire({
    title: '¿Estás seguro que deseas eliminar el ingrediente?',
    icon: 'warning',
    showCancelButton: true,
   
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#bf0d0d',
    
    
  }).then((result) => {
    if (result.isConfirmed) {
      this.eliminarIngrediente(id);
    }
  });
}


showModalErrorEliminar() {
  Swal.fire({
    title: 'Error al eliminar el alimento',
    icon: 'error',
    
  });
}

eliminarIngrediente(id: number) {
  this.IngredientesService.deleteingrediente(id).subscribe({
    next: (res) => {
      Swal.fire({
        title: 'Datos eliminados exitosamente',
        icon: 'success',
      }).then(() => {
        this.getAllingredientes();
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
    this.idIngredientesEditar = '';
  }

}
