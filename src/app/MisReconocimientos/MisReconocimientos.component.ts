import { Component, OnInit } from '@angular/core';
import {ReconocimientosService} from '../services/reconocimientos.service';
import { AuthService } from "../services/auth.service";
import { PuntosService } from '../services/puntos.service';

@Component({
    selector: 'ho1a-MisReconocimientos',
    templateUrl: './MisReconocimientos.component.html',
    styleUrls: ['./MisReconocimientos.component.scss']
})
export class MisReconocimientosComponent implements OnInit {
    competencias : any[];
    personas : any[];

    filtroPersonas : any[];
    competencia_activa: string = "";
    buscado: boolean = false;
    puntosAcumulados: number = 0;
    puntosSigNivel: number = 0;
    porcentajeSigNivel: number = 0;
    niveles: any[] = [
        { nivel: 1, img: "../assets/img/mis_reconocimientos/Disquette-blanco.png", maxPuntos: 50 },
        { nivel: 2, img: "../assets/img/mis_reconocimientos/USB-blanco.png", maxPuntos: 99 },
        { nivel: 3, img: "../assets/img/mis_reconocimientos/Disco_duro-blanco.png", maxPuntos: 499 },
        { nivel: 4, img: "../assets/img/mis_reconocimientos/Servidor-blanco.png", maxPuntos: 599 },
        { nivel: 5, img: "../assets/img/mis_reconocimientos/Megacable_Data_Center-blanco.png", maxPuntos: -1 }
    ];
    nivelActual: any = { nivel: 1, img: "" };
    nivelSig: any = { nivel: 1, img: "" };

    idEmpleadoLogeado: string;
    puestoEmpleadoLogeado: string;
    activo: boolean;
    loading: boolean = true;

    constructor(
        private reconocimientosService: ReconocimientosService,
        private authService: AuthService
    ) {     
        const user = this.authService.getCookieUser();   
        this.idEmpleadoLogeado = user.Id;    
        this.puestoEmpleadoLogeado = user.Puesto;  
        this.activo = true;
    }

    ngOnInit() {   
        this.reconocimientosService.getMisReconocimientos(this.idEmpleadoLogeado,this.activo,this.puestoEmpleadoLogeado)
            .subscribe(resp=>{
                this.competencias = resp;
                // this.loading = false;
                this.reconocimientosService.getPuntosAcumulados(this.idEmpleadoLogeado,this.activo).subscribe(resp=>{
                        this.puntosAcumulados=resp;
                        // this.puntosAcumulados = 1500;
                        this.mostrarNiveles();
                        this.loading = false;
                    });
            });
    }

    filtrarDatos(nombreCompetencia){
        this.filtroPersonas = [];
        this.buscado = false;
        this.reconocimientosService.getMisReconocimientosComp(this.idEmpleadoLogeado, nombreCompetencia, this.activo)
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
    mostrarNiveles(){
        this.niveles.forEach( (el, index) =>{
            if( (this.niveles[index + 1] && 
                this.puntosAcumulados > this.niveles[index].maxPuntos && this.puntosAcumulados <= this.niveles[index + 1].maxPuntos) ||
                (el.nivel == 1 && el.maxPuntos > this.puntosAcumulados)
            ){
                this.nivelActual = el;
                this.nivelSig = this.niveles[index + 1];
                //Calcular puntos faltantes
                this.puntosSigNivel = this.niveles[index + 1].maxPuntos - this.puntosAcumulados;
                this.porcentajeSigNivel = (this.puntosAcumulados * 100) / this.niveles[index + 1].maxPuntos;
            }
            // Verificar que los puntos sean mayor al último nivel
            if( this.niveles[index - 1] && this.niveles[index - 1].maxPuntos < this.puntosAcumulados && el.nivel == 5 ){
                this.nivelActual = el;
                this.nivelSig = {
                    img: ""
                };
            }
        })
    }
}
