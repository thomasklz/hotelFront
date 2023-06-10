import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'app/servicios/usuario.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-listado-usuarios',
  templateUrl: './listado-usuarios.component.html',
  styleUrls: ['./listado-usuarios.component.scss']
})
export class ListadoUsuariosComponent implements OnInit {

  usuario:string = ''; 
  contrasena:string = ''; 
  usuariosss:any[] = []; 
  dataSource = new MatTableDataSource<any>();
  tituloForm;
  usuarioForm!: FormGroup;
  editandousuario: boolean = false; // Variable para indicar si se está editando un usuario existente
  idUsuarioEditar: string = ''; // Variable para almacenar el ID del usuario en caso de edición
  constructor(private http:HttpClient,private UsuarioService: UsuarioService, private router: Router,private formBuilder: FormBuilder) {
    this.getAllplato();
    
   }

  ngOnInit(): void {
  }
 
   //obtener todos los platos 
  getAllplato() {
    this.UsuarioService.getusuario().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.platos);
        this.usuariosss = res.usuarios;
      },
      error: (err) => {
        alert("Error en la carga de datos");
      },
    });
  }
//Para el editar de plato usando modal
usuarioedit() {
  const datos = {
    usuario: this.usuarioForm.value.usuario,
    nombre: this.usuarioForm.value.nombre,
    email: this.usuarioForm.value.email,
    telefono: this.usuarioForm.value.telefono,
    foto: this.usuarioForm.value.foto
  };
    this.UsuarioService.guardar(datos, this.idUsuarioEditar).subscribe(
      (plato) => {
        console.log(plato);
        alert('Modificado correctamente');
       /// this.nuevoCurso(); // Restablecer el formulario después de editar
        this.getAllplato();
      },
      (error) => {
        console.log(error);
        alert('Error al guardar');
      }
    );
  
}
editarUsuario(item: any) {
  this.tituloForm = 'Editar  Menu';
  this.usuarioForm.patchValue({
    descripcion: item.descripcion,
    id_tipomenu: item.tipo_menu.id
  });
  //this.getId_Tipomenu();
  this.editandousuario = true;
  this.idUsuarioEditar = item.id;
}

   eliminarusuario(id:number){
    this.UsuarioService.deleteusuario(id)
    .subscribe({
      next:(res)=>{
        alert("usuario eliminado correctamente");
        
        this.getAllplato();
      },
      error:()=> {
        alert("Error al eliminar usuario")
      },
    })
   }

   // Restablecer el formulario cuando se cierre el modal
   closeModal() {
    this.usuarioForm.reset();
    this.editandousuario = false;
    this.idUsuarioEditar = '';
  } 

}
