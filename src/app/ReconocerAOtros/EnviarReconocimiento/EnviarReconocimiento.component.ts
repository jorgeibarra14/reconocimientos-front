import { Component, OnInit, Input } from '@angular/core';
import { CompetenciasService } from '../../services/competencias.service';
import { ReconocimientosService } from '../../services/reconocimientos.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from "@angular/common";
import { PuntosService } from '../../services/puntos.service';
import { AuthService } from "../../services/auth.service";
import { stringify } from '@angular/compiler/src/util';
import { valHooks } from 'jquery';
import Swal from 'sweetalert2';
import { ColaboradoresService } from 'src/app/services/colaboradores.service';

@Component({
    selector: 'ho1a-EnviarReconocimiento',
    templateUrl: './EnviarReconocimiento.component.html',
    styleUrls: ['./EnviarReconocimiento.component.scss']
})
export class EnviarReconocimientoComponent implements OnInit {
    @Input() matAutocomplete: any;
    formulario: FormGroup;
    enviado: boolean = false;
    activo: boolean;
    resultadoBusqueda: any[];
    resultadoBusqueda2: any[];
    buscandoEmpleados: boolean = false;
    buscandoEmpleadosSubscription: any = null;
    competencias: any[];
    result: string;
    control = new FormControl();
    empleadoSeleccionado: string;
    puntosDisponibles: number = 0;
    idEmpleadoLogeado: string;
    existeReconocimientoEntregado: number = 0;

    loading: boolean = true;
    company: any = {
        color: "",
        isoLogo: "",
        logo: "",
        name: "",
        prefix: ""
      };
    constructor(
        private fb: FormBuilder,
        private competenciaService: CompetenciasService,
        private reconocimientosService: ReconocimientosService,
        private puntoservice: PuntosService,
        private datePipe: DatePipe,
        private authService: AuthService,
        private colaboradorService: ColaboradoresService
    ) {
        this.activo = true;
        const user = this.authService.getCookieUser();
        if(user != undefined) {
            this.colaboradorService.getUserCompany(user.Id).subscribe(r => {
                this.reconocimientosService.getEmpleadosPorNombre('', this.idEmpleadoLogeado, r.id)
                    .subscribe(resp => {
                        this.resultadoBusqueda = resp
                        this.resultadoBusqueda2 = resp
                    } );
            });
          }
        this.idEmpleadoLogeado = user.Id;

        this.formulario = this.fb.group({
            id_empleado_envia: user.Id,
            id_empleado_recibe: ['', [Validators.required, this.empleadoValidator.bind(this)]],
            id_competencia: [{ value: '-1', disabled: true }, [Validators.required, this.competenciaValidator.bind(this)]],
            motivo: ['', [Validators.required, this.vacioValidator.bind(this), Validators.maxLength(1000)]],
            logro: ['', [Validators.required, this.vacioValidator.bind(this), Validators.maxLength(1000)]],
            activo: true,
            fecha_registro: this.transformDate(Date.now())
        });

        
    }

    ngOnInit() {
        this.resultadoBusqueda = [];
        this.puntoservice.getPuntosDisponibles(this.idEmpleadoLogeado, this.activo)
            .subscribe(resp => {
                this.puntosDisponibles = resp;
                this.loading = false;
            });
    }

    competenciaValidator(control: FormControl) {
        let value = control.value;
        if (value && value != "-1") {
            let result = this.competencias.find(el => el.id == value);
            if (!result) {
                return {
                    notAllow: true
                }
            } else {
                return null;
            }
        }
        return { notAllow: true };
    }

    vacioValidator(control: FormControl) {
        let value = control.value;
        if (value && value.length > 0 && value.trim() != "") {
            return null;
        }
        return { vacio: true };
    }

    empleadoValidator(control: FormControl) {
      let value = control.value;
      if (value && value.id != null) {
          let result = this.resultadoBusqueda.find(el => el.id == value.id);
          if (!result) {
              this.formulario.controls['id_competencia'].disable();
              return {
                  notAllow: true
              }
          } else {
              this.competenciaService.getCompetencias(this.activo, result.nivelPuesto).subscribe(resp =>
                  this.competencias = resp);

              this.formulario.controls['id_competencia'].enable();
              return null;
          }
      }
      return { notAllow: false };
  }

    enviarReconocimiento(button) {
        if (this.formulario.valid) {
            this.enviado = true;
            this.activo = true;
            const user = this.authService.getCookieUser();

            this.puntoservice.getPuntosDisponibles(user.Id, this.activo)
                .subscribe(resp => this.puntosDisponibles = resp);
                let envio = {
                    "id_empleado_envia": user.Id,
                    "id_empleado_recibe": this.formulario.value.id_empleado_recibe.id,
                    "id_competencia": Number(this.formulario.value.id_competencia),
                    "motivo": this.formulario.value.motivo,
                    "logro": this.formulario.value.logro
                };

                this.reconocimientosService.addReconocimiento(envio)
                    .subscribe(
                        (val) => {
                            console.log("Reconocimeintos guardados = ",
                                val);
                        },
                        response => {
                            if (response.error.text === "Rechazo por sistema") {
                                this.enviado = false;
                                Swal.fire({
                                    icon: 'warning',
                                    title: 'Rechazado por sistema',
                                    text: 'No es posible reconocer dos veces al mismo colaborador en un periodo menor de seis meses.'
                                });
                                this.formulario.reset();
                            }else{
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Ocurrió un error',
                                    text: 'Favor de contactar al administrador.'
                                });
                                this.enviado = false;
                            }
                        },
                        () => {

                            this.descuentaPuntos();

                            this.enviado = false;
                            this.formulario.reset();
                            Swal.fire({
                                title: 'Enviado a autorización',
                                text: 'La información se guardó correctamente.',
                                icon: 'success',
                                allowOutsideClick: false
                            }).then(
                                (result) =>{
                                    this.puntoservice.getPuntosDisponibles(this.idEmpleadoLogeado, this.activo)
                                    .subscribe(resp => {
                                        this.puntosDisponibles = resp;
                                    });
                                });
                        });
        } else {
            console.log("no enviado");
            this.enviado = false;
        }
    }



    onEmpleadoChange(nombreEmpleado: string) {
      if (nombreEmpleado != undefined && nombreEmpleado != null) {

          this.resultadoBusqueda = this.resultadoBusqueda2;
          let data: any[] =  this.resultadoBusqueda
          data = data.filter(e => {
              return e.nombreCompleto.toLowerCase().includes(nombreEmpleado)
          });
          console.log(this.competencias);
          this.resultadoBusqueda = data;
          console.log(this.empleadoSeleccionado);

      }
  }

    descuentaPuntos() {
        this.activo = true;
        const user = this.authService.getCookieUser();

        let envioUpdate = {
            "id_empleado": user.Id,
            "puntos": this.puntosDisponibles - 1,
            "activo": this.activo
        };

        this.puntoservice.actualizarPuntos(envioUpdate)
            .subscribe(
                (val) => {
                    console.log("Puntos actualizados = ", val);
                },
                response => {
                    console.log("Ocurrió un error:", response);
                });
    }

    nivelDefault() {
        if (this.competencias != undefined) {
            if (this.competencias.length == 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Favor de seleccionar otro empleado',
                    text: 'No existen competencias asociadas al nivel del empleado seleccionado, contacte al administrador.'
                });
            }
        }
    }

    transformDate(date) {
        return this.datePipe.transform(date, "yyyy-MM-dd");
    }

    closeAlerts() {
    }

    displayFn(user: any): string {
      return user && user.nombreCompleto ? user.nombreCompleto : '';
    }
}
