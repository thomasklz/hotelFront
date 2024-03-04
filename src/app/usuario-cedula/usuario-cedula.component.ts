import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {  FormBuilder,   FormControl,   FormGroup,   Validators, } from "@angular/forms";
import { Router } from "@angular/router";
import { MatTableDataSource } from "@angular/material/table";
import swal from "sweetalert";
import swal2 from "sweetalert";
import { IngredientesService } from "../servicios/ingredientes.service";
import Swal from "sweetalert2";
import { MenuService } from "app/servicios/menu.service";
import { CreditosService } from "app/servicios/creditos.service";
import { UsuarioService } from "../servicios/usuario.service";
import { NgZone } from "@angular/core";
import { ElementRef, ViewChild } from "@angular/core";
import * as XLSX from 'xlsx';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { saveAs } from 'file-saver';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ImageService } from "app/servicios/image.service";
@Component({
  selector: 'app-usuario-cedula',
  templateUrl: './usuario-cedula.component.html',
  styleUrls: ['./usuario-cedula.component.scss']
})
export class UsuarioCedulaComponent implements OnInit {
   usuariosssCedula: any[] = [];
  personaForm!: FormGroup;

  personaForm2!: FormGroup;

  @ViewChild("inputDatalist") inputDatalist: ElementRef;
  selected = 'option2';
  dataSource = new MatTableDataSource<any>();
  constructor(private usuarioService: UsuarioService, private formBuilder: FormBuilder
    
    ,private http: HttpClient,
     private router: Router,
     private zone: NgZone,
    private changeDetector: ChangeDetectorRef,
     
    
    
    
    ) {
      this.personaForm2 = this.formBuilder.group({
        identificacion: new FormControl(),
         /*  precio: ['', Validators.required], */
       
      });

      this.personaForm = this.formBuilder.group({
       
        Identificacion: new FormControl("", [  Validators.required,]),
        Nombre1: new FormControl("", [  Validators.required,]),
        Nombre2: new FormControl("", [  Validators.required,]),
        Apellido1: new FormControl("", [  Validators.required,]),
        Apellido2: new FormControl("", [  Validators.required,]),
        TelefonoC: new FormControl("", [  Validators.required,]),
        EmailInstitucional: new FormControl("", [  Validators.required,]),
  
       /*  precio: ['', Validators.required], */
       
      });
  }

  ngOnInit() {
   
    

//para mostrar los datos que tiene personaForm
    this.personaForm = this.formBuilder.group({
       
      Identificacion: new FormControl("", [  Validators.required,]),
      Nombre1: new FormControl("", [  Validators.required,]),
      Nombre2: new FormControl("", [  Validators.required,]),
      Apellido1: new FormControl("", [  Validators.required,]),
      Apellido2: new FormControl("", [  Validators.required,]),
      TelefonoC: new FormControl("", [  Validators.required,]),
      EmailInstitucional: new FormControl("", [  Validators.required,]),
      identificacion: new FormControl(),
     /*  precio: ['', Validators.required], */
     
    });

    
    

  }

 
  identificacion: any;



  // ...

  BuscarCedula() {
    this.identificacion = this.personaForm.get('identificacion')?.value;
  
    if (this.identificacion) {
      this.usuarioService.cedula(this.identificacion).subscribe(
        (result: any) => {
          console.log("Respuesta del servicio:", result);
  
          // Asigna los valores a los controles del formulario
          this.personaForm.patchValue({
            Nombre1: result.data.Nombre1,
            Nombre2: result.data.Nombre2,
            Apellido1: result.data.Apellido1,
            Apellido2: result.data.Apellido2,
            EmailInstitucional: result.data.EmailInstitucional,
            TelefonoC: result.data.TelefonoC,
            Identificacion: result.data.Identificacion
          });
        },
        (error) => {
          console.log("Error al obtener los datos", error);
        }
      );
    } else {
      console.log("La identificación no tiene un valor");
    }
  }
  

// ...


  // Other methods or lifecycle hooks can be added here
}