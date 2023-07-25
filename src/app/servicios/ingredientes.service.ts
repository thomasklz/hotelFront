import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IngredientesService {

  constructor( private http:HttpClient) { }


  //obtener ingredientes
  

  //obtener ingredientes
  getingrediente(){
    return this.http.get<any>('http://localhost:3000/api/mostraringredientes');
  }

  //Crear y Modificar ingredientes
  guardar(data:any, id?){
    if (id) {
      return this.http.put<any>('http://localhost:3000/api/editaringredientes/'+id,data);
    }else{
      return this.http.post<any>('http://localhost:3000/api/crearingredientes', data);
    }
    }

    //eliminar ingredientes
    deleteingrediente(id:number){
      return this.http.delete<any>('http://localhost:3000/api/eliminaringredientes/'+id);
    }
}
