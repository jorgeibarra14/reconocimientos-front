import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const API = environment.API;
const APIItGov = environment.APIItGov;

@Injectable({
  providedIn: 'root'
})

export class ColaboradoresService {

  constructor( private http: HttpClient ) {
  }

  getAreasColaboradores(): Observable<any> {
    return this.http.get<any>(`${API}/Colaboradores/ObtenerAreasColaborador`);
  }
  getColaboradores(): Observable<any> {
    return this.http.get<any>(`${API}/Colaboradores/ObtenerColaboradores`);
  }
  getColaboradoresByNombre(nombre: string):Observable<any>{
    return this.http.get<any>(`${API}/Colaboradores/ObtenerColaboradoresPorNombre?Nombre=` + nombre);
  }
  getUserCompany(id: string) {
    return this.http.get<any>(`${APIItGov}/user/company/${id}`);
  }
}
