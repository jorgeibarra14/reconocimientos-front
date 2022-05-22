import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from "../../services/auth.service";
import { CompetenciasService } from "../../services/competencias.service";

import Swal from 'sweetalert2';
import { ColaboradoresService } from 'src/app/services/colaboradores.service';
import { ReconocimientosService } from 'src/app/services/reconocimientos.service';

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
    resultadoBusqueda: any;
    idEmpleadoLogeado: any;
    resultadoBusqueda2: any;
    conceptos: any = [
        {id: 1, descripcion: 'Carrera 1Km', puntos: 100},
        {id: 2, descripcion: 'Concurso Innovacion', puntos: 150},
        {id: 3, descripcion: 'Empleado del Mes', puntos: 200},
    ];

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<ModalAdminEditarCompetencias>,
        private fb: FormBuilder,
        private authService: AuthService,
        private colaboradorService: ColaboradoresService,
        private reconocimientosService: ReconocimientosService,
        private competenciasService: CompetenciasService
    ) {
        this.formulario = this.fb.group({
            empleado: [, [Validators.required, Validators.min(1)]],
            descripcion: [, [Validators.required, Validators.min(1)]],
            concepto: [, [Validators.required, Validators.min(1)]],
           
        });
        
        const user = this.authService.getCookieUser();
        if(user != undefined) {
            this.colaboradorService.getUserCompany(user.Id).subscribe(r => {
                this.reconocimientosService.getEmpleadosPorNombre('', this.idEmpleadoLogeado, r.id)
                    .subscribe(resp => {
                        this.resultadoBusqueda = resp
                        this.resultadoBusqueda2 = resp
                    } );
            });
          }
        this.idEmpleadoLogeado = user.Id;

    }

    displayFn(user: any): string {
        return user && user.nombreCompleto ? user.nombreCompleto : '';
      }

    
    ngOnInit() {
        if (this.data.tipo == 1) {
            this.titulo = "Editar competencia";
        }
        else {

            this.titulo = "Agregar puntos";
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