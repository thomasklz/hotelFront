import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IngredientesService {

  constructor( private http:HttpClient) { }


  //obtener ingredientes
  

  //obtener ingredientes
  getingrediente(){
    return this.http.get<any>('http://localhost:3000/api/mostraringredientes');
  }


  obtenerplatosdeingredientes(){
    return this.http.get<any>('http://localhost:3000/api/obtenerplatosdeingredientes');
  }

  



 //obtener ingredientes
 getingredienteporid( id?){
  return this.http.get<any>('http://localhost:3000/api/obtenerIngredientesPorPlato/'+id);
}



getobtenerDescripcionPlato( id?){
  return this.http.get<any>('http://localhost:3000/api/obtenerDescripcionPlato/'+id);
}

getobtenerDescripcionPlatoPrecio( id?){
  return this.http.get<any>('http://localhost:3000/api/obtenerDescripcionPlatoyprecio/'+id);
}

  //Crear y Modificar ingredientes
  guardar(data:any, id?){
    if (id) {
      return this.http.put<any>('http://localhost:3000/api/editaringredientes/'+id,data);
    }else{
      return this.http.post<any>('http://localhost:3000/api/crearingredientes', data);
    }
    }


    //eliminar ingredientes
    deleteingrediente(id:number){
      return this.http.delete<any>('http://localhost:3000/api/eliminaringredientes/'+id);
    }





 //Crear y Modificar productos para su plato
 guardarproductosconsuplato(data:any, id?){
  if (id) {
    return this.http.put<any>('http://localhost:3000/api/editaringredientes/'+id,data);
  }else{
    return this.http.post<any>('http://localhost:3000/api/crearingredientesconsuplato', data);
  }
  }

  getproductosporid( id?){
    return this.http.get<any>('http://localhost:3000/api/obtenerproductosplatos_PorPlato/'+id);
  }
  getobtenerDescripcionPlatoproductos( id?){
    return this.http.get<any>('http://localhost:3000/api/obtenerDescripcionPlatoproductos/'+id);
  }

//buscar ingrediente fecha y plato

buscarFechaYPlato(id: number, fecha: string) {
  return this.http.get<any>(`http://localhost:3000/api/buscarPorFecha/${id}/${fecha}`);
}

   
}
