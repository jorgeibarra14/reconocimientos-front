import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const APIItGov = environment.APIItGov;

@Injectable({
  providedIn: 'root'
})

export class ConfigService {

constructor(private http: HttpClient) { }

getConfig(appId: number) {
  return this.http.get(`${APIItGov}/ApplicationsConfigurations/${appId}`);
}

}
