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
  selector: 'app-platos',
  templateUrl: './platos.component.html',
  styleUrls: ['./platos.component.scss']
})
export class PlatosComponent implements OnInit {

  dataSource = new MatTableDataSource<any>();
  id: string = '';
  estado: boolean = true;
  descripcion: string = '';
  id_tipomenu: string = '';
  tipomenusss: any[] = [];
  platosss: any[] = [];
  tituloForm;
  menuForm!: FormGroup;
  editandoPlato: boolean = false; // Variable para indicar si se está editando un plato existente
  idPlatoEditar: string = ''; // Variable para almacenar el ID del plato en caso de edición



  showDescripcionError = false; //evitando que se muestren los mensajes de campo requerido 
  showIdTipomenuError = false;//evitando que se muestren los mensajes de campo requerido 
  showPrecioError = false;

  showMoreOptions: boolean = false;
  selectedOption: any = null;



  toggleShowMoreOptions() {
    this.showMoreOptions = !this.showMoreOptions;
  }


  selectOption(item: any) {
    this.selectedOption = item;
    this.showMoreOptions = false;

    // Update the form control with the selected option's ID
    this.menuForm.get('id_tipomenu')?.setValue(item.id);
  }

  getSelectedOptionLabel() {
    return this.selectedOption ? this.selectedOption.tipo : 'Seleccione  ';
  }
  constructor(
    private http: HttpClient,
    private MenuService: MenuService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.getAlltipomenu();
    this.getAllplato();
  }

  //cargar los datos de la seleccion de la tabla  en la modal

  ngOnInit() {
    this.getAllplato();
    this.loadPageData();
    this.menuForm = this.formBuilder.group({
      descripcion: new FormControl("", [Validators.required, Validators.minLength(3)]),
      id_tipomenu: new FormControl("", [Validators.required, Validators.maxLength(1)]),
      precio: new FormControl("", [
        Validators.required,
        Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/), // Expresión regular para permitir números y hasta dos decimales
        Validators.minLength(1)
      ]),
    });


    this.menuForm.get('precio')?.valueChanges.subscribe(() => {
      this.showPrecioError = this.menuForm.get('precio')?.invalid;
    });
  }
 
  //--------------------------------------------------------------------------------------

  pageSize = 11;  // Tamaño de la página
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
    return this.platosss.slice(this.startIndex, this.endIndex + 1);
  }

  // ... otras funciones del componente

  loadPageData() {
    // Lógica para cargar datos de la página actual (no es necesario pasar parámetros a la API)
    this.MenuService.obtenerplatos().subscribe({
      next: (res) => {
        this.platosss = res.platos;
        this.totalItems = res.platos.length;  // Actualizar el total de elementos
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
  //--------------------------------------------------------------------------------------
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




  //registrar el id tipo menu el nuevo que se selecciona y enviarlo a la data
  getId_Tipomenu() {
    this.http
      .get("http://localhost:3000/api/creartipo_menu?=" + this.id_tipomenu)
      .subscribe((result: any) => {
        this.tipomenusss = result.platos;
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

  //obtener todos los platos 
  getAllplato() {
    this.MenuService.obtenerplatos().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.platos);
        this.platosss = res.platos;
      },
      error: (err) => {
        //alert("Error en la carga de datos");
      },
    });
  }


  //Para el registro de plato usando modal
  nuevoCurso() {
    this.tituloForm = 'Registro de plato'; //cambio de nombre en el encabezado
    this.menuForm.reset();
    this.editandoPlato = false;
    this.idPlatoEditar = '';

    this.selectedOption = null;
    this.menuForm.get('id_tipomenu')?.setValue(null);

    this.showDescripcionError = false;
    this.showIdTipomenuError = false;
    this.showPrecioError = false;

  }
  //Para el editar de plato usando modal

  // ...

  editarPlato(item: any) {
    this.tituloForm = 'Editar  plato';
    this.menuForm.patchValue({
      descripcion: item.descripcion,
      id_tipomenu: item.tipo_menu.id,
      precio:item.precio
    });
    this.selectedOption = { tipo: item.tipo_menu.tipo, id: item.tipo_menu.id };

    this.getId_Tipomenu();
    this.editandoPlato = true;
    this.idPlatoEditar = item.id;

    // Establecer variables a false al editar
    this.showDescripcionError = false;
    this.showIdTipomenuError = false;
    this.showPrecioError = false;
    
  }




  // Registro de Plato...

  addMenu() {
    if (this.menuForm.valid) {
      this.showDescripcionError = false;
      this.showIdTipomenuError = false;
      this.showPrecioError = false;

      const datos = {
        descripcion: this.menuForm.value.descripcion,
        id_tipomenu: this.menuForm.value.id_tipomenu,
        precio:this.menuForm.value.precio
      };

      if (!this.editandoPlato) {
        this.MenuService.guardar(datos).subscribe(
          (platos) => {
            console.log(platos);
            this.showModal();
            this.getAllplato(); // Actualizar la tabla después de agregar un menú
            this.loadPageData();
            this.menuForm.reset(); // Restablecer los valores del formulario

          },
          (error) => {
            console.log(error);
            this.showModalError();
          }
        );
      } else {
        // m o d i f i c a r -----------------------------
        this.MenuService.guardar(datos, this.idPlatoEditar).subscribe(
          (plato) => {
            console.log(plato);
            this.showModalEdit();
            this.nuevoCurso(); // Restablecer el formulario después de editar
            this.loadPageData();
            this.getAllplato();
          },
          (error) => {
            console.log(error);
            this.showModalErrorEdit();
          }
        );
      }
    } else {
      this.showDescripcionError = this.menuForm.controls.descripcion.invalid;
      this.showIdTipomenuError = this.menuForm.controls.id_tipomenu.invalid;
      this.showPrecioError =  this.menuForm.controls.precio.invalid;

    }
  }

  // ...



  // ...

 
  // ...
  showModalEliminar(id: number) {
    Swal.fire({
      title: '¿Estás seguro que deseas eliminar el plato?',
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
          this.getAllplato();
          this.loadPageData();
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
