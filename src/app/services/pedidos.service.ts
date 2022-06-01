import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const API = environment.API;

@Injectable({
    providedIn: 'root'
})
export class PedidosService {
    urlService: string;

    constructor(private http: HttpClient) { }

    getPedidos(): Observable<any> {
        return this.http.get<any>(`${API}/Pedidos/ObtenerPedidos`);
    }
    getPedidosById(pId: number): Observable<any> {
        this.urlService = `${API}/Pedidos/ObtenerPedidosId?id=` + pId + ``;
        return this.http.get<any>(this.urlService);
    }
    addPedidos(value: any): Observable<any> {
        // this.urlService = `${API}/Pedidos/AgregarPedidos`, value;
        return this.http.post<any>(`${API}/Pedidos/AgregarPedidos`, value);
    }
    updatePedidos(value: any): Observable<any> {
        // this.urlService = ;
        return this.http.post<any>(`${API}/Pedidos/ModificarPedidos`, value);
    }
    deletePedidos(id: number): Observable<any> {
        // this.urlService = ;
        return this.http.get<any>(`${API}/Pedidos/EliminarPedidos?id=` + id);
    }
    getPedidosByUserId(userId: string): Observable<any> {
        debugger
        this.urlService = `${API}/Pedidos/ObtenerPedidos/${userId}`;
        return this.http.get<any>(this.urlService);
    }

}