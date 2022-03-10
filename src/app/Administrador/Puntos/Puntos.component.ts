import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { ModalAdminEditarPuntos } from "../../components/ModalAdminEditarPuntos/ModalAdminEditarPuntos.component";

import { AuthService } from "../../services/auth.service";
import { PuestosService } from "../../services/puestos.service";
import { PuntosService } from "../../services/puntos.service";

import Swal from 'sweetalert2';

@Component({
    selector: 'ho1a-Admin-Puntos',
    templateUrl: './Puntos.component.html',
    styleUrls: ['./Puntos.component.scss']
})
export class AdminPuntosComponent implements OnInit {

    loading: boolean = true;
    gridData: any = [];

    error: string;

    idEmpleadoLogeado: Number;
    activo: Boolean;

    constructor(
        private puestosService: PuestosService,
        private puntosService: PuntosService,
        private authService: AuthService,
        public dialog: MatDialog,
    ) {
        const user = this.authService.getCookieUser();
        this.idEmpleadoLogeado = user.Id;
        this.activo = true;

        this.allData = this.allData.bind(this);
    }
    ngOnInit() {
        this.puestosService.getAllPuestos().subscribe(resp => {
            this.gridData = resp;
            this.loading = false;
        }, error => this.error = error,
            () => {
                // console.log("getAllPuestos " + this.gridData[0].nombre);
            }
        );
    }

    abrirEditar(pId, pPuestoid, pNombre, pJerarquia, pNivel, pPuntos, pUen, pActivo) {
        const dialogRef = this.dialog.open(ModalAdminEditarPuntos, {
            width: '500px',
            data: {
                id: pId,
                puestoid: pPuestoid,
                nombre: pNombre,
                jerarquia: pJerarquia,
                nivel: pNivel,
                puntos: pPuntos,
                uen: pUen,
                activo: pActivo,
                tipo: 1
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            // console.log('The dialog was closed');
            this.loading = true;
            this.refresh();
        });
    }


    abrirNuevo() {
        const dialogRef = this.dialog.open(ModalAdminEditarPuntos, {
            width: '500px',
            data: {
                puestoid: "",
                nombre: "",
                jerarquia: "",
                nivel: "",
                puntos: "",
                uen: "",
                tipo: 2
            }
        });
    }

    refresh() {
        console.log("Refresh");
        const user = this.authService.getCookieUser();
        this.idEmpleadoLogeado = user.Id;
        this.activo = true;

        this.puestosService.getAllPuestos().subscribe(resp => {
            this.gridData = resp;
            this.loading = false;
        }, error => this.error = error,
            () => {
                // console.log("getAllPuestos " + this.gridData[0].nombre);
            }
        );

        this.loading = false;
    }

    public allData(): ExcelExportData {
        const result: ExcelExportData = {
            data: this.gridData
        };
        return result;
    }

    cortePuntos() {
        this.loading = true;
        this.puntosService.corteManualPuntos().subscribe(resp => {
            this.loading = false;
        }, response => {
            Swal.fire({
                icon: 'error',
                title: 'Corte de puntos fallido!',
                text: 'La información no se guardo correctamente.'
            });
        },
            () => {
                Swal.fire({
                    title: 'Corte de puntos exitoso!',
                    text: 'La información se guardo correctamente.',
                    icon: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                });
            }
        );
        this.loading = false;
    }
}