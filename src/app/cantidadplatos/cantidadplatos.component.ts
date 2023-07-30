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
  selector: 'app-cantidadplatos',
  templateUrl: './cantidadplatos.component.html',
  styleUrls: ['./cantidadplatos.component.scss']
})
export class CantidadplatosComponent implements OnInit {


  dataSource = new MatTableDataSource<any>();
  id: string = '';
  id_plato: string = '';
  cantidadplatosss: any[] = [];
  platosss: any[] = [];
  tituloForm;
  cantidadPlatosForm!: FormGroup;
  editandoCantidadPlato: boolean = false; // Variable para indicar si se está editando una cantidad plato existente
  idCantidadPlatoEditar: string = ''; // Variable para almacenar el ID del cantidad plato en caso de edición

  showId_platoError = false; //evitando que se muestren los mensajes de campo requerido 
  showCantidadError = false;//evitando que se muestren los mensajes de campo requerido 
  showFechaError = false;//evitando que se muestren los mensajes de campo requerido 
  showMoreOptions: boolean = false;
  selectedOption: any = null;

  toggleShowMoreOptions() {
    this.showMoreOptions = !this.showMoreOptions;
  }

  selectOption(item: any) {
    this.selectedOption = item;
    this.showMoreOptions = false;
    // Actualizar el control de formulario con el ID de la opción seleccionada
    this.cantidadPlatosForm.get('id_plato')?.setValue(item.id);
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
    this.getAllCantidadPlatos();
  }

  //cargar los datos de la seleccion de la tabla  en la modal
  ngOnInit() {
    this.getAllCantidadPlatos();
    this.cantidadPlatosForm = this.formBuilder.group({
      id_plato: new FormControl("", [Validators.required, Validators.minLength(1)]),
      cantidad: new FormControl("", [Validators.required, Validators.minLength(1)]),
      fecha: new FormControl("", [Validators.required, Validators.minLength(1)])
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


  //registrar el id plato el nuevo que se selecciona y enviarlo a la data
  getId_Platos() {
    this.http
      .get("http://localhost:3000/api/crearplato/?=" + this.id_plato).subscribe((result: any) => {
        this.platosss = result.cantidad_platos;
      });
  }

  //obtener todos los platos 
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

  //obtener todos los platos 
  getAllCantidadPlatos() {
    this.MenuService.gettcantidadplatos().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.cantidad_plato);
        this.cantidadplatosss = res.cantidad_plato;
      },
      error: (err) => {
        //alert("Error en la carga de datos");
      },
    });
  }


  //Para el registro de cantidad plato usando modal
  nuevoCurso() {
    this.tituloForm = 'Registro de Cantidad Plato'; //cambio de nombre en el encabezado
    this.cantidadPlatosForm.reset();
    this.editandoCantidadPlato = false;
    this.idCantidadPlatoEditar = '';



    // Restablecer la opción seleccionada y borrar el valor del campo de formulario
    this.selectedOption = null;
    this.cantidadPlatosForm.get('id_plato')?.setValue(null);

    // Establecer variables a false al editar
    this.showCantidadError = false;
    this.showFechaError = false;
    this.showId_platoError = false;
  }

  //Para el editar de plato usando modal
  editarCantidadPlato(item: any) {
    this.tituloForm = 'Editar Cantidad de Plato';
    this.cantidadPlatosForm.patchValue({
      id_plato: item.plato.id,
      cantidad: item.cantidad,
      fecha: item.fecha
    });
    this.selectedOption = { descripcion: item.plato.descripcion, id: item.plato.id };

    this.getId_Platos();
    this.editandoCantidadPlato = true;
    this.idCantidadPlatoEditar = item.id;

    // Establecer variables a false al editar
    this.showId_platoError = false;
    this.showCantidadError = false;
    this.showFechaError = false;
  }


  // Registro de Cantidad Plato...
  addCantidadPlato() {
    if (this.cantidadPlatosForm.valid) {
      this.showId_platoError = false;
      this.showCantidadError = false;
      this.showFechaError = false;

      const datos = {
        id_plato: this.cantidadPlatosForm.value.id_plato,
        cantidad: this.cantidadPlatosForm.value.cantidad,
        fecha: this.cantidadPlatosForm.value.fecha,

      };

      if (!this.editandoCantidadPlato) {
        this.MenuService.guardarCantidadPlato(datos).subscribe(
          (platos) => {
            console.log(platos);
            this.showModal();
            this.getAllCantidadPlatos(); // Actualizar la tabla después de agregar un menú
            this.cantidadPlatosForm.reset(); // Restablecer los valores del formulario

          },
          (error) => {
            console.log(error);
            this.showModalError();
          }
        );
      } else {
        // m o d i f i c a r -----------------------------
        this.MenuService.guardarCantidadPlato(datos, this.idCantidadPlatoEditar).subscribe(
          (plato) => {
            console.log(plato);
            this.showModalEdit();
            this.nuevoCurso(); // Restablecer el formulario después de editar
            this.getAllCantidadPlatos();
          },
          (error) => {
            console.log(error);
            this.showModalErrorEdit();
          }
        );
      }
    } else {
      this.showId_platoError = this.cantidadPlatosForm.controls.id_plato.invalid;
      this.showCantidadError = this.cantidadPlatosForm.controls.cantidad.invalid;
      this.showFechaError = this.cantidadPlatosForm.controls.fecha.invalid;
    }
  }


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
        this.eliminarCantidadPlato(id);
      }
    });
  }


  showModalErrorEliminar() {
    Swal.fire({
      title: 'Error al eliminar el plato',
      icon: 'error',
    });
  }

  eliminarCantidadPlato(id: number) {
    this.MenuService.deleteplato(id).subscribe({
      next: (res) => {
        Swal.fire({
          title: 'Datos eliminados exitosamente',
          icon: 'success',
        }).then(() => {
          this.getAllCantidadPlatos();
        });
      },
      error: () => {
        this.showModalErrorEliminar();
      },
    });
  }

  // Restablecer el formulario cuando se cierre el modal
  closeModal() {
    this.cantidadPlatosForm.reset();
    this.editandoCantidadPlato = false;
    this.idCantidadPlatoEditar = '';
  }
}
