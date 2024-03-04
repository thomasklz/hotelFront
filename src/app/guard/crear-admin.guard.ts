import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { UsuarioService } from 'app/servicios/usuario.service';
import { MatTableDataSource } from '@angular/material/table';

@Injectable({
  providedIn: 'root'
})
export class CrearAdminGuard implements CanActivate {
  dataSource = new MatTableDataSource<any>();
  usuariosss: any[] = [];
  hayUsuarios: boolean = false;

  constructor(private router: Router, private UsuarioService: UsuarioService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
      // Llama a getAllusuarios dentro de canActivate para obtener los usuarios antes de verificar
      this.getAllusuarios();

      // Verifica si hayUsuarios es true (hay al menos un usuario)
      if (this.hayUsuarios) {
        return false; // No permitir el acceso a la ruta crearAdministrador
      } else {
        return true; // Permitir el acceso a la ruta crearAdministrador
      }
  }

  getAllusuarios() {
    this.UsuarioService.getusua().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.usuarios);
        this.usuariosss = res.usuarios;
        this.hayUsuarios = this.usuariosss.length > 0;
      },
      error: (err) => {
        // Maneja el error adecuadamente
      },
    });
  }
}
