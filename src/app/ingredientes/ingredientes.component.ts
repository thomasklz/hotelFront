import { Component, OnInit,ViewChild  } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { FormBuilder,  FormControl,  FormGroup,  Validators,} from "@angular/forms";
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
import { Observable } from 'rxjs';
import { debounceTime, startWith, map } from 'rxjs/operators';
import { MatAutocomplete } from '@angular/material/autocomplete';



  @Component({
    selector: "app-ingredientes",
    templateUrl: "./ingredientes.component.html",
  
    styleUrls: ["./ingredientes.component.scss"],
  })
  export class IngredientesComponent implements OnInit {
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatAutocomplete) autocomplete: MatAutocomplete;


  id: string = "";
  estado: boolean = true;
  precio: string = "";
  id_peso: string = "";
  id_plato: string = "";
  id_alimento: string[] = [];
  pesosss: any[] = [];
  platosss: any[] = [];
  alimentosss: any[] = [];
  productosplatosss: any[] = [];
  
  productosplato: any[] = [];
  descripcplato: any[] = [];
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

  mostrarTabla: boolean = false;


  filteredToppings: Observable<string[]>;
  @ViewChild('auto') autoCompleteInput: any;

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
    this.getAllAlimentos();
    this.loadPageData();

    this.loadPageDatasss();
    this.getAllPlatosDescripcion();
    this.ingredientesForm = this.formBuilder.group({
      id_plato: ["", [Validators.required, Validators.maxLength(1)]],
      id_alimento: ["", Validators.required],
    });



    
  }
  




        
      

  
    

  // Método para alternar la selección de un ingrediente
  
  

  









  filtrarIngredientes(termino: string): void {
    const terminoLowerCase = termino.toLowerCase();
  
    // Filtrar ingredientes según el término de búsqueda
    this.ingredientesUnicos.forEach((ingrediente) => {
      ingrediente.visible = ingrediente.descripcion.toLowerCase().includes(terminoLowerCase);
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
            this.mostrarTabla = true;
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
      this.ingredientesSeleccionados = [];
      this.id_alimento = [];
      this.getAllplatos(); // Actualizar la lista de ingredientes
      // Otro código necesario
      this.  getAllingredientes();
    });
  }
  

  showModalError() {
    swal({
      title: "Error de registro de datos ",
      icon: "error",
    });
  }

  showModalErrorr() {
    swal({
      title: "Error de registro de datos, ya existe un registro con este plato  ",
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
  ingredientesUnicos: any[] = [];


  getAllAlimentos() {
    this.AlimentosService.getalimentos().subscribe({
      next: (res) => {
        this.alimentoss = res.alimentos;
        this.obtenerIngredientesUnicos();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  obtenerIngredientesUnicos() {
    const uniqueIngredientes = new Set(this.alimentoss.map(ingrediente => ingrediente.descripcion));
    this.ingredientesUnicos = Array.from(uniqueIngredientes).map(descripcion => ({ descripcion }));
  }

  ingredientesSeleccionados: any[] = [];

  // ... tu código existente

/*   seleccionarIngrediente(ingrediente: any) {
    // Verificar si el ingrediente ya está seleccionado
    const index = this.ingredientesSeleccionados.findIndex(i => i.descripcion === ingrediente.descripcion);
    ingrediente.seleccionado = !ingrediente.seleccionado;
    if (index === -1) {
      // Si no está seleccionado, agregarlo a la lista de seleccionados
      this.ingredientesSeleccionados.push(ingrediente);
    } else {
      // Si ya está seleccionado, quitarlo de la lista de seleccionados
      this.ingredientesSeleccionados.splice(index, 1);
    }
  } */
 
  

  seleccionarIngrediente(ingrediente: any) {
    const index = this.ingredientesUnicos.findIndex(
      (i) => i.descripcion === ingrediente.descripcion
    );
    ingrediente.seleccionado = !ingrediente.seleccionado;
  
    if (index !== -1) {
      if (ingrediente.seleccionado) {
        // Asignar un identificador único basado en la posición
        ingrediente.id = index + 1;
      } else {
        // Remover el identificador cuando se deselecciona
        delete ingrediente.id;
      }
    }
  
    // Obtener los identificadores de los ingredientes seleccionados
    this.id_alimento = this.ingredientesUnicos
      .filter((i) => i.seleccionado && i.id !== undefined)
      .map((i) => i.id.toString());
  
    console.log("Identificadores de ingredientes seleccionadossssssssssssss:", this.id_alimento);


    this.ingredientesSeleccionados = this.ingredientesUnicos
    .
 
filter(i => i.seleccionado)
    .
   
map(i => ({ descripcion: i.descripcion }));

  }
  
  
  
  

  getAllPlatosDescripcion() {
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


  getAllingredientes() {
    this.MenuService.obtenerplatosdeproductos().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.platosUnicos);
        this.descripcplato = res.platosUnicos;
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
  






  pageSizes = 10;
  currentPages = 1;
  totalItemss = 0;

  get totalPagess(): number {
    return Math.ceil(this.totalItems / this.pageSizes);
  }

  get startIndexs(): number {
    return (this.currentPages - 1) * this.pageSizes;
  }

  get endIndexs(): number {
    return Math.min(this.startIndexs + this.pageSizes - 1, this.totalItemss - 1);
  }

  get pagedMenuss(): any[] {
    return this.ingredientesUnicos.slice(this.startIndexs, this.endIndexs + 1);
  }

  loadPageDatasss() {
    this.AlimentosService.getalimentos().subscribe({
      next: (res) => {
        this.ingredientesUnicos = res.alimentos;
        this.ingredientesUnicos= res.alimentos;
        this.totalItemss = res.alimentos.length;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }


  loadPageData() {
    this.MenuService.gettplato().subscribe({
      next: (res) => {
        this.productosplatosss = res.productosplato;
        this.ingredientesUnicos= res.productosplato;
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
    this.mostrarTabla = false;
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
    this.getAllAlimentos();
    this.ingredientesSeleccionados = [];

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
    console.log('Form Values:', this.ingredientesForm.value);
  
    if (this.ingredientesForm.valid) {
      this.showIdplatoError = false;
      this.showIdalimentoError = false;
  
      // Extracting selected ingredient ids
      const id_alimento = this.ingredientesUnicos
        .filter((ingrediente) => ingrediente.seleccionado && ingrediente.id !== undefined)
        .map((ingrediente) => ingrediente.id.toString());
  
      // Ensure id_alimento is not an empty array
      if (id_alimento.length === 0) {
        console.error('No ingredients selected');
        return;
      }
  
      const datos = {
        id_plato: this.ingredientesForm.value.id_plato,
        id_alimentos: id_alimento, // Use the correct field name expected by the server
      };
  
      this.getAllAlimentos();
  
      if (!this.editandoIngredientes) {
        this.IngredientesService.guardarproductosconsuplato(datos).subscribe(
          (result: any) => {
            this.showModal();
            this.ingredientesForm.reset();
            this.platoSeleccionado.descripcion = "";
            this.alimentoSeleccionado.descripcion = "";
          },
          (error) => {
           this.showModalErrorr();
  
            if (error.status === 400) {
              console.error('Server responded with a 400 Bad Request. Error message:', error.error.message);
              this.showIdplatoError = true; // Set to true to indicate the error
            } else {
              console.error('Unhandled error. Response:', error);
              this.showModalError();
            }
          }
        );
      } else {
        this.IngredientesService.guardarproductosconsuplato(
          datos,
          this.idIngredientesEditar
        ).subscribe(
          (result: any) => {
            this.showModalEdit();
            this.nuevoCurso();
          },
          (error) => {
            console.error('Error while making the HTTP request:', error);
  
            if (error.status === 400) {
              console.error('Server responded with a 400 Bad Request. Error message:', error.error.message);
              this.showIdplatoError = true; // Set to true to indicate the error
            } else {
              console.error('Unhandled error. Response:', error);
              this.showModalErrorEdit();
            }
          }
        );
      }
    } else {
      this.showModalError();
      console.log('Form is invalid. Validation errors:', this.ingredientesForm.errors);
      this.showIdplatoError = this.ingredientesForm.controls.id_plato.invalid;
      this.showIdalimentoError = this.ingredientesForm.controls.id_alimento.invalid;
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
    this.IngredientesService.deleteproductoPlato(id).subscribe({
      next: (res) => {
        Swal.fire({
          title: "Datos eliminados exitosamente",
          icon: "success",
        }).then(() => {
           this.buscarIngredientePorId();
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
    this.ingredientesSeleccionados = [];


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
