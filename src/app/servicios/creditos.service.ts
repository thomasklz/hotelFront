import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const BASE_URL = ' http://localhost:3000/api/';

@Injectable({
  providedIn: 'root'
})
export class CreditosService {

  constructor(private http: HttpClient) { }

  getcreditos() {
    return this.http.get<any>(`${BASE_URL}mostrarcredito`);
  }

  crearreporteIngresos(data: any) {
    return this.http.post<any>(`${BASE_URL}crearreporteIngresos`, data);
  }

  guardar(data: any, id?: any) {
    if (id) {
      return this.http.put<any>(`${BASE_URL}editarcredito/${id}`, data);
    } else {
      return this.http.post<any>(`${BASE_URL}crearcredito`, data);
    }
  }

  modificarCredito(id_persona: any, pagado: boolean) {
    return this.http.put<any>(`${BASE_URL}editarcredito/${id_persona}`, { pagado });
  }

  crearcredito(data: any) {
    return this.http.post<any>(`${BASE_URL}crearcredito/`, data);
  }

  getReporteUsuario(id: any) {
    return this.http.get<any>(`${BASE_URL}obtenerreporteporusuario/${id}`);
  }

  ingresos(fecha: string, id: string) {
    return this.http.get<any>(`${BASE_URL}buscarReportePorIdYFecha/${id}/${fecha}`);
  }
  buscardia(fecha: string) {
    return this.http.get<any>(`${BASE_URL}buscarReportePorFecha/${fecha}`);
  }


  buscarPorSemana(fechaInicio?: string, fechaFin?: string) {
    let url = `${BASE_URL}buscarPorSemana`;
  
    if (fechaInicio && fechaFin) {
      url += `/${fechaInicio}/${fechaFin}`;
    }
  
    return this.http.get<any>(url);
  }
  
  

  reporteIngresosporsemanasdeplatos(id: string, fechaInicio?: string, fechaFin?: string) {
    let url = `${BASE_URL}buscarReportePorRangoFechaYPlato/${id}`;
    
    if (fechaInicio && fechaFin) {
      url += `/${fechaInicio}/${fechaFin}`;
    }
  
    return this.http.get<any>(url);
  }

  reporteIngresospormesdeplatos(id: string, mes?: string) {
    let url = `${BASE_URL}buscarReportePorMesYPlato/${id}`;
    
    if (mes) {
      url += `/${mes}`;
    }
  
    return this.http.get<any>(url);
  }
  buscarPorMes(  mes?: string) {
    let url = `${BASE_URL}buscarPorMes`;
    
    if (mes) {
      url += `/${mes}`;
    }
  
    return this.http.get<any>(url);
  }

  eliminarcredito(id: number) {
    return this.http.delete<any>(`${BASE_URL}eliminarcreditosss/${id}`);
  }
}
