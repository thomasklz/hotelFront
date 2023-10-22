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
    { path: '/user-profile', title: ' Usuario',  icon:'person_add', class: '' },
    { path: '/alimentos', title: '  Productos',  icon:'circle', class: '' },

    { path: '/platos', title: ' Menú',  icon:'local_dining', class: '' },
    { path: '/productosplato', title: ' Productos y  plato',  icon:'content_paste', class: '' },

    { path: '/menu', title: ' Menú diario',  icon:'content_paste', class: '' },
 
  

    
   /*  { path: '/pesos', title: 'Crear Pesos',  icon:'scale', class: '' }, */
    { path: '/ingredientes', title: ' Ingredientes',  icon:'list_alt', class: '' },

  
    { path: '/creditos', title: ' Créditos',  icon:'credit_card', class: '' },
   
  
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
