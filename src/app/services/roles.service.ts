import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const API = environment.API;

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  urlService: string;

  constructor(private http: HttpClient) { }

  getAllRoles(): Observable<any> {
    this.urlService = `${API}/Rol/ObtenerRoles`;
    return this.http.get<any>(this.urlService);
  }

  getRolById(pIdRol: Number): Observable<any> {
    return this.http.get<any>(`${API}/Rol/ObtenerRolId?id=` + pIdRol);
  }

  updateRoles(envio: any): Observable<any> {
    return this.http.post<any>(`${API}/Rol/EditarRol`, envio);
  }

  addRoles(envio: any): Observable<any> {
    return this.http.post<any>(`${API}/Rol/AgregarRol`, envio);
  }

  deleteRoles(id: number): Observable<any> {
    this.urlService = `${API}/Rol/EliminaRol?id=` + id + ``;
    return this.http.get<any>(this.urlService);
  }
}
