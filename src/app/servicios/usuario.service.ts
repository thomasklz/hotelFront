import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor( private http:HttpClient) { }

  postusuario(data:any){
    return this.http.post<any>('http://localhost:3000/api/crearUsuario/', data);
    
  }

  getusuario(){
    return this.http.get<any>('http://localhost:3000/api/mostrarusuario/');
  }
  

  
putusuario(data:any, id:number){
  return this.http.put<any>('http://localhost:3000/api/editarusuario/'+id,data);
}

deleteusuario(id:number){
  return this.http.delete<any>('http://localhost:3000/api/eliminarusuario/'+id);
}

loginUser(data:any){
  return this.http.post<any>('http://localhost:3000/api/login/', data);
}

postpersona(data:any){
  debugger
  return this.http.post<any>('http://localhost:3000/api/crearPersona/', data);
}

getpersona(){
  return this.http.get<any>('http://localhost:3000/api/mostrarpersona/');
}



iniciarSesion(data:any){
  return this.http.post<any>('http://localhost:3000/api/iniciarSesion/', data);
  
}


}

