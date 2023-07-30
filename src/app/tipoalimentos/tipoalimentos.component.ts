import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import swal from 'sweetalert';
import swal2 from 'sweetalert';

import Swal from 'sweetalert2';
import { AlimentosService } from 'app/servicios/alimentos.service';
@Component({
  selector: 'app-tipoalimentos',
  templateUrl: './tipoalimentos.component.html',
  styleUrls: ['./tipoalimentos.component.scss']
})
export class TipoalimentosComponent implements OnInit {

  dataSource = new MatTableDataSource<any>();
  id: string = '';
  estado: boolean = true;
  tipo: string = '';
  id_tipoalimento: string = '';
  tipoalimentosss: any[] = [];
  tituloForm;
  TipoalimentoForm!: FormGroup;
  editandoTipoAlimento: boolean = false; // Variable para indicar si se está editando un alimento existente
  idTipoAlimentoEditar: string = ''; // Variable para almacenar el ID del alimento en caso de edición
  showTipoError = false; //evitando que se muestren los mensajes de campo requerido 

  constructor(
    private http: HttpClient,
    private AlimentosService: AlimentosService,

    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.getAlltipoalimento();
  }

  //cargar los datos de la seleccion de la tabla  en la modal

  ngOnInit() {
    this.getAlltipoalimento();
    this.TipoalimentoForm = this.formBuilder.group({
      tipo: new FormControl("", [Validators.required, Validators.minLength(3)])
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



  //Para el registro de plato usando modal
  nuevoCurso() {
    this.tituloForm = 'Registro de Tipo Alimento'; //cambio de nombre en el encabezado
    this.TipoalimentoForm.reset();
    this.editandoTipoAlimento = false;
    this.idTipoAlimentoEditar = '';
  }
  //Para el editar de plato usando modal
  editartipoAlimento(item: any) {
    this.tituloForm = 'Editar  Tipo Alimento';
    this.TipoalimentoForm.patchValue({
      tipo: item.tipo
    });
    this.editandoTipoAlimento = true;
    this.idTipoAlimentoEditar = item.id;

    // Establecer variables a false al editar
    this.showTipoError = false;
  }


  // Registro de tipo alimento...
  addtipoAlimento() {
    if (this.TipoalimentoForm.valid) {
      this.showTipoError = false;

      const datos = {
        tipo: this.TipoalimentoForm.value.tipo
      };

      if (!this.editandoTipoAlimento) {
        this.AlimentosService.guardartiposalimentos(datos).subscribe(
          (tipo_alimentos) => {
            console.log(tipo_alimentos);
            this.showModal();
            this.getAlltipoalimento(); // Actualizar la tabla después de agregar un alimento
            this.TipoalimentoForm.reset(); // Restablecer los valores del formulario

          },
          (error) => {
            console.log(error);
            this.showModalError();
          }
        );
      } else {
        // m o d i f i c a r -----------------------------
        this.AlimentosService.guardartiposalimentos(datos, this.idTipoAlimentoEditar).subscribe(
          (tipo_alimentos) => {
            console.log(tipo_alimentos);
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
      this.showTipoError = this.TipoalimentoForm.controls.tipo.invalid;
    }
  }


  // ...
  showModalEliminar(id: number) {
    Swal.fire({
      title: '¿Estás seguro que deseas eliminar el tipo alimento?',
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
    this.AlimentosService.deletetipoalimentos(id).subscribe({
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
    this.TipoalimentoForm.reset();
    this.editandoTipoAlimento = false;
    this.idTipoAlimentoEditar = '';
  }
}
