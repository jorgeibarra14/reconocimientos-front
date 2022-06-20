import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { PedidosService } from '../../../services/pedidos.service';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { PuntosService } from '../../../services/puntos.service';
import { EstatusPedidoService } from '../../../services/estatusPedido.service';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';
@Component({
    selector: 'ho1a-ModalAdminstrarPedidos',
    templateUrl: './ModalAdminstrarPedidos.component.html',
    styleUrls: ['./ModalAdminstrarPedidos.component.scss']
})
export class ModalAdminstrarPedidosComponent implements OnInit {
    formulario: FormGroup;
    enviado = false;
    alertSucces = false;
    puntosDisponibles = 0;
    idEmpleadoLogeado: Number;
    activo: Boolean;

    observacionEscrita: string;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<ModalAdminstrarPedidosComponent>,
        private fb: FormBuilder,
        private pedidosService: PedidosService,
        private notificacionesService: NotificacionesService,
        private estatusPedidoService: EstatusPedidoService,
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
        if (this.data.tipo === 0) {
            this.puntoservice.getPuntosDisponibles(this.data.idEmpleadoEnvia, this.activo).subscribe(resp =>
                this.puntosDisponibles = resp);
        }
    }

    btnCancelar() {
        this.dialogRef.close();
    }

    rechazar(button, buttonClose) {
        if (this.formulario.valid) {
            this.enviado = true;
            this.activo = false;
            const user = this.authService.getCookieUser();
            const envio = {
                id: Number(this.data.id_pedido),
                aprobado: this.activo,
                comentario_resolucion: this.observacionEscrita,
                fecha_resolucion: this.transformDate(Date.now())
            };
            this.pedidosService.updatePedidos(envio).subscribe(
                    (val) => {
                        console.log('Pedido rechazado = ', val);
                    },
                    response => {
                        this.enviado = false;
                        Swal.fire({
                            icon: 'error',
                            title: 'Ocurrió un error',
                            text: 'Favor de contactar al administrador.'
                        });
                    },
                    () => {
                        // Actualizar estatus del pedido
                        const envioEstatus = {
                            id_pedido: Number(this.data.id_pedido),
                            estado: 'No autorizado'
                        };
                        this.estatusPedidoService.updatePedidosEstatusPedido(envioEstatus)
                            .subscribe(
                                (val) => {
                                    // console.log("Reconocimeintos aprobados = ", val);
                                },
                                response => {
                                    console.log('Ocurrió un error:', response);
                                    this.enviado = false;
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Ocurrió un error',
                                        text: 'Favor de contactar al administrador.'
                                    });
                                },
                                () => {
                                    console.log('Estatus actualizado.');
                                });

                        // Enviar notificacion????
                        // tslint:disable-next-line:max-line-length
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

                        // this.aumentaPuntos();
                        this.alertSucces = true;
                        Swal.fire('Pedido rechazado', ' La información se guardo correctamente.', 'success');
                        this.enviado = false;
                        this.dialogRef.close();

                    });
        } else {
            console.log('no enviado');
            this.enviado = false;
        }
    }

    aceptar(button, buttonClose) {
        this.enviado = true;
        this.activo = true;
        const comentarioResolucion = 'Pedido aprobado';
        const user = this.authService.getCookieUser();
        const envio = {
            id: this.data.id_pedido,
            aprobado: this.activo,
            comentario_resolucion: comentarioResolucion,
            fecha_resolucion: this.transformDate(Date.now()),
        };
        this.pedidosService.updatePedidos(envio)
            .subscribe(
                (val) => {
                    console.log('Pedido aprobado = ', val);
                },
                response => {
                    // console.log("Ocurrió un error:", response);
                    Swal.fire({
                        icon: 'error',
                        title: 'Ocurrió un error',
                        text: 'Favor de contactar al administrador.'
                    });

                    this.enviado = false;
                },
                () => {
                    // Actualizar estatus del pedido
                    const envioEstatus = {
                        id_pedido: Number(this.data.id_pedido),
                        estado: 'Autorizado'
                    };
                    this.estatusPedidoService.updatePedidosEstatusPedido(envioEstatus)
                        .subscribe(
                            (val) => {
                                // console.log("Reconocimeintos aprobados = ", val);
                            },
                            response => {
                                console.log('Ocurrió un error:', response);
                                this.enviado = false;
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Ocurrió un error',
                                    text: 'Favor de contactar al administrador.'
                                });
                            },
                            () => {
                                console.log('Estatus actualizado.');
                            });

                    // Enviar notificacion????
                    // tslint:disable-next-line:max-line-length
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

                    // tslint:disable-next-line:max-line-length
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
                    Swal.fire('Pedido aprobado', ' La información se guardo correctamente.', 'success');
                    this.enviado = false;
                    this.dialogRef.close();
                });
    }

    cambiar(button, buttonClose, type)  {
        this.enviado = true;
        this.activo = true;
        const user = this.authService.getCookieUser();
        const comentarioResolucion = type === 2 ? this.observacionEscrita : type === 1 ? 'Autorizado' : 'En Transito';

        const envio = {
            id: this.data.id_pedido,
            aprobado: this.activo,
            comentario_resolucion: comentarioResolucion,
            fecha_resolucion: this.transformDate(Date.now()),
        };
        this.pedidosService.updatePedidos(envio)
            .subscribe(
                (val) => {
                    console.log('Pedido = ', val);
                },
                response => {
                    console.log('Ocurrió un error:', response);
                    Swal.fire({
                        icon: 'error',
                        title: 'Ocurrió un error',
                        text: 'Favor de contactar al administrador.'
                    });

                    this.enviado = false;
                },
                () => {
                    // Actualizar estatus del pedido
                  const estatus = type === 2 ? 'No autorizado' : type === 1 ? 'Autorizado' : 'En Transito';
                  const envioEstatus = {
                        id_pedido: Number(this.data.id_pedido),
                        estado: estatus
                    };
                  this.estatusPedidoService.updatePedidosEstatusPedido(envioEstatus).subscribe(
                            (val) => {
                                console.log('Reconocimeintos aprobados = ', val);
                            },
                            response => {
                                console.log('Ocurrió un error:', response);
                                this.enviado = false;
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Ocurrió un error',
                                    text: 'Favor de contactar al administrador.'
                                });
                            },
                            () => {
                                console.log('Estatus actualizado.');
                            });
                  this.alertSucces = true;
                  Swal.fire('Pedido modificado', ' La información se guardo correctamente.', 'success');
                  this.enviado = false;
                  this.dialogRef.close();
                });
    }

    transformDate(date) {
        return this.datePipe.transform(date, 'yyyy-MM-dd');
    }

    aumentaPuntos() {
        this.activo = true;
        const user = this.authService.getCookieUser();
        const envioUpdate = {
            id_empleado: this.data.idEmpleadoEnvia,
            puntos: this.puntosDisponibles + 1,
            activo: this.activo
        };

        this.puntoservice.actualizarPuntos(envioUpdate)
            .subscribe(
                (val) => {
                    console.log('Puntos actualizados = ', val);
                },
                response => {
                    console.log('Ocurrió un error:', response);
                },
                () => {
                    console.log('Registro correcto');
                });
    }
}
