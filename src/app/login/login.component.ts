import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {MatTableDataSource} from '@angular/material/table';
import { UsuarioService } from 'app/servicios/usuario.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!:FormGroup;
  constructor(private UsuarioService: UsuarioService, private router: Router,private formBuilder: FormBuilder,private http:HttpClient) { 
   
    
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
            debugger;
            alert("Inicio de sesión exitoso");
            this.loginForm.reset();
            this.router.navigate(["/dashboard"]);
          
          },
          error: (error) => {
            debugger;
            alert("Error al iniciar sesión");
          }
        });
    }
  }
  

}
