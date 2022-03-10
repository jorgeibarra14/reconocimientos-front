import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const API = environment.API;

@Injectable({
    providedIn: 'root'
})
export class EstatusPedidoService {
    urlService: string;

    constructor(private http: HttpClient) { }

    getPedidosEstatusPedido(): Observable<any> {
        return this.http.get<any>(`${API}/EstatusPedido/ObtenerEstatusPedido`);
    }
    getPedidosEstatusPedidoById(pId: number): Observable<any> {
        this.urlService = `${API}/EstatusPedido/ObtenerEstatusPedidoId?id=` + pId + ``;
        return this.http.get<any>(this.urlService);
    }
    addPedidosEstatusPedido(value: any): Observable<any> {
        // this.urlService = `${API}/PedidosEstatusPedido/AgregarEstatusPedido`, value;
        return this.http.post<any>(`${API}/EstatusPedido/AgregarEstatusPedido`, value);
    }
    updatePedidosEstatusPedido(value: any): Observable<any> {
        // this.urlService = ;
        return this.http.post<any>(`${API}/EstatusPedido/ModificarEstatusPedido`, value);
    }
    deletePedidosEstatusPedido(id: number): Observable<any> {
        // this.urlService = ;
        return this.http.get<any>(`${API}/EstatusPedido/EliminarEstatusPedido?id=` + id);
    }

}