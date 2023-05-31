import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {MatTableDataSource} from '@angular/material/table';
import { UsuarioService } from 'app/servicios/usuario.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {


  dataSource = new MatTableDataSource<any>;
  constructor(private UsuarioService: UsuarioService, private router: Router,private formBuilder: FormBuilder,private http:HttpClient) { 
    this.loadPersonas();
   // this.addPersona();
    this.getAllpersona();
    
   }
  personaForm!:FormGroup;
 

usuarioForm!:FormGroup;
 

 
ngOnInit() {
this.personaForm= this.formBuilder.group({
nombre: new FormControl("", Validators.minLength(3)),
email: new FormControl("",Validators.maxLength(100)),
telefono: new FormControl("",Validators.minLength(10)),
foto: new FormControl("",Validators.maxLength(100)),
usuario: new FormControl("", Validators.minLength(3)),
contrasena: new FormControl("",Validators.minLength(4)),
});

this.getAllpersona();
}


  ngOnInit2() {
   
}

 
   addPersona(){
    if (this.personaForm.valid) {
      this.UsuarioService.postpersona(this.personaForm.value)
      .subscribe({
        next:(res)=>{
          debugger
          alert("Persona registrada correctamente");
          this.personaForm.reset();
          this.getAllpersona();
        },
        error:(error)=>{
          debugger
          alert("error al registrar persona")
        }
      })    
    } 
}



//----------------------------




getAllpersona(){
  this.UsuarioService.getpersona()
  .subscribe({
    next:(res)=>{
     // this.dataSource= new MatTableDataSource(res);
      this.dataSource = new MatTableDataSource(res.personas);
    
    },
    error:(err)=> {
      alert("Error en la carga de datos")
    },
  })
 }



/*Usuario------------------------------------------------------------------------------------------------*/
hide = true;
id:string = '';
usuario:string = ''; 
contrasena:string = '';

id_tipousuario:string = '';
id_persona:string = '';
personassss:any[] = [];
tipo_usuariosss:any[] = [];


 


 
 

   
   //Parar cargar el combo selection-------------------------------------------------------
 
   loadPersonas(){
    this.http
    .get("http://localhost:3000/api/mostrarpersona/").subscribe((resultado:any)=>{
      this.personassss= resultado.personas;
      
    })
    this.getAllpersona();
   }
  
//-------------------------------------------------------------------------------------------
  



   //Parar Guardar el id del combo selection-------------------------------------------------------



getId_Persona(){
  this.http
    .get("http://localhost:3000/api/creartipo_usuario?="+this.id_persona).subscribe((resultado:any)=>{
      this.personassss= resultado.crearUsuario;
      this.getAllpersona();
    })

}

//-------------------------------------------------------------------------------------------


  
   addUsuario(){
    if (this.usuarioForm.valid) {
      this.UsuarioService.postusuario(this.usuarioForm.value)
      .subscribe({
       
        next:(res)=>{

         
          alert("Usuario registrado correctamente");
          this.usuarioForm.reset();
        },
        error:()=>{
          alert("error al registrar usuario")
        }
      })


     
    }  
   }


}
 