import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MenuService } from 'app/servicios/menu.service';

import swal from 'sweetalert';
import swal2 from 'sweetalert';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  dataSource = new MatTableDataSource<any>();
  id: string = '';
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

  showMoreOptions: boolean = false;
  selectedOption: any = null;
  toggleShowMoreOptions() {
    this.showMoreOptions = !this.showMoreOptions;
  }
  selectOption(item: any) {
    this.selectedOption = item;
    this.showMoreOptions = false;

    // Update the form control with the selected option's ID
    this.menuForm.get('id_plato')?.setValue(item.id);
  }
  getSelectedOptionLabel() {
    return this.selectedOption ? this.selectedOption.descripcion : 'Seleccione  ';
  }


  

 
  constructor(
    private http: HttpClient,
    private MenuService: MenuService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.getAllplatos();
    this.getAllmenus();
    

  }

  //cargar los datos de la seleccion de la tabla  en la modal

  ngOnInit() {
    this.getAllmenus();
    this.menuForm = this.formBuilder.group({

      id_plato: new FormControl("", [Validators.required, Validators.maxLength(1)]),
      cantidad: new FormControl("", [Validators.required, Validators.minLength(1)]),
      habilitado: new FormControl("", [Validators.required, Validators.minLength(1)]),

    });
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

  platoSeleccionado: { id: number | null; descripcion: string } = {
    id: null,
    descripcion: "",
  };
  
/*   updatePlatoId(event: any) {
    const descripcion = event.target.value;
    const platoSeleccionado = this.platosss.find(
      (plato) => plato.descripcion === descripcion
    );
    this.platoSeleccionado = platoSeleccionado || {
      id: null,
      descripcion: descripcion,
    };
    this.menuForm.get("id_plato")?.setValue(this.platoSeleccionado.id);
  } */
  updatePlatoId(event: any) {
    const descripcion = event.target.value;
    const platoSeleccionado = this.platosss.find(
      (plato) => plato.descripcion === descripcion
    );
  
    if (platoSeleccionado) {
      this.platoSeleccionado = {
        id: null,
        descripcion: platoSeleccionado.descripcion,
      };
      this.menuForm.get("id_plato")?.setValue(platoSeleccionado.id);
    } else {
      this.platoSeleccionado = {
        id: null,
        descripcion: descripcion,
      };
      this.menuForm.get("id_plato")?.setValue(null);
    }
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





  //obtener todos los menus 
  getAllmenus() {
    this.MenuService.gettMenu().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.menu);
        this.menusss = res.menu;
      },
      error: (err) => {
        //alert("Error en la carga de datos");
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


  //Para el registro de plato usando modal
  nuevoCurso() {
    this.tituloForm = 'Registro de Menú'; //cambio de nombre en el encabezado
    this.menuForm.reset();
    this.editandoPlato = false;
    this.idPlatoEditar = '';

    this.selectedOption = null;
    this.menuForm.get('id_plato')?.setValue(null);
    this.showId_tipomenuError = false;

   
    this.showId_cantidadplatoError = false;
    this.showFechaError = false;
    this.showHabilitadoError = false;

  }
  //Para el editar de plato usando modal

  // ...

/*   editarMenu(item: any) {
    this.tituloForm = 'Editar Menú';
    this.menuForm.patchValue({
      id_plato: item.plato.id,
      cantidad: item.cantidad,
      habilitado: item.habilitado  // Esto establecerá el valor correcto en el formulario
    });
  
    // Selecciona automáticamente el radio button correspondiente
    const radioValue = +item.habilitado === 1 ? '1' : '0';
    console.log('Radio Value:', radioValue);
    this.menuForm.get('habilitado')?.setValue(radioValue);
  
    console.log('Formulario después de la configuración:', this.menuForm.value);
  
    this.selectedOption = { descripcion: item.plato.descripcion, id: item.plato.id };
    this.getId_plato();
    this.editandoPlato = true;
    this.idPlatoEditar = item.id;
  
    // Establecer variables a false al editar
    this.showId_cantidadplatoError = false;
    this.showId_tipomenuError = false;
    this.showFechaError = false;
    this.showHabilitadoError = false;
  }
   */
  
  editarMenu(item: any) {
    this.tituloForm = 'Editar Menú';
    this.menuForm.patchValue({
      id_plato: item.plato.id,
      cantidad: item.cantidad,
      habilitado: item.habilitado
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
    if (this.menuForm.valid) {
      this.showId_cantidadplatoError = false;
      this.showId_tipomenuError = false;
      this.showFechaError = false;
      this.showHabilitadoError = false;

      const datos = {

        id_plato: this.menuForm.value.id_plato,
        cantidad: this.menuForm.value.cantidad,
        habilitado: this.menuForm.value.habilitado


      };

      if (!this.editandoPlato) {
        this.MenuService.guardarMenu(datos).subscribe(
          (platos) => {
            console.log(platos);
            this.showModal();
            this.getAllmenus(); // Actualizar la tabla después de agregar un menú
            this.menuForm.reset(); // Restablecer los valores del formulario

          },
          (error) => {
            console.log(error);
            this.showModalError();
          }
        );
      } else {
        // m o d i f i c a r -----------------------------
        this.MenuService.guardarMenu(datos, this.idPlatoEditar).subscribe(
          (plato) => {
            console.log(plato);
            this.showModalEdit();
            this.nuevoCurso(); // Restablecer el formulario después de editar
            this.getAllmenus();
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

  // ...



  // ...


  // ...
  showModalEliminar(id: number) {
    Swal.fire({
      title: '¿Estás seguro que deseas eliminar el menú?',
      icon: 'warning',
      showCancelButton: true,

      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#bf0d0d',


    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarPlato(id);
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
    this.MenuService.deleteplato(id).subscribe({
      next: (res) => {
        Swal.fire({
          title: 'Datos eliminados exitosamente',
          icon: 'success',
        }).then(() => {
          this.getAllmenus();
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
}
