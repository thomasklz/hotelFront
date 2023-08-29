import { Component, OnInit } from '@angular/core';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Panel',  icon: 'dashboard', class: '' },
    { path: '/user-profile', title: 'Crear Usuario',  icon:'person_add', class: '' },
    { path: '/platos', title: 'Crear Platos',  icon:'local_dining', class: '' },
    { path: '/tipoalimentos', title: 'Crear Tipo Alimentos',  icon:'circle', class: '' },
 
    { path: '/pesos', title: 'Crear Pesos',  icon:'scale', class: '' },
    { path: '/ingredientes', title: 'Crear Ingredientes',  icon:'list_alt', class: '' },

    { path: '/menu', title: 'Crear Menú',  icon:'content_paste', class: '' },
    { path: '/creditos', title: 'Crear Créditos',  icon:'credit_card', class: '' },
   
  
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}
