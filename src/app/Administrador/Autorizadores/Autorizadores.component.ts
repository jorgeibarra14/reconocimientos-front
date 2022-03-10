import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { ModalAdminAutorizadores } from "../../components/ModalAdminAutorizadores/ModalAdminAutorizadores.component";

import { AuthService } from "../../services/auth.service";
import { AutorizadoresService } from "../../services/autorizadores.service";

@Component({
    selector: 'ho1a-Admin-Autorizadores',
    templateUrl: './Autorizadores.component.html',
    styleUrls: ['./Autorizadores.component.scss']
})
export class AdminAutorizadoresComponent implements OnInit {

    loading: boolean = true;
    gridData: any = [];
    error: string;

    idEmpleadoLogeado: Number;
    activo: Boolean;

    autorizadoresDistintos: any = [];


    constructor(
        private autorizadoresService: AutorizadoresService,
        private authService: AuthService,
        public dialog: MatDialog,
    ) {
        const user = this.authService.getCookieUser();
        this.idEmpleadoLogeado = user.Id;
        this.activo = true;

        this.allData = this.allData.bind(this);
    }
    ngOnInit(){
        this.autorizadoresService.getAllAutorizadores().subscribe(resp =>{
            this.gridData = resp;
            
        }, error => this.error = error,
            () => {
                // console.log("getAllAutorizadores "+ this.gridData[0].idempleadoautorizador);
                
        this.autorizadoresService.getAutorizadoresDistinct().subscribe(resp =>{
            this.autorizadoresDistintos = resp;
            this.loading = false;
        }, error => {
            this.error = error; 
        },
            () => {     
            }
        );
            }
        );

    }

    abrirEditar(pId,pArea, pRegion, pSistema, pNombreAutorizador,pIdAutorizador, pUen, pActivo){
        const dialogRef = this.dialog.open(ModalAdminAutorizadores, {
            width: '500px',
            data: { 
                id: pId,
                area: pArea,
                region: pRegion,
                sistema: pSistema,
                nombreAutorizador: pNombreAutorizador,
                idAutorizador: pIdAutorizador,
                uen: pUen,
                activo: pActivo,
                autorizadoresDistintos: this.autorizadoresDistintos,
                tipo: 1
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            // console.log('The dialog was closed');
            this.loading = true;
            this.refresh();
        });
    }

    abrirNuevo(){
        const dialogRef = this.dialog.open(ModalAdminAutorizadores, {
            width: '500px',
            data: { 
                area: "",
                region: "",
                sistema: "",
                nombreAutorizador: "",
                idAutorizador: "",
                uen: "",
                activo: "",
                autorizadoresDistintos: this.autorizadoresDistintos,
                tipo: 2
            }
        });
    }

    refresh() {
        // console.log("Refresh");
        const user = this.authService.getCookieUser();
        this.idEmpleadoLogeado = user.Id;
        this.activo = true;

        this.autorizadoresService.getAllAutorizadores().subscribe(resp =>{
            this.gridData = resp;
            this.loading = false;
        }, error => this.error = error,
            () => {
                // console.log("getAllAutorizadores "+ this.gridData[0].idempleadoautorizador);
            }
        );
    }

    public allData(): ExcelExportData {
        const result: ExcelExportData =  {
            data: this.gridData
        };
        return result;
    }
}