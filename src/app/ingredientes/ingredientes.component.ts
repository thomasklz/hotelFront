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
import { PesosService } from 'app/servicios/pesos.service';

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
  id_tipoalimento: string = '';
  pesosss: any[] = [];
  platosss: any[] = [];
  tipoalimentosss: any[] = [];
  ingredientesss: any[] = [];
  tituloForm;
  
  ingredientesForm!: FormGroup;
  editandoIngredientes: boolean = false; // Variable para indicar si se está editando un alimento existente
  idIngredientesEditar: string = ''; // Variable para almacenar el ID del alimento en caso de edición
  
  showIdplatoError = false//evitando que se muestren los mensajes de campo requerido 
  showCantidadError = false;//evitando que se muestren los mensajes de campo requerido 
  showIdtipoalimentoError = false//evitando que se muestren los mensajes de campo requerido 
  showAlimentoError = false//evitando que se muestren los mensajes de campo requerido 
  showIdpesoError = false;//evitando que se muestren los mensajes de campo requerido 
  showPrecioError = false; //evitando que se muestren los mensajes de campo requerido 
  showcantidad_pesoError = false; //evitando que se muestren los mensajes de campo requerido 
  
  
  constructor(
    private http: HttpClient,
    private IngredientesService: IngredientesService,
    private AlimentosService: AlimentosService,
    private MenuService: MenuService,
    private PesosService: PesosService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.getAllpesos();
    this.getAllplatos();
    this.getAlltipoalimento();
    this.getAllingredientes();
  }

  //cargar los datos de la seleccion de la tabla  en la modal

  ngOnInit() {
    this.getAllingredientes();
    this.ingredientesForm = this.formBuilder.group({
      precio: new FormControl("", [Validators.required, Validators.minLength(1)]),
      alimento: new FormControl("", [Validators.required, Validators.minLength(1)]),
      cantidad: new FormControl("", [Validators.required, Validators.minLength(1)]),
      cantidad_peso: new FormControl("", [Validators.required, Validators.minLength(1)]),
      id_plato: new FormControl("", [Validators.required, Validators.maxLength(1)]),
      id_tipoalimento: new FormControl("", [Validators.required, Validators.maxLength(1)]),
      id_peso: new FormControl("", [Validators.required, Validators.maxLength(1)])
    });
  }
  showMoreOptionsplato: boolean = false;
  showMoreOptionstipoalimento: boolean = false;
  showMoreOptionspeso: boolean = false;
 

  selectedOptionplato: any = null;
  selectedOptiontipoalimento: any = null;
  selectedOptionpeso: any = null;

  toggleShowMoreOptionsplato() {
    this.showMoreOptionsplato = !this.showMoreOptionsplato;
  }
  toggleShowMoreOptionstipoalimento() {
    this.showMoreOptionstipoalimento = !this.showMoreOptionstipoalimento;
  }

  toggleShowMoreOptionspeso() {
    this.showMoreOptionspeso = !this.showMoreOptionspeso;
  }

  selectOptionplato(item: any) {
    this.selectedOptionplato = item;
    this.showMoreOptionsplato = false;
    // Asignar el valor del ID del plato seleccionado al formulario
    this.ingredientesForm.get('id_plato')?.setValue(item.id);
  }

  selectOptiontipoalimento(item: any) {
    this.selectedOptiontipoalimento = item;
    this.showMoreOptionstipoalimento = false;

    // Asignar el valor del ID del alimento seleccionado al formulario
    this.ingredientesForm.get('id_tipoalimento')?.setValue(item.id);
  }

  selectOptionpeso(item: any) {
    this.selectedOptionpeso = item;
    this.showMoreOptionspeso = false;

    // Asignar el valor del ID del peso seleccionado al formulario
    this.ingredientesForm.get('id_peso')?.setValue(item.id);
  }

  getSelectedOptionLabelplato() {
    return this.selectedOptionplato ? this.selectedOptionplato.descripcion : 'Seleccione  ';
  }

  getSelectedOptionLabeltipoalimento() {
    return this.selectedOptiontipoalimento ? this.selectedOptiontipoalimento.tipo : 'Seleccione  ';
  }

  getSelectedOptionLabelpeso() {
    return this.selectedOptionpeso ? this.selectedOptionpeso.descripcion : 'Seleccione  ';
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

  //registrar el id plato el nuevo que se selecciona y enviarlo a la data
  getId_plato() {
    this.http
      .get("http://localhost:3000/api/crearplato/?=" + this.id_plato)
      .subscribe((result: any) => {
        this.platosss = result.ingredientes;
      });
  }

  //registrar el id tipo alimento el nuevo que se selecciona y enviarlo a la data
  getId_Tipoalimento() {
    this.http
      .get("http://localhost:3000/api/creartipo_alimento?=" + this.id_tipoalimento)
      .subscribe((result: any) => {
        this.tipoalimentosss = result.ingredientes;
      });
  }


  //registrar el id peso el nuevo que se selecciona y enviarlo a la data
  getId_peso() {
    this.http
      .get("http://localhost:3000/api/crearpeso?=" + this.id_peso)
      .subscribe((result: any) => {
        this.pesosss = result.ingredientes;
      });
  }

  //obtener todos los pesos 
  getAllpesos() {
    this.PesosService.gettpesos().subscribe({
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


    //obtener todos los tipos alimentos 
    getAlltipoalimento() {
      this.AlimentosService.gettipoalimento().subscribe({
        next: (res) => {
          this.dataSource = new MatTableDataSource(res.tipo_alimentos);
          this.tipoalimentosss = res.tipo_alimentos;
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

  //Para el registro de ingredientes usando modal
  nuevoCurso() {
    this.tituloForm = 'Registro de Ingredientes'; //cambio de nombre en el encabezado
    this.ingredientesForm.reset();
    this.editandoIngredientes = false;
    this.idIngredientesEditar = '';

    // Reset the selectedOption and clear the form field value
    this.selectedOptiontipoalimento = null;
    this.ingredientesForm.get('id_tipoalimento')?.setValue(null);

    // Reset the selectedOption and clear the form field value
    this.selectedOptionplato = null;
    this.ingredientesForm.get('id_plato')?.setValue(null);

    // Reset the selectedOption and clear the form field value
    this.selectedOptionpeso = null;
    this.ingredientesForm.get('id_peso')?.setValue(null);

    // Establecer variables a false al editar
    this.showIdtipoalimentoError = false;
    this.showIdpesoError = false;
    this.showIdplatoError = false;
    this.showAlimentoError= false;
    this.showCantidadError= false;
    this.showcantidad_pesoError= false;

    
  }
  //Para el editar de ingredientes usando modal

  editarIngrediente(item: any) {
    this.tituloForm = 'Editar  Ingredientes';
    this.ingredientesForm.patchValue({
      precio: item.precio,
      cantidad: item.cantidad,
      alimento: item.alimento,
      cantidad_peso: item.cantidad_peso,
      id_plato: item.plato.id,
      id_tipoalimento: item.tipo_alimento.id,
      id_peso: item.peso.id
    });
    this.selectedOptiontipoalimento = { tipo: item.tipo_alimento.tipo, id: item.tipo_alimento.id };
    this.selectedOptionplato = { descripcion: item.plato.descripcion, id: item.plato.id };
    this.selectedOptionpeso = { descripcion: item.peso.descripcion, id: item.peso.id };

    this.getId_peso();
    this.getId_plato();
    this.getId_Tipoalimento();
    this.editandoIngredientes = true;
    this.idIngredientesEditar = item.id;

    // Establecer variables a false al editar
    this.showPrecioError = false;
    this.showIdpesoError = false;
    this.showIdplatoError = false;
    this.showAlimentoError = false;
   this.showIdtipoalimentoError= false;
   this.showCantidadError= false;
   this.showAlimentoError= false;

   
  }

  // Registro de ingredientes...

  addIngredientes() {
    if (this.ingredientesForm.valid) {
      this.showPrecioError = false;
      this.showIdpesoError = false;
      this.showIdplatoError = false;
      this.showIdtipoalimentoError = false;
      this.showAlimentoError= false;
      this.showCantidadError= false;
      this.showAlimentoError= false;
      const datos = {
        precio: this.ingredientesForm.value.precio,
        alimento: this.ingredientesForm.value.alimento,
        cantidad: this.ingredientesForm.value.cantidad,
        cantidad_peso: this.ingredientesForm.value.cantidad_peso,
        id_peso: this.ingredientesForm.value.id_peso,
        id_plato: this.ingredientesForm.value.id_plato,
        id_tipoalimento: this.ingredientesForm.value.id_tipoalimento
      };

      if (!this.editandoIngredientes) {
        this.IngredientesService.guardar(datos).subscribe(
          (result: any) => {
            console.log(result);
            this.showModal();
            this.getAllingredientes(); // Actualizar la tabla después de agregar un ingrediente
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
          (result: any) => {
            console.log(result);
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
      this.showIdtipoalimentoError = this.ingredientesForm.controls.id_alimento.invalid;
      this.showAlimentoError=this .ingredientesForm.controls.descripcion.invalid;
      this.showCantidadError= this.ingredientesForm.controls.cantidad.invalid;
      this.showcantidad_pesoError= this.ingredientesForm.controls.cantidad_peso.invalid;
      
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

