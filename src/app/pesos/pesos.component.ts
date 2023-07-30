import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import swal from 'sweetalert';
import swal2 from 'sweetalert';

import Swal from 'sweetalert2';
import { AlimentosService } from 'app/servicios/alimentos.service';
import { PesosService } from '../servicios/pesos.service';
@Component({
  selector: 'app-pesos',
  templateUrl: './pesos.component.html',
  styleUrls: ['./pesos.component.scss']
})
export class PesosComponent implements OnInit {
  dataSource = new MatTableDataSource<any>();
  id: string = '';
  estado: boolean = true;
  descripcion: string = '';
  id_peso: string = '';
  pesosss: any[] = [];
  tituloForm;
  pesosForm!: FormGroup;
  editandopeso: boolean = false; // Variable para indicar si se está editando un alimento existente
  idpesoEditar: string = ''; // Variable para almacenar el ID del alimento en caso de edición
  showpesooError = false; //evitando que se muestren los mensajes de campo requerido 
  constructor(
    private http: HttpClient,
    private PesosService: PesosService,

    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.getAlltipoalimento();
  }

  //cargar los datos de la seleccion de la tabla  en la modal

  ngOnInit() {
    this.getAlltipoalimento();
    this.pesosForm = this.formBuilder.group({
      descripcion: new FormControl("", [Validators.required, Validators.minLength(3)])
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




  //obtener todos los tipos alimentos 
  getAlltipoalimento() {
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



  //Para el registro de plato usando modal
  nuevoCurso() {
    this.tituloForm = 'Registro de Peso'; //cambio de nombre en el encabezado
    this.pesosForm.reset();
    this.editandopeso = false;
    this.idpesoEditar = '';
  }
  //Para el editar de plato usando modal
  editartipoAlimento(item: any) {
    this.tituloForm = 'Editar  Peso';
    this.pesosForm.patchValue({
      descripcion: item.descripcion
    });
    this.editandopeso = true;
    this.idpesoEditar = item.id;

    // Establecer variables a false al editar
    this.showpesooError = false;
  }


  // Registro de Plato...
  addtipoAlimento() {
    if (this.pesosForm.valid) {
      this.showpesooError = false;

      const datos = {
        descripcion: this.pesosForm.value.descripcion
      };

      if (!this.editandopeso) {
        this.PesosService.guardar(datos).subscribe(
          (pesos) => {
            console.log(pesos);
            this.showModal();
            this.getAlltipoalimento(); // Actualizar la tabla después de agregar un alimento
            this.pesosForm.reset(); // Restablecer los valores del formulario

          },
          (error) => {
            console.log(error);
            this.showModalError();
          }
        );
      } else {
        // m o d i f i c a r -----------------------------
        this.PesosService.guardar(datos, this.idpesoEditar).subscribe(
          (pesos) => {
            console.log(pesos);
            this.showModalEdit();
            this.nuevoCurso(); // Restablecer el formulario después de editar
            this.getAlltipoalimento();
          },
          (error) => {
            console.log(error);
            this.showModalErrorEdit();
          }
        );
      }
    } else {
      this.showpesooError = this.pesosForm.controls.descripcion.invalid;
    }
  }


  // ...
  showModalEliminar(id: number) {
    Swal.fire({
      title: '¿Estás seguro que deseas eliminar el peso?',
      icon: 'warning',
      showCancelButton: true,

      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#bf0d0d',


    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminartipoAlimento(id);
      }
    });
  }


  showModalErrorEliminar() {
    Swal.fire({
      title: 'Error al eliminar el alimento',
      icon: 'error',
    });
  }

  eliminartipoAlimento(id: number) {
    this.PesosService.deletepesos(id).subscribe({
      next: (res) => {
        Swal.fire({
          title: 'Datos eliminados exitosamente',
          icon: 'success',
        }).then(() => {
          this.getAlltipoalimento();
        });
      },
      error: () => {
        this.showModalErrorEliminar();
      },
    });
  }


  // Restablecer el formulario cuando se cierre el modal
  closeModal() {
    this.pesosForm.reset();
    this.editandopeso = false;
    this.idpesoEditar = '';
  }
}

