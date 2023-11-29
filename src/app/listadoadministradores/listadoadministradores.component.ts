import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'app/servicios/usuario.service';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-listadoadministradores',
  templateUrl: './listadoadministradores.component.html',
  styleUrls: ['./listadoadministradores.component.scss']
})
export class ListadoadministradoresComponent implements OnInit {
  usuariosss: any[] = [];

  dataSource = new MatTableDataSource<any>();
  constructor(private UsuarioService:UsuarioService) { }

  ngOnInit(): void {
    this.getAllusuarios();
  }
    //obtener todos los usuarios 
    getAllusuarios() {
      this.UsuarioService.getlistadoadministradores().subscribe({
        next: (res) => {
          this.dataSource = new MatTableDataSource(res.usuarios);
          this.usuariosss = res.usuarios;
          this.totalItems = res.usuariosss.length; 
        },
        error: (err) => {
          // alert("Error en la carga de datos");
        },
      });
    }
     //PAGINATOR------------------------------
  pageSize = 10; // Tamaño de la página
  currentPage = 1; // Página actual
  totalItems = 0; // Total de elementos

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
    return this.usuariosss.slice(this.startIndex, this.endIndex + 1);
  }

  
  onPageChange(event: number) {
    this.currentPage = event;
  }

  usuariosssOriginal: any[] = [];

  nombreproductoFiltro: string = '';
  filtroSeleccionado: string = ''; 
  //filtrado
  aplicarFiltros() {
    // Aplica los filtros aquí según el valor de filtroSeleccionado
    if (this.filtroSeleccionado === 'nombre') {
      // Aplica el filtro por nombre
      if (this.nombreproductoFiltro) {
        this.usuariosss = this.usuariosssOriginal.filter(item => item.persona.nombre.includes(this.nombreproductoFiltro));
      } else {
        this.usuariosss = [...this.usuariosssOriginal];
      }
      // Limpia el filtro de fecha
     
    }
  }

}
