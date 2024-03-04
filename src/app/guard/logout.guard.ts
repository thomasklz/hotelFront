import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router,RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LogoutGuard implements CanActivate {
  idUsuario: number;
  location: Location;
  

  constructor(location: Location,private router: Router) {     this.idUsuario = +localStorage.getItem('idUsuario');   this.location = location;}
 
  
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const idUsuario = localStorage.getItem('idUsuario');
    
    if (!idUsuario) {
      return true;
    } else {
      // Hay un usuario autenticado, redirigir a la página principal
      this.router.navigate(['/']);
      return false;
    }
  }
  
}