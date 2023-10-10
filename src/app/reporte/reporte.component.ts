import { Component, OnInit } from '@angular/core';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { CreditosService } from 'app/servicios/creditos.service';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.scss']
})
export class ReporteComponent implements OnInit {
  location: Location;
  creditosss: any[] = [];
  usuario:any;
  id:any;
  dataSource = new MatTableDataSource<any>();

  constructor(location: Location, private  CreditosService:CreditosService, private router:Router) { 

    this.location = location;
   
  this.usuario= localStorage.getItem('usuario');
  this.id= localStorage.getItem('idPersona'); 
  }
  fecha: Date = new Date();
  ngOnInit(): void {
    this.getAllcreditos();
    this.fecha = new Date();
  }


  

  getAllcreditos() {
    this.CreditosService.getReporteUsuario(this.id).subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.creditos);
        this.creditosss = res.creditos;
      },
      error: (err) => {
        //alert("Error en la carga de datos");
      },
    });
  }
  generarPDF() {
    const content = document.getElementById('report-content')!;

    // Creamos una nueva instancia de jsPDF
    const pdf = new jsPDF();

    // Convertimos el contenido del reporte a una imagen
    html2canvas(content).then(canvas => {
      const imgData = canvas.toDataURL('image/png');

      // Agregamos la imagen al PDF
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);

      // Descargamos el PDF
      pdf.save('reporte_usuario.pdf');
    });
  }
  calcularTotal() {
    return this.creditosss
      .filter(item => item.pagado === false)
      .reduce((total, item) => total + item.precio, 0);
  }



  showModalcerrar() {
    Swal.fire({
      title: '¿Estás seguro que deseas cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
     
      confirmButtonText: 'Sí, cerrar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#bf0d0d',
      
      
    }).then((result) => {
      if (result.isConfirmed) {
        this.logout();
      }
    });
  }
logout() {
    localStorage.removeItem('idPersona');
    localStorage.removeItem('idUsuario');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }
}
