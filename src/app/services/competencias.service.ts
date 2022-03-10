import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const API = environment.API;

@Injectable({
  providedIn: 'root'
})

export class CompetenciasService {
  urlService:string;

  constructor( private http:HttpClient ){ 
    // console.log("Competencias Service");
  }

  getCompetencias(pActivo:Boolean,pNivel:String):Observable<any>{
    // console.log("Metodo getCompetencias()");
    this.urlService = `${API}/Competencia/ObtenerCompetencias?activo=` + pActivo + `&nivel=` + pNivel + ``;
    return this.http.get<any>(this.urlService);
  }
  getAllCompetencias():Observable<any>{
    // console.log("Metodo getCompetencias()");
    this.urlService = `${API}/Competencia/ObtenerTodasCompetencias`;
    return this.http.get<any>(this.urlService);
  }
  actualizarCompetencia(envio: any): Observable<any>{
    return this.http.post<any>(`${API}/Competencia/ModificarCompetencia`, envio);
  }
  addCompetencia(envio: any): Observable<any>{
    return this.http.post<any>(`${API}/Competencia/AgregarCompetencia`, envio);
  }
}
