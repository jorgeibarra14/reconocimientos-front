import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const API = environment.API;
const ITGOVAPI = environment.APIItGov;

@Injectable({
  providedIn: 'root'
})

export class PuntosService {
  urlService: string;

  constructor( private http: HttpClient ) {
    // console.log("Puntos Service");
  }

  getPuntosDisponibles(pIdEmpleadoLogeado: string, pActivo: Boolean): Observable<any> {
    // console.log("Metodo getPuntosDisponibles()");
    this.urlService = `${API}/Puntos/ObtenerPuntosDisponibles?id_empleado=` + pIdEmpleadoLogeado + `&activo=` + pActivo + ``;
    return this.http.get<any>(this.urlService);
  }

  actualizarPuntos(value: any): Observable<any> {
    // console.log("Metodo actualizarPuntos()");
    return this.http.post<any>(`${API}/Puntos/ActualizarPuntosReconocimiento`, value);
  }

  corteManualPuntos(): Observable<any> {
    // console.log("Metodo corteManualPuntos()");
    return this.http.get<any>(`${API}/Puntos/CorteManualDePuntos`);
  }

  agregarPuntos(data: any): Observable<any> {
    return this.http.post<any>(`${API}/Puntos/CorteManualDePuntos`, data);
  }

  agregarPuntosTienda(data): Observable<any> {
    return this.http.post<any>(`${API}/Puntos/agregarPuntosTienda`, data);
  }

  obtenerPuntosAsignadosPorConceptos(): Observable<any> {
    return this.http.get<any>(`${ITGOVAPI}/EventsConcepts/getListPointsByConcept`);

  }

}
