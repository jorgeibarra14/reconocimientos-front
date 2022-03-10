import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PuestosService } from "../../services/puestos.service";
import { AuthService } from "../../services/auth.service";

import Swal from 'sweetalert2';

@Component({
    selector: 'ho1a-ModalAdminEditarPuntos',
    templateUrl: './ModalAdminEditarPuntos.component.html',
    styleUrls: ['./ModalAdminEditarPuntos.component.scss']
})
export class ModalAdminEditarPuntos implements OnInit {

    formulario: FormGroup;
    enviado: boolean = false;

    tipo: boolean = false;
    titulo: string;

    niveles = [
        { descripcion: 'NIVEL 1', value: '1' },
        { descripcion: 'NIVEL 2', value: '2' },
        { descripcion: 'NIVEL 3', value: '3' },
        { descripcion: 'NIVEL 4', value: '4' },
        { descripcion: 'NIVEL 5', value: '5' },
        { descripcion: 'NIVEL 6', value: '6' },
        { descripcion: 'NIVEL 7', value: '7' },
        { descripcion: 'NIVEL 8', value: '8' },
    ];

    nivelSeleccionado: string;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<ModalAdminEditarPuntos>,
        private fb: FormBuilder,
        private puestosService: PuestosService,
        private authService: AuthService
    ) {
        this.formulario = this.fb.group({
            puesto: [this.data.nombre],
            jerarquia: [this.data.jerarquia],
            nivel: [{ value: this.data.nivel, disabled: false }, [Validators.required, this.nivelValidator.bind(this)]],
            puntos: [this.data.puntos, [Validators.required, Validators.min(1), Validators.pattern('[0-9]*')]]
        });

        this.nivelSeleccionado = this.data.nivel;
    }
    nivelValidator(control: FormControl) {
        let value = control.value;
        if (value && (value == "NIVEL 1" || value == "NIVEL 2" || value == "NIVEL 3" || value == "NIVEL 4" || value == "NIVEL 5" || value == "NIVEL 6" || value == "NIVEL 7" || value == "NIVEL 8")) {
            return null;
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
            this.tipo = true;
            this.titulo = "Editar puntos";
        }
        else {
            this.tipo = true;
            this.titulo = "Agregar puntos";
        }
    }

    guardar() {
        if (this.formulario.valid) {
            this.enviado = true;
            const user = this.authService.getCookieUser();
            let envio = {
                "id": this.data.id,
                "puestoid": this.data.puestoid,
                "nombre": this.data.nombre,
                "nivel": this.formulario.value.nivel,
                "puntos": this.formulario.value.puntos,
                "uen": this.data.uen,
                "jerarquia": this.data.jerarquia,
                "activo": this.data.activo
            };
            this.puestosService.editPuestos(envio)
                .subscribe(
                    (val) => {
                        console.log(val);
                    },
                    response => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Ocurrió un error',
                            text: 'No se modificó la información.'
                        });
                        this.enviado = false;
                    },
                    () => {
                        Swal.fire({
                            title: 'Modificación exitosa!',
                            text: 'Información modificada correctamente.',
                            icon: 'success',
                            showCancelButton: false,
                            confirmButtonText: 'OK'
                        }).then((result) => {
                            if (result.value) {
                                this.dialogRef.close();
                            }
                        });
                    });

        } else {
            console.log("no enviado");
            this.enviado = false;
        }
    }
}
