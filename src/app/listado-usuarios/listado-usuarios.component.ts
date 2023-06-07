import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'app/servicios/usuario.service';

@Component({
  selector: 'app-listado-usuarios',
  templateUrl: './listado-usuarios.component.html',
  styleUrls: ['./listado-usuarios.component.scss']
})
export class ListadoUsuariosComponent implements OnInit {

  usuario:string = ''; 
  contrasena:string = ''; 
  usuariosss:any[] = []; 

  constructor(private http:HttpClient,private UsuarioService: UsuarioService, private router: Router,private formBuilder: FormBuilder) {
    this.loadusuarios();
    
   }

  ngOnInit(): void {
  }
  loadusuarios(){
    this.http
    .get("http://localhost:3000/api/mostrarusuario/").subscribe((result:any)=>{
      this.usuariosss= result.usuarios;
    })
   }

   eliminarusuario(id:number){
    this.UsuarioService.deleteusuario(id)
    .subscribe({
      next:(res)=>{
        alert("usuario eliminado correctamente");
        
        this.loadusuarios();
      },
      error:()=> {
        alert("Error al eliminar usuario")
      },
    })
   }

}
