import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const API = environment.API;

@Injectable({
    providedIn: 'root'
})
export class NotificacionesService {
    urlService: string;

    constructor( private http:HttpClient ) { }

    setNotificacion(idReconocimiento: Number, idEmpleadoAEnviar: Number, tipo: Number,  args: any[]): Observable<any>{
        // console.log("Notificaciones.service - setNotificacion()");
        var titulo, descripcion;
        if(tipo == 0){ //Rechazado
            titulo = "Denegado";
            descripcion = "Te han rechazado el reconocimiento enviado a "+args[0]+". Razón: "+args[1];
        }else{
            titulo = "Te reconocieron";
            descripcion = args[0] + " te ha reconocido";
        }
        let envio = {
            "id_reconocimiento": Number(idReconocimiento),
            "id_empleado": idEmpleadoAEnviar,
            "titulo": titulo,
            "descripcion": descripcion
        };
        return this.http.post<any>(`${API}/Notificaciones/AgregarNotificacion`, envio);
    }
    EnviarCorreoNotificacion(idReconocimiento: Number, idEmpleadoEnvia: Number, idEmpleadoRecibe: Number,  tipo: Number,  args: any[]): Observable<any>{
        // console.log("Notificaciones.service - EnviarCorreoNotificacion()");
        var titulo, descripcion;
        let envio = {};
        if(tipo == 0){ //Rechazado
            titulo = "Denegado";
            descripcion = "Te han rechazado el reconocimiento enviado a "+args[0]+". Razón: "+args[1];

            envio = {
                "id_reconocimiento": Number(idReconocimiento),
                "id_empleado": idEmpleadoEnvia,
                "titulo": titulo,
                "descripcion": descripcion
            };
        }else{
            titulo = "Te reconocieron";
            descripcion = args[0];

            envio = {
                "id_reconocimiento": Number(idReconocimiento),
                "id_empleado": idEmpleadoRecibe,
                "titulo": titulo,
                "descripcion": descripcion
            };
        }

        return this.http.post<any>(`${API}/Notificaciones/EnviarNotificacion`, envio);
    }

    getNotificaciones(idEmpleado: Number):Observable<any>{
        // console.log("Metodo getNotificaciones()");
        return this.http.get<any>(`${API}/Notificaciones/ConsultarNotificacionesIdEmpleado?id_empleado=` + idEmpleado + ``);
    }
    marcarComoLeido(idEmpleado: Number): Observable<any>{
        return this.http.get<any>(`${API}/Notificaciones/MarcarComoLeidoIdEmpleado?id_empleado=` + idEmpleado + ``);
    }
}
