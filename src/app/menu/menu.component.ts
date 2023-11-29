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
  showDiasError= false;
   showPrecioError= false;
  showMoreOptions: boolean = false;
  selectedOption: any = null;
  menusssOriginal: any[] = [];

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
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef  // Inyecta ChangeDetectorRef

  ) {
    this.getAllplatos();
    this.getAllmenus();
    

  }

  //cargar los datos de la seleccion de la tabla  en la modal

  ngOnInit() {
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
      numDias: ['', Validators.required]
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


//----------------filtro
  nombreplatoFiltro: string = '';
  filtroSeleccionado: string = ''; 
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
    this.tituloForm = 'Registro de menú diario';
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
    this.tituloForm = 'Editar menú diario';
    this.menuForm.patchValue({
      id_plato: item.plato.id,
      cantidad: item.cantidad,
      habilitado: item.habilitado,
      fecha:item.fecha,
      numDias:5
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
      this.showDiasError = false;
   
      const datos = {
        id_plato: this.menuForm.value.id_plato,
        cantidad: this.menuForm.value.cantidad,
        habilitado: this.menuForm.value.habilitado,
        fecha: this.menuForm.value.fecha,
        numDias: this.menuForm.value.numDias
      };
  
      if (!this.editandoPlato) {
        this.MenuService.guardarMenu(datos).subscribe(
          (platos) => {
            console.log(platos);
            this.showModal();
            this.getAllmenus(); // Actualizar la tabla después de agregar un menú
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
        this.MenuService.guardarMenu(datos, this.idPlatoEditar).subscribe(
          (plato) => {
            console.log(plato);
            this.showModalEdit();
            this.loadPageData();
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
      this.showDiasError = this.menuForm.controls.numDias.invalid;
      
    }
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
}
