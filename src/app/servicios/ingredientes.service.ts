import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const BASE_URL = ' http://localhost:3000/api/';

@Injectable({
  providedIn: 'root'
})
export class IngredientesService {

  constructor(private http: HttpClient) { }

  // Obtener ingredientes
  getingrediente() {
    return this.http.get<any>(`${BASE_URL}mostraringredientes`);
  }

  obtenerplatosdeingredientes() {
    return this.http.get<any>(`${BASE_URL}obtenerplatosdeingredientes`);
  }

  // Obtener ingredientes por id
  getingredienteporid(id?: any) {
    return this.http.get<any>(`${BASE_URL}obtenerIngredientesPorPlato/${id}`);
  }

  getobtenerDescripcionPlato(id?: any) {
    return this.http.get<any>(`${BASE_URL}obtenerDescripcionPlato/${id}`);
  }

  getobtenerDescripcionPlatoPrecio(id?: any) {
    return this.http.get<any>(`${BASE_URL}obtenerDescripcionPlatoyprecio/${id}`);
  }

  // Crear y modificar ingredientes
  guardar(data: any, id?: any) {
    if (id) {
      return this.http.put<any>(`${BASE_URL}editaringredientes/${id}`, data);
    } else {
      return this.http.post<any>(`${BASE_URL}crearingredientes`, data);
    }
  }

  crearingredientesconsuplato(data: any, id?: any) {
    if (id) {
      return this.http.put<any>(`${BASE_URL}editaringredientes/${id}`, data);
    } else {
      return this.http.post<any>(`${BASE_URL}crearingredientesconsuplato`, data);
    }
  }

  // Eliminar ingredientes
  deleteingrediente(id: number) {
    return this.http.delete<any>(`${BASE_URL}eliminaringredientes/${id}`);
  }

  deleteingredientescreados(id: number) {
    return this.http.delete<any>(`${BASE_URL}eliminaringredientescreados/${id}`);
  }

  // Eliminar ingredientes con su plato
  deleteproductoPlato(id: number) {
    return this.http.delete<any>(`${BASE_URL}eliminarproductoPlato/${id}`);
  }

  // Crear y modificar productos para su plato
  guardarproductosconsuplato(data: any, id?: any) {
    if (id) {
      return this.http.put<any>(`${BASE_URL}editaringredientes/${id}`, data);
    } else {
      return this.http.post<any>(`${BASE_URL}crearingredientesconsuplato`, data);
    }
  }

  getproductosporid(id?: any) {
    return this.http.get<any>(`${BASE_URL}obtenerproductosplatos_PorPlato/${id}`);
  }

  getobtenerDescripcionPlatoproductos(id?: any) {
    return this.http.get<any>(`${BASE_URL}obtenerDescripcionPlatoproductos/${id}`);
  }

  // Buscar ingrediente por fecha y plato
  buscarFechaYPlato(id: number, fecha: string) {
    return this.http.get<any>(`${BASE_URL}buscarPorFecha/${id}/${fecha}`);
  }
}
