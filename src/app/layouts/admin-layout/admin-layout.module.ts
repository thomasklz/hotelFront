import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatRippleModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import { ReportePolitecnicoComponent } from 'app/reporte-politecnico/reporte-politecnico.component';
import { ListadoUsuariosComponent } from 'app/listado-usuarios/listado-usuarios.component';
import { ConfiguracionPrivacidadComponent } from 'app/configuracion-privacidad/configuracion-privacidad.component';
import { AyudaComponent } from 'app/ayuda/ayuda.component';
import { AlimentosComponent } from 'app/alimentos/alimentos.component';
import { IngredientesComponent } from 'app/ingredientes/ingredientes.component';
import { PlatosComponent } from 'app/platos/platos.component';
import { MenuComponent } from 'app/menu/menu.component';
import { CreditoComponent } from 'app/credito/credito.component';
import { TipoalimentosComponent } from 'app/tipoalimentos/tipoalimentos.component';
import { PesosComponent } from 'app/pesos/pesos.component';
import { CantidadplatosComponent } from 'app/cantidadplatos/cantidadplatos.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatTableModule,
    MatIconModule
  
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TableListComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    UpgradeComponent,
    ReportePolitecnicoComponent,
   ListadoUsuariosComponent,
   ConfiguracionPrivacidadComponent,
   AyudaComponent,
   AlimentosComponent,
   IngredientesComponent,
   PlatosComponent,
   MenuComponent,
   CreditoComponent,
   TipoalimentosComponent,
   PesosComponent,
   CantidadplatosComponent
  ]
})

export class AdminLayoutModule {}
