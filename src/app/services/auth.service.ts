import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CookieService } from 'ngx-cookie-service';
import { TokenService } from "./token.service";

import jwt_decode from 'jwt-decode';
import { environment } from '../../environments/environment';

const ENV_cookieUser = environment.cookieUser;

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    constructor( 
        private http:HttpClient, 
        private cookieService: CookieService,
        private tokenService: TokenService 
    ){ 
        //console.log("Auth Service");
    }

    setCookie(token){
        var jwt_user: any = jwt_decode(token);
        if (jwt_user.Id !== 0 && jwt_user.Id !== null) {
            //Pruebas
            // localStorage.setItem('user', JSON.stringify(jwt_user));
            //
            let exp = new Date(Number(jwt_user.exp + '000')); // Los ceros son para los milisegundos
            console.log(exp);
            this.cookieService.set( ENV_cookieUser, token, {
                    expires: exp,
                    path: '/',
                    sameSite: 'Lax'
                });
            /** Nota:
             *  La cookie se guarda en UTC para la expiración
             */
            return true;
        }
        return false;
    }
    getCookieUser(){
        const token = this.tokenService.getToken();
        if(token){
            // console.log(this.tokenService.isTokenValid())
            var user: any = jwt_decode( token );
            return user;
        }
        return null;
    }
    deleteCookie(){
        if(this.cookieService.check( ENV_cookieUser )){
            this.cookieService.delete( ENV_cookieUser );
        }
    }
}
