import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {MatTableDataSource} from '@angular/material/table';
import { UsuarioService } from 'app/servicios/usuario.service';
import swal from 'sweetalert';
import swal2 from 'sweetalert';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!:FormGroup;
  constructor(private UsuarioService: UsuarioService, private router: Router,private formBuilder: FormBuilder,private http:HttpClient) { 
   
    
   }
title= 'sweetAlert';
showModal(){
  swal2({
    title:'Inicio de Sesión Exitoso',
    icon: "success",
  });
}

showModalError(){
  swal({
    title:'Error de Incio Sesión ',
    icon: "error",
  });
}
  ngOnInit(): void {
    this.loginForm= this.formBuilder.group({
      usuario: new FormControl("", Validators.minLength(3)),
      contrasena: new FormControl("",Validators.minLength(4)),
      });
  }

  login() {
    if (this.loginForm.valid) {
      this.UsuarioService.iniciarSesion(this.loginForm.value)
        .subscribe({
          next: (res) => {
            localStorage.setItem('idPersona',res.idPersona);
            localStorage.setItem('idUsuario',res.idUsuario);
            localStorage.setItem('usuario',res.usuario);
            localStorage.setItem('contrasena',res.contrasena);
            this.showModal();
            this.loginForm.reset();
            this.router.navigate(["/dashboard"]);
          
          },
          error: (error) => {
            this.showModalError();
          }
        });
    }
  }
  

}
