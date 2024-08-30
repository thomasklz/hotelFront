import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE_URL = ' http://localhost:3000/api/';

@Injectable({
  providedIn: 'root'
})
export class RecetarioService {

  constructor(private http: HttpClient) { }

  crearRecetario(data: any) {
    return this.http.post<any>(`${BASE_URL}crearRecetario`, data);
  }

  getproductosporid(id?: any) {
    return this.http.get<any>(`${BASE_URL}obtenerrecetario_PorPlato/${id}`);
  }

  obtenerplatosdeproductos() {
    return this.http.get<any>(`${BASE_URL}obtenerplatosdeproductosRecetario`);
  }

  deleteproductoPlato(id: number) {
    return this.http.delete<any>(`${BASE_URL}eliminarRecetario/${id}`);
  }


  eliminarRecetariobasico(id: number): Observable<any> {
    return this.http.delete<any>(`${BASE_URL}eliminarRecetarioBasico/${id}`);
  }

  eliminarRecetariodetallado(id: number): Observable<any> {
    return this.http.delete<any>(`${BASE_URL}eliminarRecetariodetallado/${id}`);
  }

  buscarPlatoRecetario(params: any) {
    const descripcion = params.descripcion;
    return this.http.get<any>(`${BASE_URL}buscarPlatoRecetario/${descripcion}`);
  }

  crearplatoconIngrediente(data: any) {
    return this.http.post<any>(`${BASE_URL}crearplatoconIngrediente`, data);
  }

  getplatoconIngredienteporid(id?: any) {
    return this.http.get<any>(`${BASE_URL}obtenerproductosplatos_PorPlato_platoconIngrediente/${id}`);
  }

  getobtenerDescripcionPlatoproductos(id?: any) {
    return this.http.get<any>(`${BASE_URL}obtenerDescripcionplatoconIngrediente/${id}`);
  }

  obtenerListaplatosconIngrediente() {
    return this.http.get<any>(`${BASE_URL}obtenerListaplatosconIngrediente`);
  }
}
