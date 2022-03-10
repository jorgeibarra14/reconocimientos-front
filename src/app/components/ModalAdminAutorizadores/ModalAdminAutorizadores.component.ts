import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AutorizadoresService } from "../../services/autorizadores.service";
import { AuthService } from "../../services/auth.service";

import Swal from 'sweetalert2';

@Component({
    selector: 'ho1a-ModalAdminAutorizadores',
    templateUrl: './ModalAdminAutorizadores.component.html',
    styleUrls: ['./ModalAdminAutorizadores.component.scss']
})
export class ModalAdminAutorizadores implements OnInit {

    formulario: FormGroup;
    enviado: boolean = false;
    autorizadoresDistintos: any = [];
    error: string;
    nombreSeleccionado: string;
    tipo: boolean = false;
    titulo: string;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<ModalAdminAutorizadores>,
        private fb: FormBuilder,
        private autorizadoresService: AutorizadoresService,
        private authService: AuthService
    ){
        this.formulario = this.fb.group({
            uen: [this.data.uen],
            area: [this.data.area],
            region: [this.data.region],
            sistema: [this.data.sistema],
            autorizador: [this.data.nombreAutorizador, [Validators.required]]
        });
        this.nombreSeleccionado=this.data.nombreAutorizador;
        this.autorizadoresDistintos =this.data.autorizadoresDistintos;
    }
    ngOnInit(){
        if (this.data.tipo == 1) {
            // this.formulario.controls['nivel'].disable();
            this.tipo = false;
            this.titulo = "Editar autorizador";
        }
        else {
            // this.formulario.controls['nivel'].enable();
            this.tipo = true;
            this.titulo = "Agregar autorizador";
        }
    }



    guardar(){
        if (this.formulario.valid) {
            this.enviado = true;
            const user = this.authService.getCookieUser();
            let envio = {
                "id": this.data.id,
                "area": this.data.area,
                "region": this.data.region,
                "sistema": this.data.sistema,
                "nombreempleadoautorizador": this.formulario.value.autorizador,
                "uen": this.data.uen,
                "activo": this.data.activo
            };
            this.autorizadoresService.editAutorizadores(envio)
                .subscribe(
                    (val) => {
                        console.log(val);
                    },
                    response => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Ocurrió un error',
                            text: 'No se modifico el autorizador.'
                        });
                        this.enviado=false;
                    },
                    () => {
                        Swal.fire({
                            title: 'Modificación exitosa!',
                            text: 'El autorizador se modifico correctamente.',
                            icon: 'success',
                            showCancelButton: false,
                            confirmButtonText: 'OK'
                        }).then((result) => {
                            if (result.value) {
                                this.dialogRef.close();
                            }
                        });
                    });
        }else{
            console.log("no enviado");
            this.enviado = false;
        }
    }

}
