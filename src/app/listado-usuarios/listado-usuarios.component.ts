import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'app/servicios/usuario.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-listado-usuarios',
  templateUrl: './listado-usuarios.component.html',
  styleUrls: ['./listado-usuarios.component.scss']
})
export class ListadoUsuariosComponent implements OnInit {

  usuario:string = ''; 
  contrasena:string = ''; 
  usuariosss:any[] = []; 
  dataSource = new MatTableDataSource<any>();

  constructor(private http:HttpClient,private UsuarioService: UsuarioService, private router: Router,private formBuilder: FormBuilder) {
    this.getAllplato();
    
   }

  ngOnInit(): void {
  }
 
   //obtener todos los platos 
  getAllplato() {
    this.UsuarioService.getusuario().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.platos);
        this.usuariosss = res.usuarios;
      },
      error: (err) => {
        alert("Error en la carga de datos");
      },
    });
  }


   eliminarusuario(id:number){
    this.UsuarioService.deleteusuario(id)
    .subscribe({
      next:(res)=>{
        alert("usuario eliminado correctamente");
        
        this.getAllplato();
      },
      error:()=> {
        alert("Error al eliminar usuario")
      },
    })
   }

}
