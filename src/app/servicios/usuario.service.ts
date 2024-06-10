import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor( private http:HttpClient, private https:HttpClient,) { }

  gettipousuario(){
    return this.http.get<any>('http://localhost:3000/api/mostrartipo_usuario/');
  }
  getlistadoadministradores(){
    return this.http.get<any>('http://localhost:3000/api/listadoadministradores/');
  }
  

  postusuario(data:any){
    return this.http.post<any>('http://localhost:3000/api/crearUsuario/', data);
    
  }

  crearPersonaCliente(data:any){
    return this.http.post<any>('http://localhost:3000/api/crearPersonaCliente/', data);
    
  }
  

  getusuario(){
    return this.http.get<any>('http://localhost:3000/api/mostrarusuario/');
  }

  obtenerusuarioestado(){
    return this.http.get<any>('http://localhost:3000/api/obtenerusuarioestado/');
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

cedula (cedula: any) {
  const params = new HttpParams().set("identificacion",cedula);
  const headers= new HttpHeaders({
    'Content-Type':'application/x-www-form-urlencoded',
  });
  const body ={};
  return this.http.post<any>('https://servicios.espam.edu.ec/Datos/personainfo', body,{params,headers});
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

/* editFoto(data:any, id:number){
  return this.http.put<any>('http://localhost:3000/api/editFoto/'+id,data);
} */
 
editFoto(id: number, formData: FormData) {
  return this.http.post<any>(`http://localhost:3000/api/persona/imagen/${id}`, formData);
}


//rotuer.get('/obtenerNombrePorUsuario/:nombreUsuario', obtenerNombrePorUsuario);
obtenerNombrePorUsuario( nombreUsuario:string){
  return this.http.get<any>('http://localhost:3000/api/obtenerNombrePorUsuario/'+nombreUsuario);
}

}

