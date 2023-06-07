import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatDialogRef,MAT_DIALOG_DATA,MatDialog } from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import { MenuService } from 'app/servicios/menu.service';

import {MatPaginator} from '@angular/material/paginator';
import { data } from 'jquery';
import { error } from 'console';



MenuService
@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {



  displayedColumns: string[] = ['id', 'id_tipomenu', 'descripcion','estado', 'accion'];
  dataSource = new MatTableDataSource<any>;
  id:string = ''; 
  estado: boolean= true;
  descripcion:string = ''; 
  listatipomenusss:any[] = [];
  id_tipomenu:string = '';
  tipomenusss:any[] = []; 
  actionBtn:string='Guardar'
  platosss:any[] = []; 
  tituloForm;
  constructor(private http:HttpClient,private MenuService: MenuService, private router: Router,private formBuilder: FormBuilder) {

    this.loadmenuplato();
    
   }
 

 
   loadmenuplato(){
    this.http
    .get("http://localhost:3000/api/mostrarplato/").subscribe((result:any)=>{
      this.platosss= result.platos;
    })
   }
   //Parar Guardar el id del combo selection-------------------------------------------------------


getId_Tipomenu(){
  this.http
    .get("http://localhost:3000/api/creartipo_menu?="+this.id_tipomenu).subscribe((result:any)=>{
      this.tipomenusss= result.platos;
    })

}


menuForm!:FormGroup;
 

 
  ngOnInit() {

    
//     this.menuForm= this.formBuilder.group({
    
//       descripcion: new FormControl("", Validators.minLength(3)),
//       id_tipomenu: new FormControl("",Validators.maxLength(1)),
//       funcion:['']

//  });
 this.loadmenuplato();
 this.getAllplato();
}

getAllplato(){
  debugger
  this.MenuService.gettplato()
  .subscribe({
    next:(res)=>{
      debugger
     // this.dataSource= new MatTableDataSource(res);
      this.dataSource = new MatTableDataSource(res.platos);
      //this.dataSource.paginator= this.paginator;
      
    },
    error:(err)=> {
      debugger
      alert("Error en la carga de datos")
    },
  })
 }



 
nuevoCurso(){
  this.tituloForm='Registro de Menu';
  
  
  this.menuForm.patchValue({
    id: 'null' ,
    descripcion: '',
    id_tipomenu: 'null' 
  });
}

editarPlato(platoId: number) {
  this.tituloForm='Editar  Menu';
  // Obtener los datos del plato mediante el ID utilizando un servicio
  const plato = this.platosss.find(item => item.id === platoId);

  // Asignar los valores al formulario
  this.menuForm.patchValue({
    descripcion: plato.descripcion,
    id_tipomenu: plato.id_tipomenu, 
    funcion:plato.id,
    
  });
  this.loadmenuplato();
  // Otros pasos que puedas necesitar realizar
}
  
  
/*addMenu(){

const datos ={
  descripcion : this.menuForm.value.descripcion,
  id_tipomenu : this.menuForm.value.id_tipomenu,
}

if (this.menuForm.value.funcion==='') {
  this.MenuService.guardar(datos)
  .subscribe(
    platos => console.log(platos),
    error=> console.log(error),
    
  )

  
} else {
  this.MenuService.guardar(datos, this.menuForm.value.funcion)
  .subscribe(
    plato => console.log(plato),
    
  )

 
}
this.loadmenuplato();
}*/

addMenu() {
  const datos = {
    descripcion: this.menuForm.value.descripcion,
    id_tipomenu: this.menuForm.value.id_tipomenu,
  };
  

  if (this.menuForm.value.funcion === '') {
    
    this.MenuService.guardar(datos).subscribe(
      platos => {
        console.log(platos);
        alert('Guardado correctamente');
        this.loadmenuplato();

      },
      error => {
        console.log(error);
        alert('Error al guardar');
      }
    );
  } else {
    this.MenuService.guardar(datos, this.menuForm.value.funcion).subscribe(
      plato => {
        console.log(plato);
        alert('modificado correctamente');
        this.loadmenuplato();
        window.location.reload();
      },
      error => {
        console.log(error);
        alert('Error al guardar');
      }
    );
  }

  
}


/*--------------------------------------------------------------------------------- */


loadplato(){
  this.http
  .get("http://localhost:3000/api/mostrarplato/").subscribe((resultado:any)=>{
    this.listatipomenusss= resultado.platos;
  })
  this.getAllplato();
 }

 



 

 eliminarPlato(id:number){
  this.MenuService.deleteplato(id)
  .subscribe({
    next:(res)=>{
      alert("Plato eliminado correctamente");
      this.getAllplato();
      this.loadmenuplato();
    },
    error:()=> {
      alert("Error al eliminar plato")
    },
  })
 }


 

}
