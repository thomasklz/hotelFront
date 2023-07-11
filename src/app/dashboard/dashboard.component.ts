import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private formBuilder: FormBuilder) { }
  loginForm!:FormGroup;
  cuentaFija = false;

  ngOnInit() {
    const cuentaFijaUsuario = 'hotelHigueron'; // Reemplaza 'nombreUsuario' con el nombre de usuario de la cuenta fija
    const cuentaFijaContrasena = 'hotelHigueronESPAMMFL'; // Reemplaza 'contrasena' con la contraseña de la cuenta fija
    
    const usuario = localStorage.getItem('usuario'); // Obtén el usuario almacenado en el localStorage después del inicio de sesión
    const contrasena = localStorage.getItem('contrasena'); // Obtén la contraseña almacenada en el localStorage después del inicio de sesión
    
    this.cuentaFija = usuario === cuentaFijaUsuario && contrasena === cuentaFijaContrasena;
  }
  

}
