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
  
    
   }
  personaForm!:FormGroup;

 
ngOnInit() {
this.personaForm= this.formBuilder.group({
nombre: new FormControl("", Validators.minLength(3)),
email: new FormControl("",Validators.maxLength(100)),
telefono: new FormControl("",Validators.minLength(10)),
foto: new FormControl("",Validators.maxLength(100)),
usuario: new FormControl("", Validators.minLength(3)),
contrasena: new FormControl("",Validators.minLength(4)),
});


}
 
   addPersona(){
    if (this.personaForm.valid) {
      this.UsuarioService.postpersona(this.personaForm.value)
      .subscribe({
        next:(res)=>{
          debugger
          alert("Persona registrada correctamente");
          this.personaForm.reset();
         
        },
        error:(error)=>{
          debugger
          alert("error al registrar persona")
        }
      })    
    } 
}


}
 