import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'app/servicios/usuario.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import swal from 'sweetalert';
import swal2 from 'sweetalert';
import { ViewChild,ElementRef } from '@angular/core';
import { interval } from 'rxjs';
import * as $ from 'jquery';
@Component({
  selector: 'app-configuracion-privacidad',
  templateUrl: './configuracion-privacidad.component.html',
  styleUrls: ['./configuracion-privacidad.component.scss']
})
export class ConfiguracionPrivacidadComponent implements OnInit {
  dataSource = new MatTableDataSource<any>();
  usuariosss: any[] = [];
  idUsuario: number;
  usuarioForm!: FormGroup;
  private intervalSubscription: any;




  @ViewChild('ventanaFoto') ventanaFoto: ElementRef;

  constructor(private UsuarioService: UsuarioService, private http: HttpClient, private router: Router, private formBuilder: FormBuilder) {
    this.idUsuario = +localStorage.getItem('idUsuario');

    this.getAllusuario();

  }


  ngOnInit(): void {
    this.getAllusuario();
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


  editandox: boolean = false; // Variable para indicar si se está editando un usuario existente
  idEditar: string = ''; // Variable para almacenar el ID del usuario en caso de edición
  showDescripcionError = false; //evitando que se muestren los mensajes de campo requerido 
  showIdTipomenuError = false;//evitando que se muestren los mensajes de campo requerido 


  //-----------------------------------------Obtener----los---datos----en--la---Modal----------------------------------------------------
  editarusuario(item: any) {

    this.usuarioForm.patchValue({
      Identificacion: item.Identificacion
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
      Nombre1: item.persona.Nombre1
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
  
  

/*   onFileChange(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.usuarioForm.get('foto').setValue(file);
  }
 */

  
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
      Identificacion: this.usuarioForm.value.Identificacion

    };
    this.UsuarioService.editUsuario(datos, this.idUsuario).subscribe(
      (Identificacion) => {
        console.log(Identificacion);
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
      Nombre1: this.usuarioForm.value.Nombre1

    };
    this.UsuarioService.editNombre(datos, this.idUsuario).subscribe(
      (Nombre1) => {
        console.log(Nombre1);
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

// En tu componente
mostrarTextoCambiar: boolean = false;

  modalVisible: boolean = false;

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
    this.modalVisible = false;

    this.modalVisible = false;
    this.usuarioForm.reset();
    // Otros reinicios necesarios
  
    // Desactiva el fondo oscuro
    document.body.classList.remove('modal-open');
    const modalBackdrop = document.querySelector('.modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.remove();
    }
    this.ventanaFoto.nativeElement.style.display = 'none';
  }

}
