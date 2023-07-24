import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { CrearUsuarioComponent } from 'app/paginas/crear-usuario/crear-usuario.component';
import { LoginComponent } from 'app/login/login.component';
import { ReportePolitecnicoComponent } from 'app/reporte-politecnico/reporte-politecnico.component';
import { ListadoUsuariosComponent } from 'app/listado-usuarios/listado-usuarios.component';
import { ConfiguracionPrivacidadComponent } from 'app/configuracion-privacidad/configuracion-privacidad.component';
import { AyudaComponent } from 'app/ayuda/ayuda.component';
import { AlimentosComponent } from 'app/alimentos/alimentos.component';
import { IngredientesComponent } from 'app/ingredientes/ingredientes.component';
import { PlatosComponent } from 'app/platos/platos.component';
import { MenuComponent } from 'app/menu/menu.component';
import { CreditoComponent } from 'app/credito/credito.component';

export const AdminLayoutRoutes: Routes = [
    // {
    //   path: '',
    //   children: [ {
    //     path: 'dashboard',
    //     component: DashboardComponent
    // }]}, {
    // path: '',
    // children: [ {
    //   path: 'userprofile',
    //   component: UserProfileComponent
    // }]
    // }, {
    //   path: '',
    //   children: [ {
    //     path: 'icons',
    //     component: IconsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'notifications',
    //         component: NotificationsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'maps',
    //         component: MapsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'typography',
    //         component: TypographyComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'upgrade',
    //         component: UpgradeComponent
    //     }]
    // }
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'table-list',     component: TableListComponent },
    

    { path: 'typography',     component: TypographyComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'notifications',  component: NotificationsComponent },
    { path: 'upgrade',        component: UpgradeComponent },
    { path: 'CrearUsuarioComponent',        component: CrearUsuarioComponent },
    { path: 'login',        component: LoginComponent },
    { path: 'reportePolitecnico',        component: ReportePolitecnicoComponent },
    { path: 'listadoUsuarios',        component: ListadoUsuariosComponent },
    { path: 'configuracionyprivacidad',        component: ConfiguracionPrivacidadComponent },
    { path: 'ayuda',        component: AyudaComponent },
    { path: 'alimentos',        component: AlimentosComponent },
    { path: 'ingredientes',        component: IngredientesComponent },
    { path: 'platos',        component: PlatosComponent },
    { path: 'menu',        component: MenuComponent },
    { path: 'creditos',        component: CreditoComponent },
    
    
    
    

    
];
