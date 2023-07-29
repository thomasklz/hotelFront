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
  id_tipomenu: string = '';
  tipomenusss: any[] = [];
  
  
  id_cantidadplato: string = '';


  cantidadplatosss: any[] = [];
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
          this.menuForm.get('id_tipomenu')?.setValue(item.id);
        }    
        getSelectedOptionLabel() {
          return this.selectedOption ? this.selectedOption.tipo : 'Seleccione  ';
        }

        showMoreOptionscantidadplato: boolean = false;  
        selectedOptioncantidadplato: any = null;
        
        
        
          toggleShowMoreOptionscantidadplato() { 
            this.showMoreOptionscantidadplato = !this.showMoreOptionscantidadplato;
              }        
              selectOptioncantidadplato(item: any) {
                this.selectedOptioncantidadplato = item;
                this.showMoreOptionscantidadplato = false;
            
                // Update the form control with the selected option's ID
                this.menuForm.get('id_cantidadplato')?.setValue(item.id);
              }
            
              getSelectedOptionLabelcantidadplato() {
                return this.selectedOptioncantidadplato ? this.selectedOptioncantidadplato.cantidad : 'Seleccione  ';
              }

  constructor(
    private http: HttpClient,
    private MenuService: MenuService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.getAlltipomenu();
    this.getAllmenus();
    this.getAllcantidadplatos();
    
  }

//cargar los datos de la seleccion de la tabla  en la modal

  ngOnInit() {
    this.getAllmenus();
    this.getAllcantidadplatos();
    this.menuForm = this.formBuilder.group({
     
      id_tipomenu: new FormControl("", [Validators.required, Validators.maxLength(1)]),
      id_cantidadplato: new FormControl("", [Validators.required, Validators.maxLength(1)]),
      fecha: new FormControl("", [Validators.required, Validators.minLength(1)]),
      habilitado: new FormControl("", [Validators.required, Validators.minLength(1)]),

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

     //Modal de Eliminar Notificacion


    //Modal de  error de Modificacion Notificacion

  
//registrar el id tipo menu el nuevo que se selecciona y enviarlo a la data
  getId_Tipomenu() {
    this.http
      .get("http://localhost:3000/api/creartipo_menu?=" + this.id_tipomenu)
      .subscribe((result: any) => {
        this.tipomenusss = result.menus;
      });
  }
 
  //registrar el id cantidad de plato el nuevo que se selecciona y enviarlo a la data
  getId_Cantidadplato() {
    this.http
      .get("http://localhost:3000/api/crearcantidadplato?=" + this.id_cantidadplato)
      .subscribe((result: any) => {
        this.cantidadplatosss = result.menus;
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

  //obtener todas las cantidades de platos

  getAllcantidadplatos() {
    this.MenuService.obtenercantidadplatoselect().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.cantidad_platos);
        this.cantidadplatosss = res.cantidad_platos;
        
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


//Para el registro de plato usando modal
  nuevoCurso() {
    this.tituloForm = 'Registro de Menú'; //cambio de nombre en el encabezado
    this.menuForm.reset();
    this.editandoPlato = false;
    this.idPlatoEditar = '';

    this.selectedOption = null;
    this.menuForm.get('id_tipomenu')?.setValue(null);   
    this.showId_tipomenuError = false;

    this.selectedOptioncantidadplato = null;
    this.menuForm.get('id_cantidadplato')?.setValue(null);   
    this.showId_cantidadplatoError = false;
    this.showFechaError = false;
    this.showHabilitadoError = false;

  }
//Para el editar de plato usando modal

 // ...

editarMenu(item: any) {
  this.tituloForm = 'Editar  Menú';
  this.menuForm.patchValue({   
    id_tipomenu: item.tipo_menu.id,
    id_cantidadplato: item.cantidad_plato.id,
    fecha: item.fecha,
    habilitado: item.habilitado

  });

  this.selectedOption = { tipo: item.tipo_menu.tipo, id: item.tipo_menu.id };
  this.selectedOptioncantidadplato = { cantidad: item.cantidad_plato.cantidad, id: item.cantidad_plato.id };
  this.getId_Tipomenu();
  this.getId_Cantidadplato();
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
     
      id_tipomenu: this.menuForm.value.id_tipomenu,
      id_cantidadplato: this.menuForm.value.id_cantidadplato,
      fecha: this.menuForm.value.fecha,
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
    this.showId_cantidadplatoError = this.menuForm.controls.id_cantidadplato.invalid;
    this.showId_tipomenuError = this.menuForm.controls.id_tipomenu.invalid;
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
