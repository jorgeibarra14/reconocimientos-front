import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { RowClassArgs } from '@progress/kendo-angular-grid';
import { PuntosService } from 'src/app/services/puntos.service';
import { ModalAdminEditarCompetencias } from "../../components/ModalAdminEditarCompenencias/ModalAdminEditarCompetencias.component";

import { AuthService } from "../../services/auth.service";
import { CompetenciasService } from "../../services/competencias.service";
@Component({
    selector: 'ho1a-Admin-competencias',
    templateUrl: './competencias.component.html',
    styleUrls: ['./competencias.component.scss']
})
export class AdminConceptosPuntosComponent implements OnInit {
    loading: boolean = false;
    gridData: any = [];
    idEmpleadoLogeado: Number;
    activo: Boolean;
    error: string;
    

    constructor(
        private ConceptosPuntosService: CompetenciasService,
        private authService: AuthService,
        private puntosService: PuntosService,
        public dialog: MatDialog,
    ) {
        const user = this.authService.getCookieUser();
        this.idEmpleadoLogeado = user.Id;
        this.activo = true;
        this.allData = this.allData.bind(this);
    }
    ngOnInit(){
        this.getAllConceptosPuntos();
        
    }

    public rowCallback = (context: RowClassArgs) => {
        return context.dataItem.rechazado ?  {started: true} :  { started: false};
    }

    getAllConceptosPuntos() {
        this.activo = true;
        this.loading = true;
        this.puntosService.obtenerPuntosAsignadosPorConceptos().subscribe(resp =>{
            this.gridData = resp;
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
            this.getAllConceptosPuntos();
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
            this.getAllConceptosPuntos();
        });
    }
    
    public allData(): ExcelExportData {
        const result: ExcelExportData =  {
            data: this.gridData
        };
        return result;
    }
}