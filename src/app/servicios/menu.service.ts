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

  obtenerplatos(){
    return this.http.get<any>('http://localhost:3000/api/mostrartodoslosplatos');
  }

  obtenerplatosdeproductos(){
    return this.http.get<any>('http://localhost:3000/api/obtenerplatosdeproductos');
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

deletemenudiario(id:number){
  return this.http.delete<any>('http://localhost:3000/api/eliminarmenu/'+id);
}



/*TIPO MENU------------------------------------------------------ */



gettipomenu(){
  return this.http.get<any>('http://localhost:3000/api/mostrartipo_menu/');
}

posttipomenu(data:any){
    
  return this.http.post<any>(' http://localhost:3000/api/creartipo_menu', data);
  
}


/*CANTIDAD DE PLATOS------------------------------------------------------ */

guardarCantidadPlato(data:any, id?){
  if (id) {
    return this.http.put<any>('http://localhost:3000/api/editarcantidadplato/'+id,data);
  }else{
    return this.http.post<any>('http://localhost:3000/api/crearcantidadplato/', data);
  }
  }

  gettcantidadplatos(){
    return this.http.get<any>('http://localhost:3000/api/mostrarcantidadplato');
  }

  obtenercantidadplatoselect(){
    return this.http.get<any>('http://localhost:3000/api/obtenercantidadplatoselect');
  }

  


/* MENU------------------------------------------------------ */
gettMenu(){
  return this.http.get<any>('http://localhost:3000/api/mostrarmenu');
}



guardarMenu(data:any, id?){
  if (id) {
    return this.http.put<any>('http://localhost:3000/api/editarmenu/'+id,data);
  }else{
    return this.http.post<any>('http://localhost:3000/api/crearmenu/', data);
  }
  }



  //Mostrar las fechas
  gettfechaMenu(){
    return this.http.get<any>('http://localhost:3000/api/mostrarfechamenu');
  }
  
  gettfechaMenuregistro(){
    return this.http.get<any>('http://localhost:3000/api/mostrarfechamenuregistro');
  }
  
  //BUSCAR FECHA



  buscarmenuporfecha(fecha: string) {
    return this.http.get<any>(`http://localhost:3000/api/obtenerMenuPorFecha/${fecha}`);
  }
  

}