import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const API = environment.API;

@Injectable({
  providedIn: 'root'
})
export class ReconocimientosService {
  urlService: string;

  constructor( private http: HttpClient ) { }

  getPuntosAcumulados(pIdEmpleadoLogeado: string, pActivo: Boolean): Observable<any> {
    // console.log("Reconocimientos.service - getPuntosAcumulados()");
    this.urlService = `${API}/Reconocimiento/ObtenerPuntosAcumulados?id_empleado_recibe=` +
      pIdEmpleadoLogeado + `&activo=` + pActivo + ``;
    return this.http.get<any>(this.urlService);
  }
  getMisReconocimientos(pIdEmpleadoLogeado: string, pActivo: Boolean, pPuestoEmpleadoLogeado: string): Observable<any> {
    // console.log("Reconocimientos.service - getMisReconocimientos()");
    return this.http.get<any>(`${API}/Reconocimiento/ObtenerMisReconocimientos?id_empleado_recibe=` +
      pIdEmpleadoLogeado + `&activo=` + pActivo + `&nombrePuesto=` + pPuestoEmpleadoLogeado + ``);
  }

  getMisReconocimientosComp(pIdEmpleadoLogeado: string, pNombreCompetencia: string, pActivo: Boolean): Observable<any> {
    // console.log("Reconocimientos.service - getMisReconocimientosComp()");
    return this.http.get<any>(`${API}/Reconocimiento/ObtenerMisReconocimientosComp?id_empleado_recibe=` + pIdEmpleadoLogeado +
      `&nombreCompetencia=` + pNombreCompetencia + `&activo=` + pActivo + ``);
  }

  getReconocimientosEntregados(pIdEmpleadoLogeado: string, pActivo: Boolean, pPuestoEmpleadoLogeado: string): Observable<any> {
    // console.log("Reconocimientos.service - getReconocimientosEntregados()");
    return this.http.get<any>(`${API}/Reconocimiento/ObtenerReconocimientosEntregados?id_empleado_envia=` +
      pIdEmpleadoLogeado + `&activo=` + pActivo + `&nombrePuesto=` + pPuestoEmpleadoLogeado + ``);
  }

  getReconocimientosEntregadosComp(pIdEmpleadoLogeado: string, pNombreCompetencia: string, pActivo: Boolean): Observable<any> {
    // console.log("Reconocimientos.service - getReconocimientosEntregadosComp()");
    return this.http.get<any>(`${API}/Reconocimiento/ObtenerReconocimientosEntregadosComp?id_empleado_envia=` +
      pIdEmpleadoLogeado + `&nombreCompetencia=` + pNombreCompetencia + `&activo=` + pActivo + ``);
  }

  getEmpleadosPorNombre(pNombre: string, idEmpleadoLogeado: string, companyId: number): Observable<any> {
    // console.log("Reconocimientos.service - getEmpleadosNombre()");
    return this.http.get<any>(`${API}/Autorizadores/ObtenerInformacionODS/${idEmpleadoLogeado}/${companyId}`);
  }

  getEmpleadosPorId(pId: string): Observable<any> {
    // console.log("Reconocimientos.service - getEmpleadosId()");
    return this.http.get<any>(`${API}/Reconocimiento/ObtenerEmpleadosPorId?Id=` + pId + ``);
  }

  addReconocimiento(value: any): Observable<any> {
    // console.log("Reconocimientos.service - GuardarReconocimiento()");
    return this.http.post<any>(`${API}/Reconocimiento/Reconocer`, value);
  }

  getReconocimientosPorAutorizar(pIdEmpleadoLogeado: string, pActivo: Boolean): Observable<any> {
    // console.log("Reconocimientos.service - getReconocimientosEntregados()");
    return this.http.get<any>(`${API}/Reconocimiento/ObtenerReconocimientosPorAutorizar?id_empleado_autorizador=` +
      pIdEmpleadoLogeado + `&activo=` + pActivo + ``);
  }

  rechazarReconocimiento(value: any): Observable<any> {
    // console.log("Reconocimientos.service - rechazarReconocimiento()");
    return this.http.post<any>(`${API}/Reconocimiento/RechazarReconocimiento`, value);
  }

  aprobarReconocimiento(value: any): Observable<any> {
    // console.log("Reconocimientos.service - aprobarReconocimiento()");
    return this.http.post<any>(`${API}/Reconocimiento/AprobarReconocimiento`, value);
  }

  getReconocimientoEntregado(pIdEmpleadoLogeado: string, pIdEmpleadorecibe: string, pActivo: Boolean): Observable<any> {
    // console.log("Reconocimientos.service - getReconocimientoEntregado()");
    this.urlService = `${API}/Reconocimiento/ValidarReconociminetoEntregado?pId_empleado_recibe=` + pIdEmpleadorecibe +
    `&id_empleado_envia=` + pIdEmpleadoLogeado + `&activo=` + pActivo + ``;
    return this.http.get<any>(this.urlService);
  }

  getTopReconocidos() {
    return this.http.get<any>(`${API}/Reconocimiento/ObtenerTopReconocidos`);
  }

  getMisPuntosConcepto(id_empleado: string): Observable<any> {
    return this.http.get<any>(`${API}/Reconocimiento/conceptosPuntos?id_empleado_recibe=${id_empleado}`);
  }
}
