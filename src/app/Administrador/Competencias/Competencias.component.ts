import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { ModalAdminEditarCompetencias } from "../../components/ModalAdminEditarCompenencias/ModalAdminEditarCompetencias.component";

import { AuthService } from "../../services/auth.service";
import { CompetenciasService } from "../../services/competencias.service";
@Component({
    selector: 'ho1a-Admin-Competencias',
    templateUrl: './Competencias.component.html',
    styleUrls: ['./Competencias.component.scss']
})
export class AdminCompetenciasComponent implements OnInit {
    loading: boolean = false;
    gridData: any = [{nombre: 'JORGE ANTONIO IBARRA ORTIZ', puesto: 'DESARROLLADOR SR', concepto: 'Empleado del Mes', puntos: 200, otorga: 'ADMINISTRADOR APLAUSOS'}];
    idEmpleadoLogeado: Number;
    activo: Boolean;
    error: string;
    

    constructor(
        private competenciasService: CompetenciasService,
        private authService: AuthService,
        public dialog: MatDialog,
    ) {
        const user = this.authService.getCookieUser();
        this.idEmpleadoLogeado = user.Id;
        this.activo = true;
        this.allData = this.allData.bind(this);
    }
    ngOnInit(){
        this.getAllCompetencias();
    }

    getAllCompetencias() {
        this.activo = true;
        this.loading = true;
        this.competenciasService.getAllCompetencias().subscribe(resp =>{
            // this.gridData = resp;
            this.loading = false;
        }, error => this.error = error,
            () => {}
        );
    }

    abrirEditar(nombre, descripcion, nivel, img, id){
        const dialogRef = this.dialog.open(ModalAdminEditarCompetencias, {
            width: '500px',
            data: { 
                nombre: nombre,
                descripcion: descripcion,
                nivel: nivel,
                img: img,
                id: id,
                tipo: 1
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            this.loading = true;
            this.getAllCompetencias();
        });
    }

    abrirNuevo(){
        const dialogRef = this.dialog.open(ModalAdminEditarCompetencias, {
            width: '500px',
            data: { 
                nombre: "",
                descripcion: "",
                nivel: "",
                img: "",
                id: "",
                tipo: 2
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            // console.log('The dialog was closed');
            this.loading = true;
            this.getAllCompetencias();
        });
    }
    
    public allData(): ExcelExportData {
        const result: ExcelExportData =  {
            data: this.gridData
        };
        return result;
    }
}