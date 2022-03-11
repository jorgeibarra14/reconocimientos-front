import { ConfigService } from './../services/config.service';
import { ColaboradoresService } from './../services/colaboradores.service';
import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
import { ReconocimientosService } from '../services/reconocimientos.service';
import { AuthService } from "../services/auth.service";

@Component({
  selector: 'ho1a-Inicio',
  templateUrl: './Inicio.component.html',
  styleUrls: ['./Inicio.component.scss']
})

export class InicioComponent implements OnInit {

  // puntosAcumulados: number = -1;
  // puntosDisponibles: number = -1;
  idEmpleadoLogeado:Number;
  activo:Boolean;
  loading: boolean = false;
  user: any = {
    Nombre: "",
    Id: 0,
    Foto:""
  };
  //Pruebas
  ejecutivos: any[] = [
    { top: 1, nombre: "Nombre Ejecutivo 1", puesto: "Puesto Ejecutivo", ciudad: "Ciudad" },
    { top: 2, nombre: "Nombre Ejecutivo 2", puesto: "Puesto Ejecutivo", ciudad: "Ciudad" },
    { top: 3, nombre: "Nombre Ejecutivo 3", puesto: "Puesto Ejecutivo", ciudad: "Ciudad" },
    { top: 4, nombre: "Nombre Ejecutivo 4", puesto: "Puesto Ejecutivo", ciudad: "Ciudad" },
    { top: 5, nombre: "Nombre Ejecutivo 5", puesto: "Puesto Ejecutivo", ciudad: "Ciudad" },
  ];
  ejecutivoTop1: any = {
    nombre: "",
    puesto: "",
    ciudad: ""
  };
  ejecutivosTop2Al4: any[] = [];
  puntosDisponibles: Number = 0;
  company: any = {
    color: "",
    isoLogo: "",
    logo: "",
    name: "",
    prefix: ""
  };
  unidadValor = "";
  accionSingular = '';
  accionPlural = '';
  banner = '';
  constructor(
    // private router: Router,
    private reconocimientosService: ReconocimientosService,
    // private reconocimientosService: ReconocimientosService,
    private authService: AuthService,
    private colaboradorService: ColaboradoresService,
    private configService: ConfigService
    ) {
      this.user = this.authService.getCookieUser();
      this.idEmpleadoLogeado = this.user.Id ;
      this.activo = true;

      if(this.user != undefined) {
        this.colaboradorService.getUserCompany(this.user.Id).subscribe(r => {
          this.company = r;
        });
      }

      this.configService.getConfig(this.user.AppId).subscribe((r: any) => {
        r.forEach(element => {
          if(element.key == 'unidad_valor') {
            this.unidadValor = element.value;
          }
          if(element.key == 'accion_plural') {
            this.accionPlural = element.value;
          }
          if(element.key == 'accion_singular') {
            this.accionSingular = element.value;
          }
          if(element.key == 'banner_inicio') {
            this.banner = element.value;
          }
        });
      });
  }

  ngOnInit() {
    this.loading = true;
    this.reconocimientosService.getPuntosAcumulados(this.idEmpleadoLogeado,this.activo).subscribe(resp=>{
      this.puntosDisponibles=resp;
      this.loading = false;
    });
    /**
     * FALTA EL SERVICIO DE GET_EJECUTIVOS
     */
    this.ejecutivos.forEach((ej) => {
      if(ej.top == 1){
        this.ejecutivoTop1 = ej;
      }else{
        this.ejecutivosTop2Al4.push(ej);
        this.ejecutivosTop2Al4.sort(function(a, b): number{
          if(a.top > b.top ){
            return 1;
          }
          if(a.top < b.top ){
            return -1;
          }
          return 0;
        });
      }
    });
  }
}
