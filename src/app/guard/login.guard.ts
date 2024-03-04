import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private router: Router, private location: Location) {}


  


  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const idUsuario = localStorage.getItem('idUsuario');
    
    if (idUsuario) {
      return true;
    } else {
      // No hay usuario autenticado, redirigir a la página de login
      this.router.navigate(['/login']);
      return false;
    }
  }
}
