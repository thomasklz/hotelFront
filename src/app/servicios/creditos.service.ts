import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CreditosService {

  constructor( private http:HttpClient) { }

  getcreditos(){
    return this.http.get<any>('http://localhost:3000/api/mostrarcredito');
  }

  guardar(data:any, id?){
    if (id) {
      return this.http.put<any>('http://localhost:3000/api/editarcredito/'+id,data);
    }else{
      return this.http.post<any>('http://localhost:3000/api/crearcredito', data);
    }
    }

    getReporteUsuario( id:any){
      return this.http.get<any>('http://localhost:3000/api/obtenerreporteporusuario/'+id);
    }
    
}
