import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
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
import { TipoalimentosComponent } from 'app/tipoalimentos/tipoalimentos.component';
import { PesosComponent } from 'app/pesos/pesos.component';
import { CantidadplatosComponent } from 'app/cantidadplatos/cantidadplatos.component';
import { ProductosplatoComponent } from 'app/productosplato/productosplato.component';
import { ReporteproductoComponent } from 'app/reporteproducto/reporteproducto.component';
import { ReporteingresosComponent } from 'app/reporteingresos/reporteingresos.component';
import { ListadoadministradoresComponent } from 'app/listadoadministradores/listadoadministradores.component';
import { PanelAdministradorComponent } from 'app/panel-administrador/panel-administrador.component';
import { RecetarioComponent } from 'app/recetario/recetario.component';
import { ComprasComponent } from 'app/compras/compras.component';
 



export const AdminLayoutRoutes: Routes = [
   
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'registrodecreditos',     component: TableListComponent },
    

    { path: 'typography',     component: TypographyComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'notifications',  component: NotificationsComponent },
    { path: 'upgrade',        component: UpgradeComponent },
     { path: 'login',        component: LoginComponent },
    { path: 'reportePolitecnico',        component: ReportePolitecnicoComponent },
    { path: 'listadodeclientes',        component: ListadoUsuariosComponent },


    { path: 'configuracionyprivacidad',        component: ConfiguracionPrivacidadComponent },
    { path: 'ayuda',        component: AyudaComponent },
    { path: 'productos',        component: AlimentosComponent },
    { path: 'recetadetallada',        component: IngredientesComponent },
    { path: 'menus',        component: PlatosComponent },
    { path: 'menusdiarios',        component: MenuComponent },
    { path: 'creditos',        component: CreditoComponent },
    { path: 'menus_Diarios',        component: TipoalimentosComponent },
    { path: 'pesos',        component: PesosComponent },
    { path: 'cantidadplatos',        component: CantidadplatosComponent },
    { path: 'productosplato',        component: ProductosplatoComponent },
    { path: 'reportedeproducto',        component: ReporteproductoComponent },
    { path: 'reportedeingresos',        component: ReporteingresosComponent },
    { path: 'listadodeadministradores',        component: ListadoadministradoresComponent },
    { path: 'panelAdministrador',        component: PanelAdministradorComponent },
    { path: 'compras',        component: ComprasComponent },
<<<<<<< HEAD
    { path: 'recetabasica',        component: RecetarioComponent },
=======
    { path: 'recetario',        component: RecetarioComponent },
>>>>>>> e6df002d2919446f51cf1ac3f2d5186f3bb16342



    
    
];
