import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const BASE_URL = ' http://localhost:3000/api/';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient) { }

  postplato(data: any) {
    return this.http.post<any>(`${BASE_URL}crearplato/`, data);
  }

  gettplato() {
    return this.http.get<any>(`${BASE_URL}mostrarplato`);
  }

  mostrarplatomenu() {
    return this.http.get<any>(`${BASE_URL}mostrarplatomenu`);
  }

  mostrarplatocredito() {
    return this.http.get<any>(`${BASE_URL}mostrarplatocredito`);
  }

  mostrartodoslosplatosMenu() {
    return this.http.get<any>(`${BASE_URL}mostrartodoslosplatosMenu`);
  }

  obtenerplatos() {
    return this.http.get<any>(`${BASE_URL}mostrartodoslosplatos`);
  }

  obtenerplatosdeproductos() {
    return this.http.get<any>(`${BASE_URL}obtenerplatosdeproductos`);
  }

  gettplatoselect() {
    return this.http.get<any>(`${BASE_URL}obtenerplato`);
  }

  putplato(data: any, id: number) {
    return this.http.put<any>(`${BASE_URL}editarplato/${id}`, data);
  }

  guardar(data: any, id?: any) {
    if (id) {
      return this.http.put<any>(`${BASE_URL}editarplato/${id}`, data);
    } else {
      return this.http.post<any>(`${BASE_URL}crearplato/`, data);
    }
  }

  buscar(id: any) {
    return this.http.get<any>(`${BASE_URL}buscarplato/${id}`);
  }

  deleteplato(id: number) {
    return this.http.delete<any>(`${BASE_URL}eliminarplato/${id}`);
  }

  deletemenudiario(id: number) {
    return this.http.delete<any>(`${BASE_URL}eliminarmenu/${id}`);
  }

  /* TIPO MENU ------------------------------------------------------ */

  gettipomenu() {
    return this.http.get<any>(`${BASE_URL}mostrartipo_menu/`);
  }

  posttipomenu(data: any) {
    return this.http.post<any>(`${BASE_URL}creartipo_menu`, data);
  }

  /* CANTIDAD DE PLATOS ------------------------------------------------------ */

  guardarCantidadPlato(data: any, id?: any) {
    if (id) {
      return this.http.put<any>(`${BASE_URL}editarcantidadplato/${id}`, data);
    } else {
      return this.http.post<any>(`${BASE_URL}crearcantidadplato/`, data);
    }
  }

  gettcantidadplatos() {
    return this.http.get<any>(`${BASE_URL}mostrarcantidadplato`);
  }

  obtenercantidadplatoselect() {
    return this.http.get<any>(`${BASE_URL}obtenercantidadplatoselect`);
  }

  /* MENU ------------------------------------------------------ */

  gettMenu() {
    return this.http.get<any>(`${BASE_URL}mostrarmenu`);
  }

  guardarMenu(data: any, id?: any) {
    if (id) {
      return this.http.put<any>(`${BASE_URL}editarmenu/${id}`, data);
    } else {
      return this.http.post<any>(`${BASE_URL}crearmenu/`, data);
    }
  }

  // Mostrar las fechas
  gettfechaMenu() {
    return this.http.get<any>(`${BASE_URL}mostrarfechamenu`);
  }

  gettfechaMenuregistro() {
    return this.http.get<any>(`${BASE_URL}mostrarfechamenuregistro`);
  }

  // BUSCAR FECHA
  buscarmenuporfecha(fecha: string) {
    return this.http.get<any>(`${BASE_URL}obtenerMenuPorFecha/${fecha}`);
  }
}
