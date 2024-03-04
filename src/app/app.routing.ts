import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './login/login.component';
import { CrearAdministradorComponent } from './crear-administrador/crear-administrador.component';
import { ReporteComponent } from './reporte/reporte.component';
import { PerfilclienteComponent } from './perfilcliente/perfilcliente.component';
import { LoginGuard } from './guard/login.guard';
import { LogoutGuard } from './guard/logout.guard';
import { CrearAdminGuard } from './guard/crear-admin.guard';


 
  const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent, canActivate: [LogoutGuard] },
    { path: 'crearAdministrador', component: CrearAdministradorComponent, canActivate: [CrearAdminGuard] },
    { path: 'reporte', component: ReporteComponent, canActivate: [LoginGuard] },
    { path: 'editardatosperfil', component: PerfilclienteComponent, canActivate: [LoginGuard] },
    {
      path: '',
      component: AdminLayoutComponent,
      canActivate: [LoginGuard],
      children: [
        {
          path: '',
          loadChildren: () => import('./layouts/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule),
        },
      ],
    },
  ];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
