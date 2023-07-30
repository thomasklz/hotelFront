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
  
  buscarUsuario(id:number){
    return this.http.get<any>('http://localhost:3000/api/buscarUsuario/'+id);
  }
  
  
putusuario(data:any, id:any){
  return this.http.put<any>('http://localhost:3000/api/editardatos/'+id,data);
}

deleteusuario(id:number){
  return this.http.delete<any>('http://localhost:3000/api/eliminarusuario/'+id);
  
}
deletepersona(id:number){
  return this.http.delete<any>('http://localhost:3000/api/eliminarpersona/'+id);
  
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


  //----------------------------------Editar campo por campo de datos de usuario
editUsuario(data:any, id:number){
  return this.http.put<any>('http://localhost:3000/api/editUsuario/'+id,data);
}

editContrasena(data:any, id:any){
  return this.http.put<any>('http://localhost:3000/api/editContrasena/'+id,data);
}

editNombre(data:any, id:number){
  return this.http.put<any>('http://localhost:3000/api/editNombre/'+id,data);
}

editEmail(data:any, id:number){
  return this.http.put<any>('http://localhost:3000/api/editEmail/'+id,data);
}

editTelefono(data:any, id:number){
  return this.http.put<any>('http://localhost:3000/api/editTelefono/'+id,data);
}

editFoto(data:any, id:number){
  return this.http.put<any>('http://localhost:3000/api/editFoto/'+id,data);
}


}

