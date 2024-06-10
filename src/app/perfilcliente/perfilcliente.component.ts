import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'app/servicios/usuario.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import swal from 'sweetalert';
import swal2 from 'sweetalert';
import { ViewChild ,ElementRef} from '@angular/core';
import { interval } from 'rxjs';


import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { CreditosService } from 'app/servicios/creditos.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';








declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
 
  { path: '/editardatosperfil', title: ' Configuración y privacidad',  icon:'settings', class: '' },

  
 
   { path: '/login', title: ' Cerrar sesión',  icon:'exit_to_app', class: '' },
     
  
  
];
@Component({
  selector: 'app-perfilcliente',
  templateUrl: './perfilcliente.component.html',
  styleUrls: ['./perfilcliente.component.scss']
})
export class PerfilclienteComponent implements OnInit {

  dataSource = new MatTableDataSource<any>();
  usuariosss: any[] = [];
  idUsuario: number;
  usuarioForm!: FormGroup;
  location: Location;
  usuario:any;
  id:any;
  nombre: any;

  private intervalSubscription: any;


  menuItems: any[];

  currentRoute: string;

   
    private listTitles: any[];
       mobile_menu_visible: any = 0;
    private toggleButton: any;
    private sidebarVisible: boolean;
   

  constructor(location: Location,private UsuarioService: UsuarioService,private element: ElementRef, private http: HttpClient, private router: Router, private formBuilder: FormBuilder) {
    this.idUsuario = +localStorage.getItem('idUsuario');
    this.currentRoute = this.router.url;

    this.getAllusuario();

    this.location = location;
   
    this.usuario= localStorage.getItem('usuario');
    this.id= localStorage.getItem('idPersona'); 
    this.nombre= localStorage.getItem('nombre'); 
    this.menuItems = ROUTES.filter(menuItem => menuItem);



  }


  ngOnInit(): void {
    this.getAllusuario();
    setInterval(() => {
      this.getAllusuario();
      
    }, 5000);






  
    this.listTitles = ROUTES.filter(listTitle => listTitle);
    const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
    this.router.events.subscribe((event) => {
      this.sidebarClose();
       var $layer: any = document.getElementsByClassName('close-layer')[0];
       if ($layer) {
         $layer.remove();
         this.mobile_menu_visible = 0;
       }
   });


    this.usuarioForm = this.formBuilder.group({
      Identificacion: new FormControl("", [Validators.required, Validators.minLength(3)]),
      Nombre1: new FormControl("", [Validators.required, Validators.maxLength(1)]),
      EmailInstitucional: new FormControl("", [Validators.required, Validators.maxLength(1)]),
      TelefonoC: new FormControl("", [Validators.required, Validators.maxLength(1)]),
      contrasena: new FormControl("", [Validators.required, Validators.maxLength(1)]),
      foto: new FormControl("", [Validators.required, Validators.maxLength(1)]),
    });
    // Realizar actualizaciones cada 5 segundos (ajusta el tiempo según tus necesidades)
    this.intervalSubscription = interval(100).subscribe(() => {
      this.getAllusuario();
    });
  }
  ngOnDestroy(): void {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }









  selectedFile: File | null = null;
  

  selectedImage: string | null = null;  // Add this line
   





  // Método para manejar el cambio en el input de archivo
  onFileChange(event: any): void {
    const file = (event.target as HTMLInputElement).files[0];
    this.selectedFile = file;
    this.displaySelectedImage();
  }
  
  // Método para mostrar la vista previa de la nueva imagen
  displaySelectedImage(): void {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImage = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.selectedImage = null;
    } }

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;

  clearFileInput(input: ElementRef<HTMLInputElement>): void {
    input.nativeElement.value = ''; // Clear the input value
  }
 







 
    

  editandox: boolean = false; // Variable para indicar si se está editando un usuario existente
  idEditar: string = ''; // Variable para almacenar el ID del usuario en caso de edición
  showDescripcionError = false; //evitando que se muestren los mensajes de campo requerido 
  showIdTipomenuError = false;//evitando que se muestren los mensajes de campo requerido 


  //-----------------------------------------Obtener----los---datos----en--la---Modal----------------------------------------------------
  editarusuario(item: any) {

    this.usuarioForm.patchValue({
      usuario: item.usuario
    });
    this.editandox = true;
    this.idEditar = item.id;

    // Establecer variables a false al editar
    this.showDescripcionError = false;
    this.showIdTipomenuError = false;
  }

  editarcontrasena(item: any) {

    // Establecer variables a false al editar
    this.showDescripcionError = false;
    this.showIdTipomenuError = false;
    this.usuarioForm.reset();
  }


  editarnombre(item: any) {

    this.usuarioForm.patchValue({
      nombre: item.persona.nombre
    });

    this.editandox = true;
    this.idEditar = item.id;

    // Establecer variables a false al editar
    this.showDescripcionError = false;
    this.showIdTipomenuError = false;
  }
  editaremail(item: any) {

    this.usuarioForm.patchValue({
      EmailInstitucional: item.persona.EmailInstitucional
    });

    this.editandox = true;
    this.idEditar = item.id;

    // Establecer variables a false al editar
    this.showDescripcionError = false;
    this.showIdTipomenuError = false;
  }
  editartelefono(item: any) {

    this.usuarioForm.patchValue({
      TelefonoC: item.persona.TelefonoC
    });

    this.editandox = true;
    this.idEditar = item.id;

    // Establecer variables a false al editar
    this.showDescripcionError = false;
    this.showIdTipomenuError = false;
  }

 
  isMaps(path){
    var titlee = this.location.prepareExternalUrl(this.location.path());
    titlee = titlee.slice( 1 );
    if(path == titlee){
        return false;
    }
    else {
        return true;
    }
}
  modalVisible: boolean = false;
  editarfoto(item: any) {
    this.modalVisible = true;
  
    // Verificar si la propiedad imagenUrl está definida
    if (item.persona.foto) {
      // Mostrar la imagen actual del usuario
      this.selectedImage = 'http://localhost:3000/imagenes/' + item.persona.foto;
    } else {
      // Si imagenUrl no está definida, podrías construir la URL en el cliente
      this.selectedImage = `/uploads/imagenes/usuario/${item.persona.foto}`;
    }
  
    // Establecer otras propiedades necesarias para la edición
    this.editandox = true;
    this.idEditar = item.id;
  
    // Establecer variables a false al editar
    this.showDescripcionError = false;
    this.showIdTipomenuError = false;
  }

  //Modal de Modificacion Notificacion
  showModalEdit() {
    swal2({
      title: 'Datos modificado exitosamente',
      icon: "success",
    });
  }


  //Modal de  error de Modificacion Notificacion
  showModalErrorEdit() {
    swal({
      title: 'Error de modificación de datos ',
      icon: "error",
    });
  }

  //obtener el usuario 
  getAllusuario() {
    this.UsuarioService.buscarUsuario(this.idUsuario).subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.usuario);
        this.usuariosss = res.usuario;

      },
      error: (err) => {
        // Maneja el error de carga de datos aquí
      },
    });
  }
  //------------------------------------------------------Metodos--de----Editar----------------------------------------------------------------------------------------------
  //editar usuario
  editarUsuario() {

    const datos = {
      usuario: this.usuarioForm.value.usuario

    };
    this.UsuarioService.editUsuario(datos, this.idUsuario).subscribe(
      (usuario) => {
        console.log(usuario);
        this.showModalEdit();

      },
      (error) => {
        console.log(error);
        this.showModalErrorEdit();
      }
    );
  }
  //editar nombre
  editarNombre() {

    const datos = {
      nombre: this.usuarioForm.value.nombre

    };
    this.UsuarioService.editNombre(datos, this.idUsuario).subscribe(
      (nombre) => {
        console.log(nombre);
        this.showModalEdit();

      },
      (error) => {
        console.log(error);
        this.showModalErrorEdit();
      }
    );
  }

  //editar email
  editarEmail() {

    const datos = {
      EmailInstitucional: this.usuarioForm.value.EmailInstitucional

    };
    this.UsuarioService.editEmail(datos, this.idUsuario).subscribe(
      (EmailInstitucional) => {
        console.log(EmailInstitucional);
        this.showModalEdit();

      },
      (error) => {
        console.log(error);
        this.showModalErrorEdit();
      }
    );
  }

  //editar telefono
  editarTelefono() {

    const datos = {
      TelefonoC: this.usuarioForm.value.TelefonoC

    };
    this.UsuarioService.editTelefono(datos, this.idUsuario).subscribe(
      (TelefonoC) => {
        console.log(TelefonoC);
        this.showModalEdit();

      },
      (error) => {
        console.log(error);
        this.showModalErrorEdit();
      }
    );
  }

  //editar contraena
  editarContrasena() {

    const datos = {
      contrasena: this.usuarioForm.value.contrasena,


    };
    this.UsuarioService.editContrasena(datos, this.idUsuario).subscribe(
      (contrasena) => {
        console.log(contrasena);
        this.showModalEdit();

      },
      (error) => {
        console.log(error);
        this.showModalErrorEdit();
      }
    );
  }


  //editar FOTO
  editarFoto() {
    if (this.selectedFile) {
      // Create a FormData object to append the file
      const formData = new FormData();
      formData.append('image', this.selectedFile);

      // Call the API to edit the photo
      this.UsuarioService.editFoto(this.idUsuario, formData).subscribe(
        (response) => {
          console.log('Image edited successfully', response);
          // Optionally, close the modal or perform any other necessary action
          this.modalVisible = false;
          this.showModalEdit();
          
        },
        (error) => {
          console.error('Error editing image', error);
          // Handle errors appropriately
        }
      );
       
    } else {
      // Handle the case where no file is selected
      console.warn('No file selected');
    }
    this.closeModal();
  }



  // Restablecer el formulario cuando se cierre el modal
  closeModal() {
    this.usuarioForm.reset();
    // this.editandoPlato = false;
    //   this.idPlatoEditar = '';
  }

  logout() {
    localStorage.removeItem('idPersona');
    localStorage.removeItem('idUsuario');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }
  showModalcerrar() {
    Swal.fire({
      title: '¿Estás seguro que deseas cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
     
      confirmButtonText: 'Sí, cerrar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#bf0d0d',
      
      
    }).then((result) => {
      if (result.isConfirmed) {
        this.logout();
      }
    });
  }








  isMobileMenu() {
    if ($(window).width() > 991) {
        return false;
    }
    return true;
};
  
  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const body = document.getElementsByTagName('body')[0];
    setTimeout(function(){
        toggleButton.classList.add('toggled');
    }, 500);

    body.classList.add('nav-open');

    this.sidebarVisible = true;
};
sidebarClose() {
    const body = document.getElementsByTagName('body')[0];
    this.toggleButton.classList.remove('toggled');
    this.sidebarVisible = false;
    body.classList.remove('nav-open');
};


  sidebarToggle() {
    // const toggleButton = this.toggleButton;
    // const body = document.getElementsByTagName('body')[0];
    var $toggle = document.getElementsByClassName('navbar-toggler')[0];

    if (this.sidebarVisible === false) {
        this.sidebarOpen();
    } else {
        this.sidebarClose();
    }
    const body = document.getElementsByTagName('body')[0];

    if (this.mobile_menu_visible == 1) {
        // $('html').removeClass('nav-open');
        body.classList.remove('nav-open');
        if ($layer) {
            $layer.remove();
        }
        setTimeout(function() {
            $toggle.classList.remove('toggled');
        }, 400);

        this.mobile_menu_visible = 0;
    } else {
        setTimeout(function() {
            $toggle.classList.add('toggled');
        }, 430);

        var $layer = document.createElement('div');
        $layer.setAttribute('class', 'close-layer');


        if (body.querySelectorAll('.main-panel')) {
            document.getElementsByClassName('main-panel')[0].appendChild($layer);
        }else if (body.classList.contains('off-canvas-sidebar')) {
            document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
        }

        setTimeout(function() {
            $layer.classList.add('visible');
        }, 100);

        $layer.onclick = function() { //asign a function
          body.classList.remove('nav-open');
          this.mobile_menu_visible = 0;
          $layer.classList.remove('visible');
          setTimeout(function() {
              $layer.remove();
              $toggle.classList.remove('toggled');
          }, 400);
        }.bind(this);

        body.classList.add('nav-open');
        this.mobile_menu_visible = 1;

    }
}
  
}
