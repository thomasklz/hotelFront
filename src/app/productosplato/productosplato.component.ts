import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { MatTableDataSource } from "@angular/material/table";
import swal from "sweetalert";
import swal2 from "sweetalert";
import Swal from "sweetalert2";
import { IngredientesService } from "../servicios/ingredientes.service";
import { AlimentosService } from "app/servicios/alimentos.service";
import { MenuService } from "app/servicios/menu.service";
import { PesosService } from "app/servicios/pesos.service";
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-productosplato',
  templateUrl: './productosplato.component.html',
  styleUrls: ['./productosplato.component.scss']
})
export class ProductosplatoComponent implements OnInit {
  dataSource = new MatTableDataSource<any>();
  id: string = "";
  estado: boolean = true;
  precio: string = "";
  id_peso: string = "";
  id_plato: string = "";
  id_alimento: string = "";
  pesosss: any[] = [];
  platosss: any[] = [];
  alimentosss: any[] = [];
  productosplatosss: any[] = [];
  
  productosplato: any[] = [];
  alimentoss: any[] = [];
  ingredientedescripcionsss: any[] = [];
  tituloForm;
  ingredientId: string = "";
  platoId: string = "";
  ingredientesForm!: FormGroup;
  platos!: FormGroup;
  editandoIngredientes: boolean = false;
  idIngredientesEditar: string = "";
  showIdplatoError = false;
  showCantidadPersonaError = false;
  showIdalimentoError = false;
  showIdPlatoError = false;
  showAlimentoError = false;
  showDiasError = false;
  showPrecioError = false;
  platoDescripcion: string = "";
  alimentoDescripcion: string = "";
  showMoreOptionsplato: boolean = false;
  showMoreOptionsalimento: boolean = false;
  selectedOptionplato: any = null;
  selectedOptionalimento: any = null;

  constructor(
    private http: HttpClient,
    private IngredientesService: IngredientesService,
    private AlimentosService: AlimentosService,
    private MenuService: MenuService,
    private PesosService: PesosService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.getAllplatos();
  }

  ngOnInit() {
    this.getAllingredientes();
    this.getAllalimentos();
    this.loadPageData();
    this.ingredientesForm = this.formBuilder.group({
      id_plato: new FormControl("", [
        Validators.required,
        Validators.maxLength(1),
      ]),
      id_alimento: new FormControl("", [
        Validators.required,
        Validators.maxLength(1),
      ]),
    });
  }

  botonBuscarPresionado = false;

  buscarIngredientePorId() {
    this.productosplatosss = [];

    if (this.ingredientId) {
      this.IngredientesService.getproductosporid(this.ingredientId).subscribe({
        next: (res: any) => {
          if (res.productosplato.length === 0) {
            this.showModalErrorsindatos();
          } else {
            this.productosplatosss = res.productosplato;
          }
        },
        error: (err) => {
          console.error(err);
          this.showModalErrorsindatos();
        },
      });

      this.buscarDescripcionporId();
    } else {
      this.ingredientedescripcionsss = [];
    }
  }

  buscarDescripcionporId() {
    if (this.ingredientId) {
      this.IngredientesService.getobtenerDescripcionPlatoproductos(
        this.ingredientId
      ).subscribe({
        next: (res: any) => {
          this.ingredientedescripcionsss = res.productosplato;

          if (this.ingredientedescripcionsss.length === 0) {
            this.ingredientedescripcionsss = [];
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
    } else {
      this.ingredientedescripcionsss = [];
    }
  }

  platoSeleccionado: { id: number | null; descripcion: string } = {
    id: null,
    descripcion: "",
  };

  alimentoSeleccionado: { id: number | null; descripcion: string } = {
    id: null,
    descripcion: "",
  };

  updatePlatoId(event: any) {
    const descripcion = event.target.value;
    const platoSeleccionado = this.productosplato.find(
      (plato) => plato.descripcion === descripcion
    );
    this.platoSeleccionado = platoSeleccionado || {
      id: null,
      descripcion: descripcion,
    };
    this.ingredientesForm.get("id_plato")?.setValue(this.platoSeleccionado.id);
  }

  updateAlimentoId(event: any) {
    const descripcion = event.target.value;
    const alimentoSeleccionado = this.alimentoss.find(
      (alimento) => alimento.descripcion === descripcion
    );
    this.alimentoSeleccionado = alimentoSeleccionado || {
      id: null,
      descripcion: descripcion,
    };
    this.ingredientesForm
      .get("id_alimento")
      ?.setValue(this.alimentoSeleccionado.id);
  }

  showModal() {
    swal2({
      title: 'Datos registrado exitosamente',
      icon: 'success',
    }).then(() => {
      window.location.reload();
    });
  }

  showModalError() {
    swal({
      title: "Error de registro de datos ",
      icon: "error",
    });
  }

  showModalErrorsindatos() {
    swal({
      title: "No existen ingredientes para ese plato",
      icon: "error",
    });
  }

  showModalEdit() {
    swal2({
      title: "Datos modificado exitosamente",
      icon: "success",
    });
  }

  showModalErrorEdit() {
    swal({
      title: "Error de modificación de datos ",
      icon: "error",
    });
  }

  getAllplatos() {
    this.MenuService.gettplatoselect().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.plato);
        this.platosss = res.plato;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  getAllalimentos() {
    this.AlimentosService.getalimentos().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.alimentos);
        this.alimentoss = res.alimentos;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  getAllingredientes() {
    this.MenuService.gettplato().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.platos);
        this.productosplato = res.platos;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  pageSize = 10;
  currentPage = 1;
  totalItems = 0;

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
    return this.productosplatosss.slice(this.startIndex, this.endIndex + 1);
  }

  loadPageData() {
    this.MenuService.gettplato().subscribe({
      next: (res) => {
        this.productosplatosss = res.productosplato;
        this.totalItems = res.productosplato.length;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  onPageChange(event: number) {
    this.currentPage = event;
  }

  nuevoCurso() {
    this.tituloForm = "Registro de ingredientes";
    this.cdr.detectChanges();

    this.ingredientesForm.reset();
    this.editandoIngredientes = false;
    this.idIngredientesEditar = "";

    this.selectedOptionalimento = null;
    this.ingredientesForm.get("id_alimento")?.setValue(null);

    this.selectedOptionplato = null;
    this.ingredientesForm.get("id_plato")?.setValue(null);

    this.showIdalimentoError = false;
    this.showIdplatoError = false;
    this.showAlimentoError = false;
    this.showCantidadPersonaError = false;
    this.showDiasError = false;
    this.getAllalimentos();
  }

  editarIngrediente(item: any) {
    this.tituloForm = "Editar ingredientes";
    this.ingredientesForm.patchValue({
      precio: item.precio,
      cantidadPersona: item.cantidadPersona,
      numDias: item.numDias,
      id_plato: item.id_plato,
      id_alimento: item.id_alimento,
    });

    if (item.plato && item.plato.descripcion) {
      this.platoSeleccionado = {
        id: item.id_plato,
        descripcion: item.plato.descripcion,
      };
    } else {
      this.platoSeleccionado = {
        id: null,
        descripcion: "",
      };
    }

    if (item.alimento && item.alimento.descripcion) {
      this.alimentoSeleccionado.descripcion = item.alimento.descripcion;
      this.selectedOptionalimento = {
        descripcion: item.alimento.descripcion,
        id: item.id_alimento,
      };
    }

    this.editandoIngredientes = true;
    this.idIngredientesEditar = item.id;

    this.showIdplatoError = false;
    this.showPrecioError = false;
    this.showIdalimentoError = false;
    this.showDiasError = false;
    this.showCantidadPersonaError = false;
  }

  addIngredientes() {
    if (this.ingredientesForm.valid) {
      this.showIdplatoError = false;
      this.showPrecioError = false;
      this.showIdalimentoError = false;
      this.showDiasError = false;
      this.showCantidadPersonaError = false;

      const datos = {
        id_plato: this.ingredientesForm.value.id_plato,
        id_alimento: this.ingredientesForm.value.id_alimento,
      };

      this.getAllalimentos();

      if (!this.editandoIngredientes) {
        this.IngredientesService.guardarproductosconsuplato(datos).subscribe(
          (result: any) => {
            this.showModal();
            this.ingredientesForm.reset();
            this.platoSeleccionado.descripcion = "";
            this.alimentoSeleccionado.descripcion = "";
          },
          (error) => {
            console.error(error);
            this.showModalError();
          }
        );
      } else {
        this.IngredientesService.guardarproductosconsuplato(
          datos, this.idIngredientesEditar
        ).subscribe(
          (result: any) => {
            this.showModalEdit();
            this.nuevoCurso();
          },
          (error) => {
            console.error(error);
            this.showModalErrorEdit();
          }
        );
      }
    } else {
      this.showPrecioError = this.ingredientesForm.controls.precio.invalid;
      this.showIdplatoError = this.ingredientesForm.controls.id_plato.invalid;
      this.showIdalimentoError =
        this.ingredientesForm.controls.id_alimento.invalid;
      this.showDiasError = this.ingredientesForm.controls.numDias.invalid;
      this.showCantidadPersonaError =
        this.ingredientesForm.controls.cantidadPersona.invalid;
    }
  }

  showModalEliminar(id: any) {
    Swal.fire({
      title: "¿Estás seguro que deseas eliminar el ingrediente?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#bf0d0d",
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarIngrediente(id);
      }
    });
  }

  showModalErrorEliminar() {
    Swal.fire({
      title: "Error al eliminar el alimento",
      icon: "error",
    });
  }

  eliminarIngrediente(id: number) {
    this.IngredientesService.deleteingrediente(id).subscribe({
      next: (res) => {
        Swal.fire({
          title: "Datos eliminados exitosamente",
          icon: "success",
        }).then(() => {
          // this.getAllingredientes();
        });
      },
      error: () => {
        this.showModalErrorEliminar();
      },
    });
  }

  closeModal() {
    this.ingredientesForm.reset();
    this.editandoIngredientes = false;
    this.idIngredientesEditar = "";
  }

  resetForm() {
    this.ingredientesForm.reset();
    this.editandoIngredientes = false;
    this.idIngredientesEditar = "";

    this.platoSeleccionado = { id: null, descripcion: "" };
    this.alimentoSeleccionado = { id: null, descripcion: "" };

    this.showIdplatoError = false;
    this.showPrecioError = false;
    this.showIdalimentoError = false;
    this.showDiasError = false;
    this.showCantidadPersonaError = false;
  }

  closeModalAfterSave() {
    this.resetForm();
  }

  closeModalAfterCancel() {
    this.resetForm();
  }
}
