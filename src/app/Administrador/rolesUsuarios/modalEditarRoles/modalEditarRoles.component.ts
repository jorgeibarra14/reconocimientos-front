
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RolesService } from "../../../services/roles.service";
import Swal from 'sweetalert2';

@Component({
    selector: 'ho1a-modalEditarRoles',
    templateUrl: './modalEditarRoles.component.html',
    styleUrls: ['./modalEditarRoles.component.scss']
})
export class ModalEditarRoles implements OnInit {

    formulario: FormGroup;
    idRol: number = 0;
    form_Enviado: boolean = false;
    loading: boolean = false;
    titulo: string;
    esEdicion: boolean = false;
    mostrarEdicion: boolean = true;
    mostrarEdicionAut: boolean = true;

    EsActivo = [
        { id: 1, descripcion: 'Si' },
        { id: 0, descripcion: 'No' }
    ];

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<ModalEditarRoles>,
        private fb: FormBuilder,
        private rolesService: RolesService
    ) {
        this.formulario = this.fb.group({
            nombre: ['', [Validators.required, Validators.maxLength(50)]],
            descripcion: ['', [Validators.required, Validators.maxLength(100)]],
            activo: [0, Validators.required]
        });
    }

    ngOnInit() {
        if (this.data.tipo == 2) {
            this.esEdicion = true;
            this.mostrarEdicion = true;
            this.mostrarEdicionAut= true;
            this.titulo = "Editar rol";
            if (this.data.nombre === "Administrador") {
                this.formulario.controls['nombre'].disable();
                this.formulario.controls['activo'].disable();
                this.mostrarEdicion = false;
            }else  {
                this.formulario.controls['nombre'].disable();
                this.mostrarEdicion = false;   
            }
            var act = this.data.activo ? 1 : 0;
            this.formulario.setValue({
                nombre: this.data.nombre,
                descripcion: this.data.descripcion,
                activo: act
            });
            this.idRol = this.data.id;
        }
        else if (this.data.tipo == 1) {
            this.esEdicion = false;
            this.titulo = "Agregar rol";
            this.formulario.setValue({
                nombre: '',
                descripcion: '',
                activo: 0
            });
        }
    }

    guardar() {
        this.loading = true;
        if (this.formulario.valid) {
            if (this.data.tipo == 2) {
                let envioUpdate = {
                    "id": Number(this.idRol),
                    "nombre": this.formulario.controls['nombre'].value,
                    "descripcion": this.formulario.controls['descripcion'].value,
                    "activo": Boolean(this.formulario.controls['activo'].value)
                };
                this.rolesService.updateRoles(envioUpdate)
                    .subscribe(
                        (val) => { },
                        response => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Ocurrió un error',
                                text: 'No se modificó el rol.'
                            });
                            this.loading = false;
                        },
                        () => {
                            Swal.fire({
                                title: 'Modificación exitosa',
                                text: 'El rol se modificó correctamente.',
                                icon: 'success',
                                showCancelButton: false,
                                confirmButtonText: 'OK'
                            }).then((result) => {
                                if (result.value) {
                                    this.dialogRef.close();
                                }
                            });
                            this.loading = false;
                            this.dialogRef.close();
                        }

                    );
            }
            else if (this.data.tipo == 1) {

                if (this.formulario.controls['nombre'].value === "Administrador" || this.formulario.controls['nombre'].value === "administrador") {
                    Swal.fire({
                        icon: 'warning',
                        title: '¡Atención!',
                        text: 'No es posible agregar otro rol con el nombre ' + this.formulario.controls['nombre'].value
                    });
                    this.loading = false;
                } else {
                    let envioUpdate = {
                        "id": 0,
                        "nombre": this.formulario.controls['nombre'].value,
                        "descripcion": this.formulario.controls['descripcion'].value,
                        "activo": Boolean(this.formulario.controls['activo'].value)
                    };
                    this.rolesService.addRoles(envioUpdate)
                        .subscribe(
                            (val) => { },
                            response => {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Ocurrió un error',
                                    text: 'No agregó el rol.'
                                });
                                this.loading = false;
                            },
                            () => {
                                Swal.fire({
                                    title: 'Registro exitoso',
                                    text: 'El rol se agregó correctamente.',
                                    icon: 'success',
                                    showCancelButton: false,
                                    confirmButtonText: 'OK'
                                }).then((result) => {
                                    if (result.value) {
                                        this.dialogRef.close();
                                    }
                                });
                                this.loading = false;
                                this.dialogRef.close();
                            }

                        );
                }
            }
        } else {
            this.form_Enviado = true;
            this.loading = false;
        }

    }
}