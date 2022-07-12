import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from "../services/auth.service";
import { environment } from '../../environments/environment';
@Component({
  selector: 'ho1a-Login',
  template: '',
  styleUrls: ['./Login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private rutaActiva: ActivatedRoute,
  ) { }

  ngOnInit() {
    var access_token = this.rutaActiva.snapshot.queryParams['access_token'];
    //console.log(access_token);
    if(access_token){
      if(this.authService.setCookie(access_token)){
        this.router.navigate(['/info']);
      }
    }else{
      window.location.href = environment.Itgov;
    }
  }

}
