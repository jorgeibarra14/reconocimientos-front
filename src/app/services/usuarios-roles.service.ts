import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const API = environment.API;

@Injectable({
  providedIn: 'root'
})
export class UsuariosRolesService {
  constructor(private http: HttpClient) { }

  getAllUsuarioRol(): Observable<any> {
    return this.http.get<any>(`${API}/UsuarioRol/ObtenerUsuarioRol`);
  }

  getUsuarioRol(pIdEmpleadoLogeado: Number): Observable<any> {
    return this.http.get<any>(`${API}/UsuarioRol/ObtenerUsuarioRolIdEmpleado?id_empleado=` + pIdEmpleadoLogeado);
  }

  getUsuarioRolById(id: Number): Observable<any> {
    return this.http.get<any>(`${API}/UsuarioRol/ObtenerUsuarioRolById?id=` + id);
  }

  addUsuarioRol(envio: any): Observable<any> {
    return this.http.post<any>(`${API}/UsuarioRol/AgregarUsuarioRol`, envio);
  }

  updateUsuarioRol(envio: any): Observable<any> {
    return this.http.post<any>(`${API}/UsuarioRol/EditarUsuarioRol`, envio);
  }

  deleteUsuarioRol(id: number): Observable<any> {
    return this.http.get<any>(`${API}/UsuarioRol/EliminaUsuarioRol?id=` + id + ``);
  }
}
