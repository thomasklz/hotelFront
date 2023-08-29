import { Component, OnInit } from '@angular/core';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.scss']
})
export class ReporteComponent implements OnInit {

  creditosss: any[] = [];
  constructor() { }
  fecha: Date = new Date();
  ngOnInit(): void {
    this.fecha = new Date();
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

}
