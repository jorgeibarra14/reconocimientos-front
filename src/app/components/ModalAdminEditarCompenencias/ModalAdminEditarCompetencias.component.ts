import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from "../../services/auth.service";
import { CompetenciasService } from "../../services/competencias.service";

import Swal from 'sweetalert2';

@Component({
    selector: 'ho1a-ModalAdminEditarCompetencias',
    templateUrl: './ModalAdminEditarCompetencias.component.html',
    styleUrls: ['./ModalAdminEditarCompetencias.component.scss']
})
export class ModalAdminEditarCompetencias implements OnInit {

    formulario: FormGroup;
    file: any;
    idCompetencia: number = 0;
    enviado: boolean = false;
    activo: boolean = true;
    
    niveles = [
        { descripcion: 'NIVEL 1' },
        { descripcion: 'NIVEL 2' },
        { descripcion: 'NIVEL 3' },
        { descripcion: 'NIVEL 4' },
        { descripcion: 'NIVEL 5' },
        { descripcion: 'NIVEL 6' },
        { descripcion: 'NIVEL 7' },
        { descripcion: 'NIVEL 8' },
    ];

    nivelSeleccionado: string;
    tipo: boolean = false;
    titulo: string;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<ModalAdminEditarCompetencias>,
        private fb: FormBuilder,
        private competenciasService: CompetenciasService
    ) {
        this.formulario = this.fb.group({
            competencia: [this.data.nombre, [Validators.required, Validators.maxLength(50)]],
            descripcion: [this.data.descripcion, [Validators.required, Validators.maxLength(1000)]],
            // nivel: [{ value: '-1', disabled: true }, [Validators.required, this.nivelValidator.bind(this)]],
            nivel: [{ value: '-1', disabled: true }],
            archivo: [this.data.img, [Validators.required, this.vacioValidator.bind(this)]]
        });
        this.file = this.data.img;
        this.idCompetencia = this.data.id;
        this.nivelSeleccionado = this.data.nivel;

    }

    nivelValidator(control: FormControl) {
        let value = control.value;
        if (value && value != "-1" && this.data.tipo == 2) {
            let result = this.niveles.find(el => el.descripcion != "--Selecciona--");
            if (!result) {
                return {
                    notAllow: true
                }
            } else {
                return null;
            }
        }
        return { notAllow: true };
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
            this.formulario.controls['nivel'].disable();
            this.tipo = false;
            this.titulo = "Editar competencia";
        }
        else {
            this.formulario.controls['nivel'].enable();
            this.tipo = true;
            this.titulo = "Agregar competencia";
        }
    }

    guardar() {
        if (this.formulario.valid) {
            this.enviado = true;
            if (this.data.tipo == 1) {
                let envioUpdate = {
                    "id": Number(this.idCompetencia),
                    "nombre": this.formulario.controls['competencia'].value,
                    "descripcion": this.formulario.controls['descripcion'].value,
                    "nivel": this.data.nivel,
                    "img": this.file,
                    "Activo": this.activo
                };
                this.competenciasService.actualizarCompetencia(envioUpdate)
                    .subscribe(
                        (val) => { },
                        response => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Ocurrió un error',
                                text: 'No se modifico la competencia.'
                            });
                            this.enviado = false;
                        },
                        () => {
                            Swal.fire({
                                title: 'Modificación exitosa!',
                                text: 'La competencia se modifico correctamente.',
                                icon: 'success',
                                showCancelButton: false,
                                confirmButtonText: 'OK'
                            }).then((result) => {
                                if (result.value) {
                                    this.dialogRef.close();
                                }
                            });
                        }
                    );
            } else {
                let envioUpdate = {
                    "nombre": this.formulario.controls['competencia'].value,
                    "descripcion": this.formulario.controls['descripcion'].value,
                    "nivel": this.formulario.value.nivel,
                    "img": this.file
                };
                this.competenciasService.addCompetencia(envioUpdate)
                    .subscribe(
                        (val) => { },
                        response => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Ocurrió un error',
                                text: 'No se agrego la competencia.'
                            });
                            this.enviado = false;
                        },
                        () => {
                            Swal.fire({
                                title: 'Registro existoso',
                                text: 'La competencia se agrego correctamente.',
                                icon: 'success',
                                showCancelButton: false,
                                confirmButtonText: 'OK'
                            }).then((result) => {
                                if (result.value) {
                                    this.dialogRef.close();
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
}