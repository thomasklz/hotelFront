import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const BASE_URL = ' http://localhost:3000/api/';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {

  constructor(private http: HttpClient) { }

  gestionarAlimento(data: any) {
    return this.http.post<any>(`${BASE_URL}gestionarAlimento`, data);
  }

  mostrarCompra() {
    return this.http.get<any>(`${BASE_URL}mostrarCompra`);
  }

  mostrarCompraAlimmentosReportes() {
    return this.http.get<any>(`${BASE_URL}mostrarCompraAlimmentosReportes`);
  }

  mostrarCompraExistente() {
    return this.http.get<any>(`${BASE_URL}mostrarCompraExistente`);
  }

  mostrarNoCompraExistente() {
    return this.http.get<any>(`${BASE_URL}mostrarCompraNoExistente`);
  }

  buscarFechaCompra(fecha: string) {
    return this.http.get<any>(`${BASE_URL}buscarFechaCompra/${fecha}`);
  }

  deletealimentos(id: number) {
    return this.http.delete<any>(`${BASE_URL}eliminaralimentoCompra/${id}`);
  }

}
