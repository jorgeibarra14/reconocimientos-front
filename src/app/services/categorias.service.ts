import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const API = environment.API;

@Injectable({
    providedIn: 'root'
})
export class CategoriasService {
    urlService: string;

    constructor(private http: HttpClient) { }

    getCategorias(): Observable<any> {
        return this.http.get<any>(`${API}/Categorias/ObtenerCategorias`);
    }
    getCategoriasById(pId: number): Observable<any> {
        this.urlService = `${API}/Categorias/ObtenerCategoriasId?id=` + pId + ``;
        return this.http.get<any>(this.urlService);
    }
    addCategorias(value: any): Observable<any> {
        // this.urlService = `${API}/Categorias/AgregarCategoria`, value;
        return this.http.post<any>(`${API}/Categorias/AgregarCategoria`, value);
    }
    updateCategorias(value: any): Observable<any> {
        // this.urlService = ;
        return this.http.post<any>(`${API}/Categorias/ModificarCategorias`, value);
    }
    deleteCategorias(id: number): Observable<any> {
        // this.urlService = ;
        return this.http.get<any>(`${API}/Categorias/EliminarCategorias?id=` + id);
    }

}