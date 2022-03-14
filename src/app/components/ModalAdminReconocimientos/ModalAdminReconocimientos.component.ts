import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from "@angular/common";
import { ReconocimientosService } from '../../services/reconocimientos.service';
import { NotificacionesService } from "../../services/notificaciones.service";
import { PuntosService } from '../../services/puntos.service';
import { AuthService } from "../../services/auth.service";
import Swal from 'sweetalert2';
@Component({
    selector: 'ho1a-ModalAdminReconocimientos',
    templateUrl: './ModalAdminReconocimientos.component.html',
    styleUrls: ['./ModalAdminReconocimientos.component.scss']
})
export class ModalAdminReconocimientosComponent implements OnInit {
    formulario: FormGroup;
    enviado: boolean = false;
    puntosDisponibles: number = 0;
    idEmpleadoLogeado: Number;
    activo: Boolean;
    alertSucces: boolean = false;

    observacionEscrita: string;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<ModalAdminReconocimientosComponent>,
        private fb: FormBuilder,
        private reconocimientosService: ReconocimientosService,
        private notificacionesService: NotificacionesService,
        private puntoservice: PuntosService,
        private datePipe: DatePipe,
        private authService: AuthService
    ) {
        this.formulario = this.fb.group({
            observaciones: ['', [Validators.required, Validators.maxLength(200)]]
        });

        const user = this.authService.getCookieUser();
        this.idEmpleadoLogeado = user.Id;
        this.activo = true;
    }

    ngOnInit() {
        console.log(this.data.reconocimientoId);
        if (this.data.tipo == 0) {
            this.puntoservice.getPuntosDisponibles(this.data.idEmpleadoEnvia, this.activo).subscribe(resp =>
                this.puntosDisponibles = resp);
        }
    }
    btnCancelar() {
        this.dialogRef.close("cancel");
    }

    rechazar(button, buttonClose) {
        if (this.formulario.valid) {
            this.enviado = true;
            this.activo = false;
            const user = this.authService.getCookieUser();
            let envio = {
                "id": Number(this.data.reconocimientoId),
                "aprobado": this.activo,
                "comentario_resolucion": this.observacionEscrita,//this.formulario.value.observaciones,
                "fecha_resolucion": this.transformDate(Date.now())
            };
            this.reconocimientosService.rechazarReconocimiento(envio)
                .subscribe(
                    (val) => {
                        console.log("Reconocimeintos rechazados = ",
                            val);
                    },
                    response => {
                        console.log("Ocurrió un error:", response);
                        this.enviado = false;
                        // this.alertFailed = true;
                        Swal.fire({
                            icon: 'error',
                            title: 'Ocurrió un error',
                            text: 'Favor de contactar al administrador.'
                          });
                    },
                    () => {
                        console.log("Registro correcto");

                        this.notificacionesService.setNotificacion(this.data.reconocimientoId, this.data.idEmpleadoEnvia, 0, [this.data.reconoceA, this.observacionEscrita])
                            .subscribe(
                                (val) => {
                                    //console.log("Reconocimeintos aprobados = ", val);
                                },
                                response => {
                                    console.log("Ocurrió un error:", response);
                                    // this.alertFailed = true;
                                    // if (true) {
                                    //     setTimeout(() => {
                                    //         this.alertFailed = false;
                                    //     }, 3000);
                                    // }
                                    // this.enviado = false;
                                },
                                () => {
                                    console.log("Notificacion guardada.");
                                });

                        this.notificacionesService.EnviarCorreoNotificacion(this.data.reconocimientoId, this.data.idEmpleadoEnvia, 0, 0, [this.data.reconoceA, this.observacionEscrita])
                            .subscribe(
                                (val) => {
                                    //console.log("Reconocimeintos aprobados = ", val);
                                },
                                response => {
                                    console.log("Ocurrió un error:", response);
                                    // this.alertFailed = true;

                                    // if (true) {
                                    //     setTimeout(() => {
                                    //         this.alertFailed = false;
                                    //     }, 3000);
                                    // }

                                    // this.enviado = false;
                                },
                                () => {
                                    console.log("correo de notificacion enviado.");
                                });

                        this.aumentaPuntos();
                        this.alertSucces = true;
                        Swal.fire('Reconocimiento rechazado', ' La información se guardo correctamente.', 'success');

                        this.enviado = false;

                        // if (true) {
                        //     setTimeout(() => {
                                this.dialogRef.close();
                    //         }, 3000);
                    //     }
                    });
        } else {
            console.log("no enviado");
            this.enviado = false;
        }
    }

    aceptar(button, buttonClose) {
        this.enviado = true;
        this.activo = true;
        const comentarioResolucion = "Recononocimiento aprobado";
        const user = this.authService.getCookieUser();

        let envio = {
            "id": Number(this.data.reconocimientoId),
            "aprobado": this.activo,
            "comentario_resolucion": comentarioResolucion,
            "fecha_resolucion": this.transformDate(Date.now())
        };
        this.reconocimientosService.rechazarReconocimiento(envio)
            .subscribe(
                (val) => {
                    console.log("Reconocimeintos aprobados = ", val);
                },
                response => {
                    console.log("Ocurrió un error:", response);
                    // this.alertFailed = true;
                    Swal.fire({
                        icon: 'error',
                        title: 'Ocurrió un error',
                        text: 'Favor de contactar al administrador.'
                      });
                    // setTimeout(() => {
                    //     this.alertFailed = false;
                    // }, 3000);

                    this.enviado = false;
                },
                () => {
                    console.log("Registro correcto");
                    this.notificacionesService.setNotificacion(this.data.reconocimientoId, this.data.idEmpleadoRecibe, 1, [this.data.enviadoPor])
                        .subscribe(
                            (val) => {
                                //console.log("Reconocimeintos aprobados = ", val);
                            },
                            response => {
                                console.log("Ocurrió un error:", response);
                                // this.alertFailed = true;
                                // setTimeout(() => {
                                //     this.alertFailed = false;
                                // }, 3000);
                                // this.enviado = false;
                            },
                            () => {
                                console.log("Notificacion guardada.");
                            });

                    this.notificacionesService.EnviarCorreoNotificacion(this.data.reconocimientoId, 0, this.data.idEmpleadoRecibe, 1, [this.data.enviadoPor])
                        .subscribe(
                            (val) => {
                                //console.log("Reconocimeintos aprobados = ", val);
                            },
                            response => {
                                console.log("Ocurrió un error:", response);
                                // this.alertFailed = true;
                                // setTimeout(() => {
                                //     this.alertFailed = false;
                                // }, 3000);
                                // this.enviado = false;
                            },
                            () => {
                                console.log("Correo de notificación enviado.");
                            });

                    this.alertSucces = true;
                    Swal.fire('Reconocimiento aprobado', ' La información se guardo correctamente.', 'success');

                    this.enviado = false;

                    // setTimeout(() => {
                        this.dialogRef.close();
                    // }, 3000);
                });
    }

    transformDate(date) {
        return this.datePipe.transform(date, "yyyy-MM-dd");
    }

    aumentaPuntos() {
        this.activo = true;
        const user = this.authService.getCookieUser();
        let envioUpdate = {
            "id_empleado": this.data.idEmpleadoEnvia,
            "puntos": this.puntosDisponibles + 1,
            "activo": this.activo
        };

        this.puntoservice.actualizarPuntos(envioUpdate)
            .subscribe(
                (val) => {
                    console.log("Puntos actualizados = ", val);
                },
                response => {
                    console.log("Ocurrió un error:", response);
                },
                () => {
                    console.log("Registro correcto");
                });
    }
}
