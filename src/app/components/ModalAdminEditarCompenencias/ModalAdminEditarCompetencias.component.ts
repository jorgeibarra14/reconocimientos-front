import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from "../../services/auth.service";
import { CompetenciasService } from "../../services/competencias.service";

import Swal from 'sweetalert2';
import { ColaboradoresService } from 'src/app/services/colaboradores.service';
import { ReconocimientosService } from 'src/app/services/reconocimientos.service';
import { PuntosService } from 'src/app/services/puntos.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
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
    resultadoBusqueda: any = [];
    idEmpleadoLogeado: any;
    resultadoBusqueda2: any;
    conceptos: any = [];
    conceptoSelected: any = [];
    filteredOptions: Observable<any[]>;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<ModalAdminEditarCompetencias>,
        private fb: FormBuilder,
        private authService: AuthService,
        private colaboradorService: ColaboradoresService,
        private reconocimientosService: ReconocimientosService,
        private competenciasService: CompetenciasService,
        private puntosService: PuntosService
        ) {
        this.getConceptos();
        this.formulario = this.fb.group({
            empleado: [, [Validators.required]],
            justificacion: [, [Validators.required, Validators.minLength(1)]],
            concepto: [, [Validators.required]],
            actividad: [, [Validators.required]],

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

    getConceptos() {

        this.competenciasService.getConceptos().subscribe(r => {
            this.conceptos = r;
        });
    }

    setEvent(data: any) {
        this.conceptoSelected = [];
        this.conceptoSelected = data.value.eventsConcepts;
    }

    ngOnInit() {
       this.titulo = 'Agregar puntos por concepto';
       this.filteredOptions = this.formulario.controls.empleado.valueChanges.pipe(
            startWith(''),
            map(name => (name ? this._filter(name): this.resultadoBusqueda.slice())),
        );
    }

    private _filter(value: string): string[] {

        const filterValue = value.toLowerCase();
        return this.resultadoBusqueda.filter(option => option.nombreCompleto.toLowerCase().includes(filterValue));
      }

    guardar() {
        if (this.formulario.valid) {
            // this.enviado = true;
            // if (this.data.tipo == 1) {
            //     let envioUpdate = {
            //         "id": Number(this.idCompetencia),
            //         "nombre": this.formulario.controls['competencia'].value,
            //         "descripcion": this.formulario.controls['descripcion'].value,
            //         "nivel": this.data.nivel,
            //         "img": this.file,
            //         "Activo": this.activo
            //     };

            //     this.competenciasService.actualizarCompetencia(envioUpdate)
            //         .subscribe(
            //             (val) => { },
            //             response => {
            //                 Swal.fire({
            //                     icon: 'error',
            //                     title: 'Ocurri?? un error',
            //                     text: 'No se modifico la competencia.'
            //                 });
            //                 this.enviado = false;
            //             },
            //             () => {
            //                 Swal.fire({
            //                     title: 'Modificaci??n exitosa!',
            //                     text: 'La competencia se modifico correctamente.',
            //                     icon: 'success',
            //                     showCancelButton: false,
            //                     confirmButtonText: 'OK'
            //                 }).then((result) => {
            //                     if (result.value) {
            //                         this.dialogRef.close();
            //                     }
            //                 });
            //             }
            //         );
            // } else {
            //     let envioUpdate = {
            //         "nombre": this.formulario.controls['competencia'].value,
            //         "descripcion": this.formulario.controls['descripcion'].value,
            //         "nivel": this.formulario.value.nivel,
            //         "img": this.file
            //     };
            //     this.competenciasService.addCompetencia(envioUpdate)
            //         .subscribe(
            //             (val) => { },
            //             response => {
            //                 Swal.fire({
            //                     icon: 'error',
            //                     title: 'Ocurri?? un error',
            //                     text: 'No se agrego la competencia.'
            //                 });
            //                 this.enviado = false;
            //             },
            //             () => {
            //                 Swal.fire({
            //                     title: 'Registro existoso',
            //                     text: 'La competencia se agrego correctamente.',
            //                     icon: 'success',
            //                     showCancelButton: false,
            //                     confirmButtonText: 'OK'
            //                 }).then((result) => {
            //                     if (result.value) {
            //                         this.dialogRef.close();
            //                     }
            //                 });
            //             }
            //         );
            // }
            let obj = {
                idEmpleado : this.formulario.get('empleado').value.id,
                justificacion: this.formulario.get('justificacion').value,
                valor: this.formulario.get('actividad').value.points,
                tipo: this.formulario.get('concepto').value.name,
                conceptoId: this.formulario.get('actividad').value.id,
                idEmpleadoOtorga: this.idEmpleadoLogeado,
                imagen: this.file

            };

            this.puntosService.agregarPuntosTienda(obj).subscribe( r => {
                Swal.fire({
                                        title: 'Exito!',
                                        text: 'Se han otorgado los puntos al empleado',
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
        };
        fileReader.readAsDataURL(this.file);
    }

    onEmpleadoChange(e: any) {
        if (e != undefined && e != null) {

            this.resultadoBusqueda = this.resultadoBusqueda2;
            let data: any[] =  this.resultadoBusqueda
            data = data.filter(e => {
                return e.nombreCompleto.toLowerCase().includes(e)
            });
            this.resultadoBusqueda = data;

        }
    }
}
