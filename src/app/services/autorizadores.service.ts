import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const API = environment.API;

@Injectable({
  providedIn: 'root'
})

export class AutorizadoresService {
  urlService:string;

  constructor( private http:HttpClient ){ 
  }

  getAllAutorizadores():Observable<any>{
    // console.log("Metodo getAllAutorizadores()");
    this.urlService = `${API}/Autorizadores/ConsultarAutorizadores`;
    return this.http.get<any>(this.urlService);
  }

  editAutorizadores(value: any): Observable<any> {
    // console.log("Metodo editAutorizadores()");
    return this.http.post<any>(`${API}/Autorizadores/EditarAutorizador`, value);
  }

  getAutorizadoresDistinct():Observable<any>{
    // console.log("Metodo getAutorizadoresDistinct()");
    this.urlService = `${API}/Autorizadores/ConsultarAutorizadoresDistintos`;
    return this.http.get<any>(this.urlService);
  }

  addAutorizadores(value: any): Observable<any> {
    // console.log("Metodo addAutorizadores()");
    return this.http.post<any>(`${API}/Autorizadores/AgregarAutorizador`, value);
  }
 
}
