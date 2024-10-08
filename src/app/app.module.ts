import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
 import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { LoginComponent } from './login/login.component';
import { CrearAdministradorComponent } from './crear-administrador/crear-administrador.component';
import { ReporteComponent } from './reporte/reporte.component';
import { PerfilclienteComponent } from './perfilcliente/perfilcliente.component';
import { PanelAdministradorComponent } from './panel-administrador/panel-administrador.component';
import { RecetarioComponent } from './recetario/recetario.component';
import { PerfilcajeroComponent } from './perfilcajero/perfilcajero.component';
import { EditarperfilcajeroComponent } from './editarperfilcajero/editarperfilcajero.component';
  

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    MatFormFieldModule,
    MatDialogModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    
    
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
     LoginComponent,
    CrearAdministradorComponent,
    ReporteComponent,
    PerfilclienteComponent,
    PanelAdministradorComponent,
    RecetarioComponent,
    PerfilcajeroComponent,
    EditarperfilcajeroComponent
      
  
    
    
    
    
   
    
    
    

  ],
  providers: [],
  bootstrap: [AppComponent],
  
})
export class AppModule { }
