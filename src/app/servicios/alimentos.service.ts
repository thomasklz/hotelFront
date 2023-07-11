import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AlimentosService {

  constructor( private http:HttpClient) { }


  //obtener tipos de alimentos
  gettipoalimento(){
    return this.http.get<any>('http://localhost:3000/api/mostrartipo_alimento/');
  }

  //obtener alimentos
  getalimentos(){
    return this.http.get<any>('http://localhost:3000/api/mostraralimento');
  }

  //Crear y Modificar Alimentos
  guardar(data:any, id?){
    if (id) {
      return this.http.put<any>('http://localhost:3000/api/editaralimento/'+id,data);
    }else{
      return this.http.post<any>('http://localhost:3000/api/crearalimento', data);
    }
    }

    //eliminar Alimentos
    deletealimentos(id:number){
      return this.http.delete<any>('http://localhost:3000/api/eliminaralimento/'+id);
    }
}
