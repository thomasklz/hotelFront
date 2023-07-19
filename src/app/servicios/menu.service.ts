import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor( private http:HttpClient) { }
  postplato(data:any){
    
    return this.http.post<any>('http://localhost:3000/api/crearplato/', data);
    
  }

  gettplato(){
    return this.http.get<any>('http://localhost:3000/api/mostrarplato');
  }
  gettplatoselect(){
    return this.http.get<any>('http://localhost:3000/api/obtenerplato');
  }

  

putplato(data:any, id:number){
  return this.http.put<any>('http://localhost:3000/api/editarplato/'+id,data);
}
id:number;


guardar(data:any, id?){
if (id) {
  return this.http.put<any>('http://localhost:3000/api/editarplato/'+id,data);
}else{
  return this.http.post<any>(' http://localhost:3000/api/crearplato/', data);
}
}
buscar( id){
  return this.http.get<any>('http://localhost:3000/api/buscarplato/'+id);
}

deleteplato(id:number){
  return this.http.delete<any>('http://localhost:3000/api/eliminarplato/'+id);
}


/*TIPO MENU------------------------------------------------------ */



gettipomenu(){
  return this.http.get<any>('http://localhost:3000/api/mostrartipo_menu/');
}

posttipomenu(data:any){
    
  return this.http.post<any>(' http://localhost:3000/api/creartipo_menu', data);
  
}





}
