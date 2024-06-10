import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CreditosService {

  constructor( private http:HttpClient) { }

  getcreditos(){
    return this.http.get<any>('http://localhost:3000/api/mostrarcredito');
  }

  crearreporteIngresos (data:any){
    
      return this.http.post<any>('http://localhost:3000/api/crearreporteIngresos', data);
    
    }


  guardar(data:any, id?){
    if (id) {
      return this.http.put<any>('http://localhost:3000/api/editarcredito/'+id,data);
    }else{
      return this.http.post<any>('http://localhost:3000/api/crearcredito', data);
    }
    }

  
    modificarCredito(id_persona: any, pagado: boolean) {
      return this.http.put<any>(`http://localhost:3000/api/editarcredito/${id_persona}`, { pagado });
    }


    crearcredito(data:any){
      return this.http.post<any>('http://localhost:3000/api/crearcredito/', data);
      
    }

    getReporteUsuario( id:any){
      return this.http.get<any>('http://localhost:3000/api/obtenerreporteporusuario/'+id);
    }
    
    ingresos(fecha: string, id: string) {
      return this.http.get<any>(`http://localhost:3000/api/buscarReportePorIdYFecha/${id}/${fecha}`);
    }
 


    reporteIngresosporsemanasdeplatos(id: string, fechaInicio?: string, fechaFin?: string) {
      // Formatea la URL adecuadamente con los parámetros
      let url = `http://localhost:3000/api/buscarReportePorRangoFechaYPlato/${id}`;
      
      if (fechaInicio && fechaFin) {
        // Asegúrate de que las fechas estén en el formato correcto y sean válidas
        url += `/${fechaInicio}/${fechaFin}`;
      }
    
      return this.http.get<any>(url);
    }

    reporteIngresospormesdeplatos( id: string, mes?: string) {
      // Formatea la URL adecuadamente con los parámetros
      let url = `http://localhost:3000/api/buscarReportePorMesYPlato/${id}`;
      
      if (mes) {
        url += `/${mes}`;
      }
    
      return this.http.get<any>(url);
    }
    



    
    eliminarcredito(id:number){
      return this.http.delete<any>('http://localhost:3000/api/eliminarcreditosss/'+id);
    }
    
}
