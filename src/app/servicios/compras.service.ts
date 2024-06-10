import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {

  constructor( private http:HttpClient) { }

  gestionarAlimento (data:any){
    
    return this.http.post<any>('http://localhost:3000/api/gestionarAlimento', data);
  
  }
  mostrarCompra(){
    return this.http.get<any>('http://localhost:3000/api/mostrarCompra');
  }

  mostrarCompraAlimmentosReportes(){
    return this.http.get<any>('http://localhost:3000/api/mostrarCompraAlimmentosReportes');
  }


  mostrarCompraExistente(){
    return this.http.get<any>('http://localhost:3000/api/mostrarCompraExistente');
  }

  mostrarNoCompraExistente(){
    return this.http.get<any>('http://localhost:3000/api/mostrarCompraNoExistente');
  }

<<<<<<< HEAD
  buscarFechaCompra(fecha: string) {
    // Corrección en la construcción de la URL
    return this.http.get<any>(`http://localhost:3000/api/buscarFechaCompra/${fecha}`);
  }

=======
>>>>>>> e6df002d2919446f51cf1ac3f2d5186f3bb16342
   deletealimentos(id:number){
    return this.http.delete<any>('http://localhost:3000/api/eliminaralimentoCompra/'+id);
  }

  
}
