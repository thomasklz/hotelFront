import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { AlimentosService } from "app/servicios/alimentos.service";
import { MatTableDataSource } from "@angular/material/table";
import { Console } from "console";

@Component({
  selector: "app-reporteproducto",
  templateUrl: "./reporteproducto.component.html",
  styleUrls: ["./reporteproducto.component.scss"],
})
export class ReporteproductoComponent implements OnInit {
  alimentoss: any[] = [];
  ingredientesdiass: any[] = [];
  ingredientesForm!: FormGroup;
  dataSource = new MatTableDataSource<any>();
  ingredientesdiasssOriginal: any[] = [];
  idAlimento: string = "";

  constructor(private AlimentosService: AlimentosService,private formBuilder:FormBuilder) {}


  ngOnInit(): void {
    this.getAllalimentos();

    this.ingredientesForm = this.formBuilder.group({
      id_alimento:new FormControl("", [
        Validators.required,
      ]), 
      fecha: new FormControl("", [
        Validators.required,
      ]),
    });
    
  }

  alimentoSeleccionado: { id: number | null; descripcion: string } = {
    id: null,
    descripcion: "",
  };

  updateAlimentoId(event: any) {
    const descripcion = event.target.value;
    const alimentoSeleccionado = this.alimentoss.find(
      (alimento) => alimento.descripcion === descripcion
    );
    if (alimentoSeleccionado) {
      this.idAlimento = alimentoSeleccionado.id; // Asignar el ID del alimento seleccionado
    } else {
      this.idAlimento = null; // O asigna un valor adecuado cuando no se encuentra un alimento
    }
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

  //Filtros
  diaFiltro: string = "";
  filtroSeleccionado: string = "";
  semanaFiltro: string = "";
  mesFiltro: string = "";

  aplicarFiltros() {
    if (this.filtroSeleccionado === "dia") {
      // Aplica el filtro por nombre y restablece el filtro de fecha
      this.diaFiltro = "";
    } else if (this.filtroSeleccionado === "semana") {
      // Si se selecciona el filtro de fecha, vacía el filtro de nombre
      this.semanaFiltro = "";
    } else if (this.filtroSeleccionado === "mes") {
      // Si se selecciona el filtro de fecha, vacía el filtro de nombre
      this.mesFiltro = "";
    }

  
  }

  
  fechaSeleccionada: string | null = null;


 

  buscarIngredientePorId() {
    console.log("id " + this.idAlimento);
    console.log("fecha " + this.fechaSeleccionada);
    this.ingredientesdiass = [];
    if (this.idAlimento && this.fechaSeleccionada) {
      const fecha = this.fechaSeleccionada;
  
      // Realiza la solicitud HTTP para buscar ingredientes por ID y fecha
      this.AlimentosService.obtenerfiltropordias(fecha, this.idAlimento).subscribe({
        next: (res: any) => {
          if (res && res.ingredientesTotalesdia) {
            if (res.ingredientesTotalesdia.length === 0) {
              console.log("No se encontraron ingredientes para esta fecha y alimento.");
            } else {
              // Aquí puedes mostrar la descripción del alimento y la fecha
              console.log("Descripción del alimento:", res.id_alimento);
              console.log("Fecha buscada:", res.fecha);
  
              this.ingredientesdiass = res.ingredientesTotalesdia;
              console.log("Resultados del filtro por día:", this.ingredientesdiass);
            }
          } else {
            console.log("La respuesta no contiene ingredientesTotalesdia.");
          }
        },
        error: (err) => {
          console.error(err);
          console.log("Error al obtener datos del servicio.");
        },
      });
    } else {
      console.log("El idAlimento o la fecha no están definidos.");
    }
  }
  
  
  
  
  
  
  


  
}
