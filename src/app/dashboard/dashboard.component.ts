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
    const cuentaFijaid_tipousuario = '1'; // Reemplaza 'nombreUsuario' con el nombre de usuario de la cuenta fija
    
    const id_tipousuario = localStorage.getItem('id_tipousuario'); // Obtén el usuario almacenado en el localStorage después del inicio de sesión
    const contrasena = localStorage.getItem('contrasena'); // Obtén la contraseña almacenada en el localStorage después del inicio de sesión
    
    this.cuentaFija = id_tipousuario === cuentaFijaid_tipousuario ;
  }
  

}
