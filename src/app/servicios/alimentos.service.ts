import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const BASE_URL = ' http://localhost:3000/api/';

@Injectable({
  providedIn: 'root'
})
export class AlimentosService {

  constructor(private http: HttpClient) { }

  // Crear tipo alimentos
  creartipoalimentos(data: any) {
    return this.http.post<any>(`${BASE_URL}creartipo_alimento`, data);
  }

  // Crear unidad de medida
  crearunidadMedida(data: any) {
    return this.http.post<any>(`${BASE_URL}crearunidadMedida`, data);
  }

  // Obtener tipos de alimentos
  gettipoalimento() {
    return this.http.get<any>(`${BASE_URL}mostrartipo_alimento/`);
  }

  // Obtener unidad de medida
  obtenerUnidadMedida() {
    return this.http.get<any>(`${BASE_URL}obtenerUnidadMedida/`);
  }

  // Mostrar alimentos para menú
  mostraralimentomenu() {
    return this.http.get<any>(`${BASE_URL}mostraralimentomenuIngredient/`);
  }

  // Obtener todos los alimentos
  getalimentos() {
    return this.http.get<any>(`${BASE_URL}mostraralimento`);
  }

  // Obtener alimentos para ingredientes
  getalimentosIngre() {
    return this.http.get<any>(`${BASE_URL}getalimentos`);
  }

  // Mostrar alimentos con s
  mostraralimentoss() {
    return this.http.get<any>(`${BASE_URL}mostraralimentoss`);
  }

  // Crear y Modificar Alimentos
  guardar(data: any, id?) {
    if (id) {
      return this.http.put<any>(`${BASE_URL}editaralimento/${id}`, data);
    } else {
      return this.http.post<any>(`${BASE_URL}crearalimento`, data);
    }
  }



  // Eliminar Alimentos
  deletealimentos(id: number) {
    return this.http.delete<any>(`${BASE_URL}eliminaralimento/${id}`);
  }

  // Crear y Modificar Tipos Alimentos
  guardartiposalimentos(data: any, id?: number) {
    if (id) {
      return this.http.put<any>(`${BASE_URL}editartipo_alimento/${id}`, data);
    } else {
      return this.http.post<any>(`${BASE_URL}creartipo_alimento`, data);
    }
  }

  // Eliminar Tipo Alimentos
  deletetipoalimentos(id: number) {
    return this.http.delete<any>(`${BASE_URL}eliminartipo_alimento/${id}`);
  }

  // Obtener filtro por días
  obtenerfiltropordias(fecha: string, id?: string) {
    let url = `${BASE_URL}obtenerfiltropordias/${fecha}`;
    if (id) {
      url += `/${id}`;
    }
    return this.http.get<any>(url);
  }

  // Obtener filtro por mes
  obtenerfiltropormes(id: string, mes?: string) {
    let url = `${BASE_URL}obtenerfiltropormes/${id}`;
    if (mes) {
      url += `/${mes}`;
    }
    return this.http.get<any>(url);
  }

  // Obtener filtro por semanas
  obtenerFiltroPorSemanas(id: string, fechainicio?: string, fechafinal?: string) {
    let url = `${BASE_URL}obtenerfiltroporsemanas/${id}`;
    if (fechainicio && fechafinal) {
      url += `/${fechainicio}/${fechafinal}`;
    }
    return this.http.get<any>(url);
  }

}
