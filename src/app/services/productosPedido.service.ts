import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const API = environment.API;

@Injectable({
    providedIn: 'root'
})
export class ProductosPedidoService {
    urlService: string;

    constructor(private http: HttpClient) { }

    getProductosPedido(): Observable<any> {
        return this.http.get<any>(`${API}/ProductosPedido/ObtenerProductosPedido`);
    }
    getProductosPedidoById(pId: number): Observable<any> {
        this.urlService = `${API}/ProductosPedido/ObtenerProductosPedidoId?id=` + pId + ``;
        return this.http.get<any>(this.urlService);
    }
    addProductosPedido(value: any): Observable<any> {
        // this.urlService = `${API}/ProductosPedido/AgregarProductosPedido`, value;
        return this.http.post<any>(`${API}/ProductosPedido/AgregarProductosPedido`, value);
    }
    updateProductosPedido(value: any): Observable<any> {
        // this.urlService = ;
        return this.http.post<any>(`${API}/ProductosPedido/ModificarProductosPedido`, value);
    }
    deleteProductosPedido(id: number): Observable<any> {
        // this.urlService = ;
        return this.http.get<any>(`${API}/ProductosPedido/EliminarProductosPedido?id=` + id);
    }

}