import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const API = environment.API;

@Injectable({
    providedIn: 'root'
})
export class ProductoService {
    urlService: string;

    constructor(private http: HttpClient) { }

    getProductos(): Observable<any> {
        return this.http.get<any>(`${API}/Productos/ObtenerProductos`);
    }
    getProductoById(pId: number): Observable<any> {
        return this.http.get<any>(`${API}/Productos/ObtenerProductosPorId?id=` + pId + ``);
    }
    getProductosByCategoryId(pId: number): Observable<any> {
        return this.http.get<any>(`${API}/Productos/ObtenerProductosPorCategoriaId?categoriaId=` + pId + ``);
    }
    addProductos(value: any): Observable<any> {
        return this.http.post<any>(`${API}/Productos/AgregarProductos`, value);
    }
    updateProductos(value: any): Observable<any> {
        return this.http.post<any>(`${API}/Productos/ModificarProductos`, value);
    }
    deleteProductos(id: Number): Observable<any> {
        return this.http.get<any>(`${API}/Productos/EliminarProductos?id=` + id);
    }
}