import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import swal from 'sweetalert';
import swal2 from 'sweetalert';
import { IngredientesService } from '../servicios/ingredientes.service';
import Swal from 'sweetalert2';
import { MenuService } from 'app/servicios/menu.service';
import { CreditosService } from 'app/servicios/creditos.service';
import { UsuarioService } from '../servicios/usuario.service';

@Component({
  selector: 'app-credito',
  templateUrl: './credito.component.html',
  styleUrls: ['./credito.component.scss']
})
export class CreditoComponent implements OnInit {

  dataSource = new MatTableDataSource<any>();
  id: string = '';
  id_persona: string = '';
  id_plato: string = '';
  personasss: any[] = [];
  platosss: any[] = [];
  creditosss: any[] = [];
  tituloForm;
  creditosForm!: FormGroup;
  editandoCreditos: boolean = false; // Variable para indicar si se está editando un alimento existente
  idCreditosEditar: string = ''; // Variable para almacenar el ID del alimento en caso de edición
  showPrecioError = false; //evitando que se muestren los mensajes de campo requerido 
  showIdplatoError = false;//evitando que se muestren los mensajes de campo requerido 
  showFechaError = false;
  showPagadoError = false;
  showPersonaError = false;
  showCantidadError = false;
  constructor(
    private http: HttpClient,
    private MenuService: MenuService,
    private router: Router,
    private formBuilder: FormBuilder,
    private CreditosService: CreditosService,
    private UsuarioService: UsuarioService,
  ) {
    this.getAllplatos();
    this.getAllpersonas();
    this.getAllcreditos();
  }

  //cargar los datos de la seleccion de la tabla  en la modal
  ngOnInit() {
    this.getAllcreditos();
    this.creditosForm = this.formBuilder.group({
      precio: new FormControl("", [Validators.required, Validators.minLength(1)]),
      id_plato: new FormControl("", [Validators.required, Validators.maxLength(1)]),
      id_persona: new FormControl("", [Validators.required, Validators.maxLength(1)]),
      pagado: new FormControl("", [Validators.required, Validators.minLength(1)]),
      fecha: new FormControl("", [Validators.required, Validators.minLength(1)]),
      cantidad: new FormControl("", [Validators.required, Validators.minLength(1)]),
    });
  }
  showMoreOptionsplato: boolean = false;
  showMoreOptionspersona: boolean = false;


  selectedOptionplato: any = null;
  selectedOptionpersona: any = null;

  toggleShowMoreOptionsplato() {
    this.showMoreOptionsplato = !this.showMoreOptionsplato;
  }
  toggleShowMoreOptionspersona() {
    this.showMoreOptionspersona = !this.showMoreOptionspersona;
  }

  selectOptionplato(item: any) {
    this.selectedOptionplato = item;
    this.showMoreOptionsplato = false;
    // Asignar el valor del ID del plato seleccionado al formulario
    this.creditosForm.get('id_plato')?.setValue(item.id);
  }

  selectOptionpersona(item: any) {
    this.selectedOptionpersona = item;
    this.showMoreOptionspersona = false;

    // Asignar el valor del ID del alimento seleccionado al formulario
    this.creditosForm.get('id_persona')?.setValue(item.id);
  }

  getSelectedOptionLabelplato() {
    return this.selectedOptionplato ? this.selectedOptionplato.descripcion : 'Seleccione  ';
  }

  getSelectedOptionLabelpersona() {
    return this.selectedOptionpersona ? this.selectedOptionpersona.nombre : 'Seleccione  ';
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
        this.platosss = result.creditos;
      });
  }

  //registrar el id persona el nuevo que se selecciona y enviarlo a la data
  getId_persona() {
    this.http
      .get("http://localhost:3000/api/crearPersona/?=" + this.id_persona)
      .subscribe((result: any) => {
        this.personasss = result.creditos;
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


  getAllpersonas() {
    this.UsuarioService.getpersona().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.personas);
        this.personasss = res.personas;
      },
      error: (err) => {
        // alert("Error en la carga de datos");
      },
    });
  }

  //obtener todos los credito 
  getAllcreditos() {
    this.CreditosService.getcreditos().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.creditos);
        this.creditosss = res.creditos;
      },
      error: (err) => {
        //alert("Error en la carga de datos");
      },
    });
  }

  //Para el registro de plato usando modal
  nuevoCurso() {
    this.tituloForm = 'Registro de Créditos'; //cambio de nombre en el encabezado
    this.creditosForm.reset();
    this.editandoCreditos = false;
    this.idCreditosEditar = '';

    // Reset the selectedOption and clear the form field value
    this.selectedOptionpersona = null;
    this.creditosForm.get('id_persona')?.setValue(null);

    // Reset the selectedOption and clear the form field value
    this.selectedOptionplato = null;
    this.creditosForm.get('id_plato')?.setValue(null);



    // Establecer variables a false al editar
    this.showPersonaError = false;
    this.showFechaError = false;
    this.showIdplatoError = false;
    this.showCantidadError = false;
    this.showPrecioError = false;
    this.showPagadoError = false;
  }
  //Para el editar de credito usando modal

  editarCreditos(item: any) {
    this.tituloForm = 'Editar  Créditos';
    this.creditosForm.patchValue({
      precio: item.precio,
      cantidad: item.cantidad,
      pagado: item.pagado,
      fecha: item.fecha,
      id_plato: item.plato.id,
      id_persona: item.persona.id
    });
    this.selectedOptionpersona = { nombre: item.persona.nombre, id: item.persona.id };
    this.selectedOptionplato = { descripcion: item.plato.descripcion, id: item.plato.id };

    this.getId_plato();
    this.getId_persona();
    this.editandoCreditos = true;
    this.idCreditosEditar = item.id;

    // Establecer variables a false al editar
    this.showPrecioError = false;
    this.showIdplatoError = false;
    this.showPersonaError = false;
    this.showPagadoError = false;
    this.showCantidadError = false;
    this.showFechaError = false;
  }
  // Registro de Credito...

  addCredito() {
    if (this.creditosForm.valid) {
      this.showPrecioError = false;
      this.showIdplatoError = false;
      this.showPersonaError = false;
      this.showPagadoError = false;
      this.showCantidadError = false;
      this.showFechaError = false;

      const datos = {
        precio: this.creditosForm.value.precio,
        cantidad: this.creditosForm.value.cantidad,
        pagado: this.creditosForm.value.pagado,
        fecha: this.creditosForm.value.fecha,
        id_plato: this.creditosForm.value.id_plato,
        id_persona: this.creditosForm.value.id_persona
      };

      if (!this.editandoCreditos) {
        this.CreditosService.guardar(datos).subscribe(
          (result: any) => {
            console.log(result);
            this.showModal();
            this.getAllcreditos(); // Actualizar la tabla después de agregar un ingrediente
            this.creditosForm.reset(); // Restablecer los valores del formulario
          },
          (error) => {
            console.log(error);
            this.showModalError();
          }
        );
      } else {
        // m o d i f i c a r -----------------------------
        this.CreditosService.guardar(datos, this.idCreditosEditar).subscribe(
          (result: any) => {
            console.log(result);
            this.showModalEdit();
            this.nuevoCurso(); // Restablecer el formulario después de editar
            this.getAllcreditos();
          },
          (error) => {
            console.log(error);
            this.showModalErrorEdit();
          }
        );
      }
    } else {
      this.showPrecioError = this.creditosForm.controls.precio.invalid;
      this.showPagadoError = this.creditosForm.controls.pagado.invalid;
      this.showFechaError = this.creditosForm.controls.fecha.invalid;
      this.showCantidadError = this.creditosForm.controls.cantidad.invalid;
      this.showIdplatoError = this.creditosForm.controls.id_plato.invalid;
      this.showPersonaError = this.creditosForm.controls.id_persona.invalid;
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
  //aqui hay que corregir porque no hemos hecho eliminar
  eliminarIngrediente(id: number) {
    this.CreditosService.guardar(id).subscribe({
      next: (res) => {
        Swal.fire({
          title: 'Datos eliminados exitosamente',
          icon: 'success',
        }).then(() => {
          this.getAllcreditos();
        });
      },
      error: () => {
        this.showModalErrorEliminar();
      },
    });
  }
  // Restablecer el formulario cuando se cierre el modal
  closeModal() {
    this.creditosForm.reset();
    this.editandoCreditos = false;
    this.idCreditosEditar = '';
  }

}

