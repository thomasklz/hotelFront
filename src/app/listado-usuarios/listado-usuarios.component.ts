import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'app/servicios/usuario.service';
import { MatTableDataSource } from '@angular/material/table';
import swal from 'sweetalert';
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


  showDescripcionError = false; //evitando que se muestren los mensajes de campo requerido 
  showIdTipomenuError = false;//evitando que se muestren los mensajes de campo requerido
  constructor(private http:HttpClient,private UsuarioService: UsuarioService, private router: Router,private formBuilder: FormBuilder) {
    this.getAllusuarios();
    


    this.usuarioForm = new FormGroup({
      usuario: new FormControl(),
      contrasena: new FormControl(),
      nombre: new FormControl(),
      email: new FormControl(),
      telefono: new FormControl(),
      foto: new FormControl(),
    });
   }

  ngOnInit(): void {
  }

   //Modal de Modificacion Notificacion
  
 showModalEdit(){
  swal({
    title:'Datos Modificado Exitosamente',
    icon: "success",
  });
}


  //Modal de  error de Modificacion Notificacion

  showModalErrorEdit(){
    swal({
      title:'Error de Modificación de Datos ',
      icon: "error",
    });
  }



   //Modal de Eliminar Usuario Notificacion
   title= 'sweetAlert';
   showModal(){
     swal({
       title:'Usuario Eliminado Exitosamente',
       icon: "success",
     });
   }
    //Modal de error de Eliminar Usuario Notificacion
    showModalError(){
      swal({
        title:'Usuario No Eliminado Exitosamente',
        icon: "error",
      });
    }
   //obtener todos los platos 
  getAllusuarios() {
    this.UsuarioService.getusuario().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.platos);
        this.usuariosss = res.usuarios;
      },
      error: (err) => {
       // alert("Error en la carga de datos");
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
    foto: this.usuarioForm.value.foto,
    contrasena: this.usuarioForm.value.contrasena
  };
    this.UsuarioService.putusuario(datos, this.idUsuarioEditar).subscribe(
      (usuarios) => {
        console.log(usuarios);
       
        this. showModalEdit(); 
        this.getAllusuarios();
      },
      (error) => {
        console.log(error);
        this. showModalErrorEdit(); 
      }
    );
  
}
editarUsuario(item: any) {

  const contrasenaEncriptada = item.contrasena;
  const longitud = contrasenaEncriptada.length;
  const asteriscos = '*'.repeat(longitud);

  this.usuarioForm.patchValue({
    contrasena: asteriscos
  });
  this.tituloForm = 'Editar  Menu';
  this.usuarioForm.patchValue({
    usuario: item.usuario,
    nombre: item.persona.nombre,
    email: item.persona.email,
    telefono: item.persona.telefono,
    contrasena: asteriscos,
    foto: item.persona.foto

  });
  //this.getId_Tipomenu();
  this.editandousuario = true;
  this.idUsuarioEditar = item.id;
}

   eliminarusuario(id:number){
    this.UsuarioService.deleteusuario(id)
    .subscribe({
      next:(res)=>{
        this.showModal();
        
        this.getAllusuarios();
      },
      error:()=> {
        this.showModalError();
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
