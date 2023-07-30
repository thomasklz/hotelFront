import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { AlimentosService } from 'app/servicios/alimentos.service';
import swal from 'sweetalert';
import swal2 from 'sweetalert';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-alimentos',
  templateUrl: './alimentos.component.html',
  styleUrls: ['./alimentos.component.scss']
})
export class AlimentosComponent implements OnInit {

  dataSource = new MatTableDataSource<any>();
  id: string = '';
  id_tipoalimento: string = '';
  tipoalimentosss: any[] = [];
  alimentosss: any[] = [];
  tituloForm;
  titulo2Form;
  alimentoForm!: FormGroup;
  editandoAlimento: boolean = false; // Variable para indicar si se está editando un alimento existente
  idAlimentoEditar: string = ''; // Variable para almacenar el ID del alimento en caso de edición
  showDescripcionError = false; //evitando que se muestren los mensajes de campo requerido 
  showIdTipoalimentoError = false;//evitando que se muestren los mensajes de campo requerido 

  TipoalimentoForm!: FormGroup;
  showTipoError = false; //evitando que se muestren los mensajes de campo requerido 
  editandoTipoAlimento: boolean = false; // Variable para indicar si se está editando un alimento existente
  idTipoAlimentoEditar: string = ''; // Variable para almacenar el ID del alimento en caso de edición

  constructor(
    private http: HttpClient,
    private AlimentosService: AlimentosService,

    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.getAlltipoalimento();
    this.getAllalimento();
  }
  showMoreOptions: boolean = false;
  selectedOption: any = null;

  toggleShowMoreOptions() {
    this.showMoreOptions = !this.showMoreOptions;
  }
  selectOption(item: any) {
    this.selectedOption = item;
    this.showMoreOptions = false;

    // Update the form control with the selected option's ID
    this.alimentoForm.get('id_tipoalimento')?.setValue(item.id);
  }
  getSelectedOptionLabel() {
    return this.selectedOption ? this.selectedOption.tipo : 'Seleccione  ';
  }
  //cargar los datos de la seleccion de la tabla  en la modal

  ngOnInit() {
    this.getAllalimento();
    this.alimentoForm = this.formBuilder.group({
      descripcion: new FormControl("", [Validators.required, Validators.minLength(3)]),
      id_tipoalimento: new FormControl("", [Validators.required, Validators.maxLength(1)])
    });


    this.getAlltipoalimento();
    this.TipoalimentoForm = this.formBuilder.group({
      tipo: new FormControl("", [Validators.required, Validators.minLength(3)])
    });
  }

  //Modal cuando los datos se agg Notificacion
  title = 'sweetAlert';
  showModal() {
    swal2({
      title: 'Datos registrado exitosamente',
      icon: "success",
    });
  }

  //Modal cuando los datos No se agg error de Notificacion

  showModalError() {
    swal({
      title: 'Error de registro de datos ',
      icon: "error",

    });
  }

  //Modal cuando se modifica datos  Notificacion

  showModalEdit() {
    swal2({
      title: 'Datos modificado exitosamente',
      icon: "success",
    });
  }

  //Modal de  error de Modificacion  datos Notificacion

  showModalErrorEdit() {
    swal({
      title: 'Error de modificación de datos ',
      icon: "error",
    });
  }


  //registrar el id tipo alimento el nuevo que se selecciona y enviarlo a la data
  getId_Tipoalimento() {
    this.http
      .get("http://localhost:3000/api/creartipo_alimento?=" + this.id_tipoalimento)
      .subscribe((result: any) => {
        this.tipoalimentosss = result.alimentos;
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

  //obtener todos los alimentos 
  getAllalimento() {
    this.AlimentosService.getalimentos().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.alimentos);
        this.alimentosss = res.alimentos;
      },
      error: (err) => {
        //alert("Error en la carga de datos");
      },
    });
  }

  //Para el registro de alimento usando modal
  nuevoCurso() {
    this.tituloForm = 'Registro de Alimento'; // cambio de nombre en el encabezado
    this.alimentoForm.reset();
    this.editandoAlimento = false;
    this.idAlimentoEditar = '';

    // Restablecer la opción seleccionada y borrar el valor del campo de formulario
    this.selectedOption = null;
    this.alimentoForm.get('id_tipoalimento')?.setValue(null);

    // Establecer variables a false al editar
    this.showDescripcionError = false;
    this.showIdTipoalimentoError = false;
  }

  //Para el registro de alimento usando modal
  nuevaModaltipoAlimento() {
    this.titulo2Form = 'Registro de Tipo Alimento'; // cambio de nombre en el encabezado
    this.TipoalimentoForm.reset();
    this.editandoTipoAlimento = false;
    this.idTipoAlimentoEditar = '';

    // Restablecer la opción seleccionada y borrar el valor del campo de formulario
    this.selectedOption = null;
    this.TipoalimentoForm.get('id_tipoalimento')?.setValue(null);

    // Establecer variables a false al editar
    this.showTipoError = false;

  }

  //Para el editar de plato usando modal
  editarAlimento(item: any) {
    this.tituloForm = 'Editar  Alimento'; //editando encabezado
    //obteniendo los campos llenos segun su id
    this.alimentoForm.patchValue({
      descripcion: item.descripcion,
      id_tipoalimento: item.tipo_alimento.id
    });
    this.selectedOption = { tipo: item.tipo_alimento.tipo, id: item.tipo_alimento.id };
    this.getId_Tipoalimento();
    this.editandoAlimento = true;
    this.idAlimentoEditar = item.id;

    // Establecer variables a false al editar
    this.showDescripcionError = false;
    this.showIdTipoalimentoError = false;
  }


  // Registro de alimento...
  addAlimento() {
    if (this.alimentoForm.valid) {
      this.showDescripcionError = false;
      this.showIdTipoalimentoError = false;

      const datos = {
        descripcion: this.alimentoForm.value.descripcion,
        id_tipoalimento: this.alimentoForm.value.id_tipoalimento
      };
      //Registrar Alimento ----------------------------
      if (!this.editandoAlimento) {
        this.AlimentosService.guardar(datos).subscribe(
          (alimentos) => {
            console.log(alimentos);
            this.showModal();
            this.getAllalimento(); // Actualizar la tabla después de agregar un alimento
            this.alimentoForm.reset(); //Borre los campos del formulario después de un registro exitoso
            this.alimentoForm.get('id_tipoalimento')?.setValue(''); // Establezca id_tipoalimento en vacío después de un registro exitoso
            this.selectedOption = null; //Restablezca la opción seleccionada a nula, configurando efectivamente el menú desplegable de nuevo en "Seleccionar"
          },
          (error) => {
            console.log(error);
            this.showModalError();
          }
        );
      } else {
        // Modificar Alimento -----------------------------
        this.AlimentosService.guardar(datos, this.idAlimentoEditar).subscribe(
          (alimento) => {
            console.log(alimento);
            this.showModalEdit();
            this.nuevoCurso(); // Restablecer el formulario después de editar
            this.getAllalimento();
          },
          (error) => {
            console.log(error);
            this.showModalErrorEdit();
          }
        );
      }
    } else {
      this.showDescripcionError = this.alimentoForm.controls.descripcion.invalid;
      this.showIdTipoalimentoError = this.alimentoForm.controls.id_tipoalimento.invalid;
    }
  }


  //registro de tipo alimento
  addtipoAlimento() {
    if (this.TipoalimentoForm.valid) {
      this.showTipoError = false;

      const datos = {
        tipo: this.TipoalimentoForm.value.tipo
      };

        // Registro tipo de Alimento -----------------------------
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
        // Modificar tipo de Alimento -----------------------------
        this.AlimentosService.guardartiposalimentos(datos, this.idTipoAlimentoEditar).subscribe(
          (tipo_alimentos) => {
            console.log(tipo_alimentos);
            this.showModalEdit();
            this.nuevaModaltipoAlimento(); // Restablecer el formulario después de editar
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
      title: '¿Estás seguro que deseas eliminar el alimento?',
      icon: 'warning',
      showCancelButton: true,

      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#bf0d0d',


    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarAlimento(id);
      }
    });
  }


  showModalErrorEliminar() {
    Swal.fire({
      title: 'Error al eliminar el alimento',
      icon: 'error',
    });
  }

  eliminarAlimento(id: number) {
    this.AlimentosService.deletealimentos(id).subscribe({
      next: (res) => {
        Swal.fire({
          title: 'Datos eliminados exitosamente',
          icon: 'success',
        }).then(() => {
          this.getAllalimento();
        });
      },
      error: () => {
        this.showModalErrorEliminar();
      },
    });
  }

  // Restablecer el formulario cuando se cierre el modal
  closeModal() {
    this.alimentoForm.reset();
    this.editandoAlimento = false;
    this.idAlimentoEditar = '';
  }

}
