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
        let fd = new FormData();
        fd.append('nombre', value.nombre);
        fd.append('descripcion', value.descripcion);
        fd.append('costo', value.costo);
        fd.append('stock', value.stock);
        fd.append('file', value.imagen, value.imagen.name);
        fd.append('categoria_id', value.categoria_id);
        fd.append('Activo', value.Activo);
        fd.append('notas', value.notas);
        return this.http.post<any>(`${API}/Productos/AgregarProductos`, fd);
    }
    updateProductos(value: any): Observable<any> {
      let fd = new FormData();
      fd.append('nombre', value.nombre);
      fd.append('descripcion', value.descripcion);
      fd.append('costo', value.costo);
      fd.append('stock', value.stock);
      fd.append('file', value.imagen, value.imagen.name);
      fd.append('categoria_id', value.categoria_id);
      fd.append('Activo', value.Activo);
      fd.append('notas', value.notas);
      return this.http.post<any>(`${API}/Productos/ModificarProductos`, fd);
    }
    deleteProductos(id: Number): Observable<any> {
        return this.http.get<any>(`${API}/Productos/EliminarProductos?id=` + id);
    }
}
