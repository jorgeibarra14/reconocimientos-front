import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalAdminReconocimientosComponent } from 'src/app/components/ModalAdminReconocimientos/ModalAdminReconocimientos.component';
import { ReconocimientosService } from '../../services/reconocimientos.service';
//import { NotificacionesService } from "../../services/notificaciones.service";
import { DatePipe } from "@angular/common";
import { AuthService } from "../../services/auth.service";

import Swal from 'sweetalert2';
import { RowClassArgs } from '@progress/kendo-angular-grid';

@Component({
    selector: 'ho1a-Admin-Inicio',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './Inicio.component.html',
    styleUrls: ['./Inicio.component.scss']
})
export class AdminInicioComponent implements OnInit {

    idEmpleadoLogeado: string;
    activo: Boolean;
    error: string;

    loading: boolean = true;
    gridData: any = "";

    constructor(
        private reconocimientosService: ReconocimientosService,
        public dialog: MatDialog,
        private datePipe: DatePipe,
        private authService: AuthService
    ) {
        const user = this.authService.getCookieUser();
        this.idEmpleadoLogeado = user.Id;
        this.activo = true;
    }

    ngOnInit() {
        this.reconocimientosService.getReconocimientosPorAutorizar(this.idEmpleadoLogeado, this.activo).subscribe(resp => {
            this.gridData = resp;
            this.loading = false;
        }, error => this.error = error,
            () => {

            }
        );
    }

    public rowCallback = (context: RowClassArgs) => {
        return !context.dataItem.activo ?  {started: true} :  { started: false};

       }
    rechazar(id: number, id_empleado_envia: number, id_empleado_recibe: number, reconoceA: string): void {
        const dialogRef = this.dialog.open(ModalAdminReconocimientosComponent, {
            width: '500px',
            data: {
                tipo: 0,
                reconocimientoId: id,
                idEmpleadoEnvia: id_empleado_envia,
                idEmpleadoRecibe: id_empleado_recibe,
                reconoceA: reconoceA
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            this.loading = true;
            this.refresh(result);
        });
    }

    aceptar(id: Number, id_empleado_envia: number, id_empleado_recibe: number, enviadoPor: string, event: any) {
        const dialogRef = this.dialog.open(ModalAdminReconocimientosComponent, {
            width: '500px',
            data: {
                tipo: 1,
                reconocimientoId: id,
                idEmpleadoEnvia: id_empleado_envia,
                idEmpleadoRecibe: id_empleado_recibe,
                enviadoPor: enviadoPor
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            //console.log(result);
            this.loading = true;
            this.refresh(result);
        });
    }

    transformDate(date) {
        return this.datePipe.transform(date, "yyyy-MM-dd");
    }

    refresh(result) {
        console.log("Refresh");
        const user = this.authService.getCookieUser();
        this.idEmpleadoLogeado = user.Id;
        this.activo = true;

        this.reconocimientosService.getReconocimientosPorAutorizar(this.idEmpleadoLogeado, this.activo).subscribe(resp => {
            this.gridData = resp;
        }, error => this.error = error,
            () => {
                this.loading = false;
            }
        );
    }


}