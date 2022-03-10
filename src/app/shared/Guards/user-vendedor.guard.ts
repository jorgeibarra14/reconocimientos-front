import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ReconocimientosService } from "../../services/reconocimientos.service";
import { AuthService } from "../../services/auth.service";

@Injectable()
export class UserVendedorGuard implements CanActivate {
    constructor(private router: Router,
        private reconocimientoService: ReconocimientosService,
        private authService: AuthService
    ) { }

    canActivate(): boolean {
        const user = this.authService.getCookieUser();
        this.reconocimientoService.getEmpleadosPorId(user.Id.toString())
                .subscribe(
                    resp => {
                        console.log(resp[0]);
                        /**
                         * FALTA DEFINIR SI SERÁ POR PUESTO, ÁREA O SISTEMA,
                         * Y SI EL SERVICIO TENDRÁ UN CAMPO PARA VALIDACIÓN O SERÁ DESDE EL FRONT
                         */
                        // if( resp[0].puesto != 'CONSULTOR FUNCIONAL' ){
                        if(resp[0].area != 'COMERCIAL'){
                                this.router.navigate(['/Inicio']);
                                return false;
                        }
                    }, err => console.log("Error al obtener el usuario en UserVendedorGuard")
                )
        return true;
    }
}