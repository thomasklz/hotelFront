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
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let idUsuario = localStorage.getItem("idUsuario");
      if(idUsuario){
        this.router.navigate(['/home']);
        return false;
      }else{
        return true;
      }
  }
  
}