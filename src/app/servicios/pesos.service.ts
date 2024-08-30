import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const BASE_URL = ' http://localhost:3000/api/';

@Injectable({
  providedIn: 'root'
})
export class PesosService {

  constructor(private http: HttpClient) { }

  gettpesos() {
    return this.http.get<any>(`${BASE_URL}mostrarpeso/`);
  }

  gettobtenerEstadoPersona() {
    return this.http.get<any>(`${BASE_URL}obtenerEstadoPersona/`);
  }

  guardar(data: any, id?: any) {
    if (id) {
      return this.http.put<any>(`${BASE_URL}editarpeso/${id}`, data);
    } else {
      return this.http.post<any>(`${BASE_URL}crearpeso`, data);
    }
  }

  deletepesos(id: number) {
    return this.http.delete<any>(`${BASE_URL}eliminarpeso/${id}`);
  }
}
