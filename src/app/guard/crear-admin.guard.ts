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
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Observable<boolean>((observer) => {
      this.UsuarioService.getusua().subscribe({
        next: (res) => {
          this.dataSource = new MatTableDataSource(res.usuarios);
          this.usuariosss = res.usuarios;
          this.hayUsuarios = this.usuariosss.length > 0;
  
          // Verifica si hayUsuarios es true (hay al menos un usuario)
          if (this.hayUsuarios) {
            observer.next(false); // Deniega el acceso a la ruta crearAdministrador
          } else {
            observer.next(true); // Permite el acceso a la ruta crearAdministrador
          }
          observer.complete();
        },
        error: (err) => {
          // Maneja el error adecuadamente
          observer.next(false); // En caso de error, deniega el acceso a la ruta crearAdministrador
          observer.complete();
        },
      });
    });
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