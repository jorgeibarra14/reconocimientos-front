import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const API = environment.API;

@Injectable({
  providedIn: 'root'
})
export class PuestosService {
  urlService:string;

  constructor( private http: HttpClient ) { }

  getNivelPuestoPorNombre(pNombre: string): Observable<any> {
    // console.log("PuestosService.service - getNivelPuestoPorNombre()");
    return this.http.get<any>(`${API}/Puestos/ConsultarNivelPuestoPorNombre?Nombre=` + pNombre+ ``);
  }

  getAllPuestos():Observable<any>{
    // console.log("Metodo getAllPuestos()");
    this.urlService = `${API}/Puestos/ConsultarPuestos`;
    return this.http.get<any>(this.urlService);
  }

  editPuestos(value: any): Observable<any> {
    // console.log("Metodo actualizarPuestos()");
    return this.http.post<any>(`${API}/Puestos/EditarPuesto`, value);
  }

  addPuestos(value: any): Observable<any> {
    // console.log("Metodo addPuestos()");
    return this.http.post<any>(`${API}/Puestos/AgregarPuesto`, value);
  }
}