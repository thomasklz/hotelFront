import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PesosService {

  constructor( private http:HttpClient) { }

  gettpesos(){
    return this.http.get<any>('http://localhost:3000/api/mostrarpeso/');
  }

  guardar(data:any, id?){
    if (id) {
      return this.http.put<any>('http://localhost:3000/api/editarpeso/'+id,data);
    }else{
      return this.http.post<any>('http://localhost:3000/api/crearpeso', data);
    }
    }

    deletepesos(id:number){
      return this.http.delete<any>('http://localhost:3000/api/eliminarpeso/'+id);
    }
}
