import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

const BASE_URL = ' http://localhost:3000/api/';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient, private https: HttpClient) { }

  gettipousuario() {
    return this.http.get<any>(`${BASE_URL}mostrartipo_usuario/`);
  }

  getlistadoadministradores() {
    return this.http.get<any>(`${BASE_URL}listadoadministradores/`);
  }

  listadoaCajero() {
    return this.http.get<any>(`${BASE_URL}listadoaCajero/`);
  }
  listados() {
    return this.http.get<any>(`${BASE_URL}listados/`);
  }

  postusuario(data: any) {
    return this.http.post<any>(`${BASE_URL}crearUsuario/`, data);
  }

  crearPersonaCliente(data: any) {
    return this.http.post<any>(`${BASE_URL}crearPersonaCliente/`, data);
  }

  getusuario() {
    return this.http.get<any>(`${BASE_URL}mostrarusuario/`);
  }

  obtenerusuarioestado() {
    return this.http.get<any>(`${BASE_URL}obtenerusuarioestado/`);
  }

  getusua() {
    return this.http.get<any>(`${BASE_URL}obtusuario/`);
  }

  buscarUsuario(id: number) {
    return this.http.get<any>(`${BASE_URL}buscarUsuario/${id}`);
  }

  putusuario(data: any, id: any) {
    return this.http.put<any>(`${BASE_URL}editardatos/${id}`, data);
  }

  deleteusuario(id: number) {
    return this.http.delete<any>(`${BASE_URL}eliminarusuario/${id}`);
  }

  cambiarestadousuario(data: any, id: any) {
    return this.http.put<any>(`${BASE_URL}cambiarestadousuario/${id}`, data);
  }

  deletepersona(id: number) {
    return this.http.delete<any>(`${BASE_URL}eliminarpersona/${id}`);
  }

  postpersona(data: any) {
    debugger
    return this.http.post<any>(`${BASE_URL}crearPersona/`, data);
  }

  getpersona() {
    return this.http.get<any>(`${BASE_URL}mostrarpersona/`);
  }

  cedula(cedula: any) {
    const params = new HttpParams().set("identificacion", cedula);
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const body = {};
    return this.http.post<any>('https://servicios.espam.edu.ec/Datos/personainfo', body, { params, headers });
  }

  getpersonacedula() {
    return this.http.get<any>(`${BASE_URL}obtenerusuariocedula/`);
  }

  iniciarSesion(data: any) {
    return this.http.post<any>(`${BASE_URL}iniciarSesion/`, data);
  }

  //----------------------------------Editar campo por campo de datos de usuario
  editUsuario(data: any, id: number) {
    return this.http.put<any>(`${BASE_URL}editUsuario/${id}`, data);
  }

  editContrasena(data: any, id: any) {
    return this.http.put<any>(`${BASE_URL}editContrasena/${id}`, data);
  }

  editNombre(data: any, id: number) {
    return this.http.put<any>(`${BASE_URL}editNombre/${id}`, data);
  }

  editEmail(data: any, id: number) {
    return this.http.put<any>(`${BASE_URL}editEmail/${id}`, data);
  }

  editTelefono(data: any, id: number) {
    return this.http.put<any>(`${BASE_URL}editTelefono/${id}`, data);
  }

  editFoto(id: number, formData: FormData) {
    return this.http.post<any>(`${BASE_URL}persona/imagen/${id}`, formData);
  }

  obtenerNombrePorUsuario(nombreUsuario: string) {
    return this.http.get<any>(`${BASE_URL}obtenerNombrePorUsuario/${nombreUsuario}`);
  }
}
