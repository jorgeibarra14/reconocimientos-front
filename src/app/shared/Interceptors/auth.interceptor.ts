import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { TokenService } from "../../services/token.service";
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private tokenService: TokenService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.tokenService.getToken();
        // console.log(token);
        // if (!token) {
            // return next.handle(req);
        // }
        const headers = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
        return next.handle(headers);
    }
}