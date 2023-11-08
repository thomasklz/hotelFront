import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AlimentosService {

  constructor( private http:HttpClient) { }

//crear tipo alimentos
creartipoalimentos(data:any){
  return this.http.post<any>('http://localhost:3000/api/creartipo_alimento',data);
}

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




     //Crear y Modificar Tipos Alimentos
     guardartiposalimentos(data:any, id?){
      if (id) {
        return this.http.put<any>('http://localhost:3000/api/editartipo_alimento/'+id,data);
      }else{
        return this.http.post<any>('http://localhost:3000/api/creartipo_alimento', data);
      }
      }
 //eliminar Tipo Alimentos
 deletetipoalimentos(id:number){
  return this.http.delete<any>('http://localhost:3000/api/eliminartipo_alimento/'+id);
}



//-------------------------------------------------------------------------------------------

// Servicio AlimentosService
obtenerfiltropordias(fecha: string, id?: string) {
  // Formatea la URL adecuadamente con los parámetros
  let url = `http://localhost:3000/api/obtenerfiltropordias/${fecha}`;
  
  if (id) {
    url += `/${id}`;
  }

  return this.http.get<any>(url);
}




}
