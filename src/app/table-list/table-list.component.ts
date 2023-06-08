import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MenuService } from 'app/servicios/menu.service';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {
  dataSource = new MatTableDataSource<any>();
  id: string = '';
  estado: boolean = true;
  descripcion: string = '';
  id_tipomenu: string = '';
  tipomenusss: any[] = [];
  platosss: any[] = [];
  tituloForm;
  menuForm!: FormGroup;
  editandoPlato: boolean = false; // Variable para indicar si se está editando un plato existente
  idPlatoEditar: string = ''; // Variable para almacenar el ID del plato en caso de edición

  constructor(
    private http: HttpClient,
    private MenuService: MenuService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.getAlltipomenu();
    this.getAllplato();
  }
//registrar el id tipo menu el nuevo que se selecciona y enviarlo a la data
  getId_Tipomenu() {
    this.http
      .get("http://localhost:3000/api/creartipo_menu?=" + this.id_tipomenu)
      .subscribe((result: any) => {
        this.tipomenusss = result.platos;
      });
  }
//cargar los datos de la seleccion de la tabla  en la modal
  ngOnInit() {
    this.getAllplato();
    this.menuForm = this.formBuilder.group({
      descripcion: new FormControl("", Validators.minLength(3)),
      id_tipomenu: new FormControl("", Validators.maxLength(1))
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
        alert("Error en la carga de datos");
      },
    });
  }
//obtener todos los platos 
  getAllplato() {
    this.MenuService.gettplato().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.platos);
        this.platosss = res.platos;
      },
      error: (err) => {
        alert("Error en la carga de datos");
      },
    });
  }


//Para el registro de plato usando modal
  nuevoCurso() {
    this.tituloForm = 'Registro de Menu'; //cambio de nombre en el encabezado
    this.menuForm.reset();
    this.editandoPlato = false;
    this.idPlatoEditar = '';
  }
//Para el editar de plato usando modal

  editarPlato(item: any) {
    this.tituloForm = 'Editar  Menu';
    this.menuForm.patchValue({
      descripcion: item.descripcion,
      id_tipomenu: item.tipo_menu.id
    });
    this.getId_Tipomenu();
    this.editandoPlato = true;
    this.idPlatoEditar = item.id;
  }

  addMenu() {
    const datos = {
      descripcion: this.menuForm.value.descripcion,
      id_tipomenu: this.menuForm.value.id_tipomenu
    };

    if (!this.editandoPlato) {
      this.MenuService.guardar(datos).subscribe(
        (platos) => {
          console.log(platos);
          alert('Registrado correctamente');
          this.getAllplato(); // Actualizar la tabla después de agregar un menú
        },
        (error) => {
          console.log(error);
          alert('Error al guardar');
        }
      );
    } else {
      this.MenuService.guardar(datos, this.idPlatoEditar).subscribe(
        (plato) => {
          console.log(plato);
          alert('Modificado correctamente');
          this.nuevoCurso(); // Restablecer el formulario después de editar
          this.getAllplato();
        },
        (error) => {
          console.log(error);
          alert('Error al guardar');
        }
      );
    }
  }

  eliminarPlato(id: number) {
    this.MenuService.deleteplato(id).subscribe({
      next: (res) => {
        alert("Plato eliminado correctamente");
        this.getAllplato();
      },
      error: () => {
        alert("Error al eliminar plato")
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
