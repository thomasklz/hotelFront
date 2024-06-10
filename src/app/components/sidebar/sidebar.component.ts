import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
 
  { path: '/panelAdministrador', title: ' Administrador',  icon:'admin_panel_settings', class: '' },

  
   { path: '/menus_Diarios', title: ' Menús diarios',  icon:'content_paste', class: '' },

   { path: '/creditos', title: ' Créditos',  icon:'credit_card', class: '' },
  { path: '/reportePolitecnico', title: ' Reportes',  icon:'analytics', class: '' },
    
  
  
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  currentRoute: string;
  constructor(private router: Router) {
    this.currentRoute = this.router.url;
   }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);

      
this.router.events.subscribe(event => {
      
 
  if (event instanceof NavigationEnd) {
          
         
  
   
  this.currentRoute = this.router.url;
        }
      });
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };

  // Function to check if a route is the current active route
  
 
isActiveRoute(route: string): boolean {
    
    
return this.currentRoute === route;
  }
}
