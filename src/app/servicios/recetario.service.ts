import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecetarioService {

  constructor( private http:HttpClient) { }

  crearRecetario(data:any){
    return this.http.post<any>('http://localhost:3000/api/crearRecetario',data);
  }

  getproductosporid( id?){
    return this.http.get<any>('http://localhost:3000/api/obtenerrecetario_PorPlato/'+id);
  }


  obtenerplatosdeproductos(){
    return this.http.get<any>('http://localhost:3000/api/obtenerplatosdeproductosRecetario');
  }
  deleteproductoPlato(id:number){
    return this.http.delete<any>('http://localhost:3000/api/eliminarRecetario/'+id);
  }


  
  buscarPlatoRecetario(params: any) {
    // Asegúrate de que params sea un objeto con la propiedad 'descripcion'
    const descripcion = params.descripcion;
  
    // Envía la solicitud GET con la descripción del plato como parámetro de ruta
    return this.http.get<any>(`http://localhost:3000/api/buscarPlatoRecetario/${descripcion}`);
  }
  
  
  
  crearplatoconIngrediente(data:any){
    return this.http.post<any>('http://localhost:3000/api/crearplatoconIngrediente',data);
  }
  

  getplatoconIngredienteporid( id?){
    return this.http.get<any>('http://localhost:3000/api/obtenerproductosplatos_PorPlato_platoconIngrediente/'+id);
  }

  getobtenerDescripcionPlatoproductos( id?){
    return this.http.get<any>('http://localhost:3000/api/obtenerDescripcionplatoconIngrediente/'+id);
  }
  

  obtenerListaplatosconIngrediente(){
    return this.http.get<any>('http://localhost:3000/api/obtenerListaplatosconIngrediente');
  }

}
 