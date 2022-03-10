import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalAdminstrarPedidosComponent } from 'src/app/AdministrarTienda/InicioStore/ModalAdminstrarPedidos/ModalAdminstrarPedidos.component';
import { ReconocimientosService } from '../../services/reconocimientos.service';
import { PedidosService } from 'src/app/services/pedidos.service';
//import { NotificacionesService } from "../../services/notificaciones.service";
import { DatePipe, getLocaleDateTimeFormat  } from "@angular/common";
import { AuthService } from "../../services/auth.service";

import Swal from 'sweetalert2';

@Component({
    selector: 'ho1a-Admin-InicioStore',
    templateUrl: './InicioStore.component.html',
    styleUrls: ['./InicioStore.component.scss']
})
export class AdminInicioStoreComponent implements OnInit {

    idEmpleadoLogeado: Number;
    activo: Boolean;
    error: string;

    loading: boolean = true;
    gridData: any = "";
    expandedDetailKeys: any[] = [];

    constructor(
        private reconocimientosService: ReconocimientosService,
        private pedidosService: PedidosService,
        public dialog: MatDialog,
        private datePipe: DatePipe,
        private authService: AuthService
    ) {
        const user = this.authService.getCookieUser();
        this.idEmpleadoLogeado = user.Id;
        this.activo = true;
    }

    ngOnInit() {
        // this.pedidosService.getPedidos()
        //     .subscribe(resp => {
        //         console.log(resp);
        //         this.gridData = resp;
        //         this.loading = false;
        //     }, err => {
        //         console.log("Ocurrió un error en getPedidos");
        //         this.loading = false;
        //     })
        this.obtenerPedidios();
    }
    expandDetailsBy = (dataItem: any): any => {
        return dataItem.id;
    };

    rechazar(id: Number): void {
        const dialogRef = this.dialog.open(ModalAdminstrarPedidosComponent, {
            width: '500px',
            data: {
                tipo: 0,
                pedidoId: id
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.loading = true;
            this.obtenerPedidios();
        });
    }

    aceptar(id: Number) {
        const dialogRef = this.dialog.open(ModalAdminstrarPedidosComponent, {
            width: '500px',
            data: {
                tipo: 1,
                pedidoId: id
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.loading = true;
            this.obtenerPedidios();
        });
    }

    transformDate(date) {
        return this.datePipe.transform(date, "yyyy-MM-dd");
    }

    obtenerPedidios() {
        this.pedidosService.getPedidos()
            .subscribe(resp => {
                console.log(resp);
                this.gridData = resp;
                this.loading = false;

            }, err => {
                console.log("Ocurrió un error en getPedidos");
                this.loading = false;
            })
    }

    resuelto(comentario_resolucion: string, fecha_resolucion: string): boolean {
        if (comentario_resolucion !== null && fecha_resolucion !== null)  {
            return true;
        }else {
            return false;
        }
    }
}