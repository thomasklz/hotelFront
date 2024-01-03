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



  currentDate: Date = new Date();
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;

  ngOnInit() {
    setInterval(() => {
      const now = new Date();
      this.hours = now.getHours();
      this.minutes = now.getMinutes();
      this.seconds = now.getSeconds();
    }, 1000);   // Actualiza cada 60 segundos (1 minuto)
  


    const cuentaFijaid_tipousuario = '1'; // Reemplaza 'nombreUsuario' con el nombre de usuario de la cuenta fija
    
    const id_tipousuario = localStorage.getItem('id_tipousuario'); // Obtén el usuario almacenado en el localStorage después del inicio de sesión
    const contrasena = localStorage.getItem('contrasena'); // Obtén la contraseña almacenada en el localStorage después del inicio de sesión
    
    this.cuentaFija = id_tipousuario === cuentaFijaid_tipousuario ;
  }



  

}
