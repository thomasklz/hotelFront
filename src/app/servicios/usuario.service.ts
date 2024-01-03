import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor( private http:HttpClient) { }

  gettipousuario(){
    return this.http.get<any>('http://localhost:3000/api/mostrartipo_usuario/');
  }
  getlistadoadministradores(){
    return this.http.get<any>('http://localhost:3000/api/listadoadministradores/');
  }
  

  postusuario(data:any){
    return this.http.post<any>('http://localhost:3000/api/crearUsuario/', data);
    
  }

  getusuario(){
    return this.http.get<any>('http://localhost:3000/api/mostrarusuario/');
  }
  getusua(){
    return this.http.get<any>('http://localhost:3000/api/obtusuario/');
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



cambiarestadousuario(data:any, id:any){
  return this.http.put<any>('http://localhost:3000/api/cambiarestadousuario/'+id,data);
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

getpersonacedula(){
  return this.http.get<any>('http://localhost:3000/api/obtenerusuariocedula/');
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


//rotuer.get('/obtenerNombrePorUsuario/:nombreUsuario', obtenerNombrePorUsuario);
obtenerNombrePorUsuario( nombreUsuario:string){
  return this.http.get<any>('http://localhost:3000/api/obtenerNombrePorUsuario/'+nombreUsuario);
}

}

