import { Component, OnInit } from '@angular/core';
import {ReconocimientosService} from '../services/reconocimientos.service';
import {PuntosService} from '../services/puntos.service';
import { AuthService } from "../services/auth.service";

@Component({
    selector: 'ho1a-ReconocerAOtros',
    templateUrl: './ReconocerAOtros.component.html',
    styleUrls: ['./ReconocerAOtros.component.scss']
})
export class ReconocerAOtrosComponent implements OnInit {
    competencia_activa: string = "";
    puntosDisponibles: number = 0;

    competencias : any[];
    personas : any[];
    filtroPersonas : any[];
    buscado:boolean = false;

    idEmpleadoLogeado: string;
    puestoEmpleadoLogeado: string;
    activo: boolean;
    loading: boolean = true;

    constructor(
        private reconocimientosService: ReconocimientosService,
        private puntoService: PuntosService,
        private authService: AuthService
    ) {
            const user = this.authService.getCookieUser();
            this.idEmpleadoLogeado = user.Id;
            this.puestoEmpleadoLogeado = user.Puesto;
            this.activo = true;
        }

    ngOnInit() {
        this.puntoService.getPuntosDisponibles(this.idEmpleadoLogeado,this.activo)
                        .subscribe(resp=>this.puntosDisponibles=resp);

        this.reconocimientosService.getReconocimientosEntregados(this.idEmpleadoLogeado,this.activo,this.puestoEmpleadoLogeado)
                                    .subscribe(resp=>{
                                        this.competencias = resp;
                                        this.loading = false;
                                    });
    }

    filtrarDatos(nombreCompetencia){
        this.filtroPersonas = [];
        this.buscado = false;
        this.reconocimientosService.getReconocimientosEntregadosComp(this.idEmpleadoLogeado, nombreCompetencia, this.activo)
                                    .subscribe(resp=>{
                                        this.filtroPersonas = resp;
                                        this.buscado = true;
                                    });
        this.competencia_activa = nombreCompetencia;
    }
    borrarFiltro(){
        this.competencia_activa = "";
        this.filtroPersonas = this.personas;
    }
}
