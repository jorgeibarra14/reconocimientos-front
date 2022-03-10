import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from "../../../services/auth.service";
import { CategoriasService } from "../../../services/categorias.service";
import { DatePipe } from "@angular/common";
import Swal from 'sweetalert2';

@Component({
    selector: 'ho1a-ModalAdminTiendaEditarCategoria',
    templateUrl: './ModalAdminTiendaEditarCategoria.component.html',
    styleUrls: ['./ModalAdminTiendaEditarCategoria.component.scss']
})
export class ModalAdminTiendaEditarCategoria implements OnInit {

    formulario: FormGroup;
    file: any;
    idCategoria: number = 0;
    enviado: boolean = false;
    activo: boolean = true;

    nivelSeleccionado: string;
    tipo: boolean = false;
    titulo: string;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<ModalAdminTiendaEditarCategoria>,
        private fb: FormBuilder,
        private categoriasService: CategoriasService,
        private datePipe: DatePipe,
    ) {
        this.formulario = this.fb.group({
            categoria: [this.data.nombre, [Validators.required, Validators.maxLength(50)]],
            descripcion: [this.data.descripcion, [Validators.required, Validators.maxLength(1000)]],
            archivo: ['']
        });
        this.file = this.data.img;
        this.idCategoria = this.data.id;
        this.nivelSeleccionado = this.data.nivel;

    }

    vacioValidator(control: FormControl) {
        let value = control.value;
        if (value && value.length > 0 && value.trim() != "") {
            return null;
        }
        return { vacio: true };
    }

    ngOnInit() {
        if (this.data.tipo == 1) {
            this.tipo = false;
            this.titulo = "Editar categoria";
        }
        else {
            this.tipo = true;
            this.titulo = "Agregar categoria";
        }
    }

    guardar() {
        if (this.formulario.valid) {
            this.enviado = true;
            if (this.data.tipo == 1) {
                let envioUpdate = {
                    "id": Number(this.idCategoria),
                    "nombre": this.formulario.controls['categoria'].value,
                    "descripcion": this.formulario.controls['descripcion'].value,
                    "img": this.file,
                    "Activo": this.activo,
                    "fecha_creacion": this.transformDate(Date.now())
                };
                this.categoriasService.updateCategorias(envioUpdate)
                    .subscribe(
                        (val) => { },
                        response => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Ocurrió un error',
                                text: 'No se modifico la categoria.'
                            });
                            this.enviado = false;
                        },
                        () => {
                            Swal.fire({
                                title: 'Modificación exitosa!',
                                text: 'La categoria se modifico correctamente.',
                                icon: 'success',
                                showCancelButton: false,
                                confirmButtonText: 'OK'
                            }).then((result) => {
                                if (result.value) {
                                    this.dialogRef.close();
                                } else if (result.dismiss === Swal.DismissReason.cancel || result.dismiss === Swal.DismissReason.backdrop) {
                                    this.enviado = false;
                                    this.dialogRef.close();
                                    Swal.close();
                                }
                            });
                        }
                    );
            } else {
                let envioAdd = {
                    "nombre": this.formulario.controls['categoria'].value,
                    "descripcion": this.formulario.controls['descripcion'].value,
                    "img": this.file,
                    "Activo": this.activo,
                    "fecha_creacion": this.transformDate(Date.now())
                };
                this.categoriasService.addCategorias(envioAdd)
                    .subscribe(
                        (val) => { },
                        response => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Ocurrió un error',
                                text: 'No se agrego la categoria.'
                            });
                            this.enviado = false;
                        },
                        () => {
                            Swal.fire({
                                title: 'Registro existoso',
                                text: 'La categoria se agrego correctamente.',
                                icon: 'success',
                                showCancelButton: false,
                                confirmButtonText: 'OK'
                            }).then((result) => {
                                if (result.value) {
                                    this.dialogRef.close();
                                } else if (result.dismiss === Swal.DismissReason.cancel || result.dismiss === Swal.DismissReason.backdrop) {
                                    this.enviado = false;
                                    this.dialogRef.close();
                                    Swal.close();
                                }
                            });
                        }
                    );
            }
        } else {
            this.enviado = false;
        }
    }

    fileChanged(e) {
        this.file = e.target.files[0];
        this.uploadFile();
    }
    uploadFile() {
        let fileReader = new FileReader();
        fileReader.onload = (e) => {
            this.file = fileReader.result;
            //console.log("this.file");
            //console.log(this.file);
        }
        fileReader.readAsDataURL(this.file);
    }

    transformDate(date) {
        return this.datePipe.transform(date, "yyyy-MM-dd");
    }
}