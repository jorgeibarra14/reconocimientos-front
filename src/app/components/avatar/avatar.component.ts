import { Component, Input, OnInit } from '@angular/core';
import { throwMatDialogContentAlreadyAttachedError } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-avatar-icon',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {
  @Input() size: string;
  @Input() type: string;
  @Input() bg_color: string;
  @Input() text_color: string;
  @Input() name: string = '';
  @Input() image: string = '';

  showImage = false;

  capitalizeString: string = '?';
  showAvatar: boolean = false;
  user;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {

      this.user = this.authService.getCookieUser();

    if(this.size == 'l') {
      if(this.user.Nombre != ''){
        this.capitalizeString = this.user.Nombre.substring(0,1).toUpperCase();
        this.showAvatar = true;
      }

      if(this.user.Avatar != null && this.user.Avatar != ''){
        this.showImage = true;
      }
    } else {

      this.capitalizeString = this.name.substring(0,1).toUpperCase();
      this.showAvatar = true;


      if(this.image != null && this.image != '') {
        this.showImage = true;
      } else {
        this.showImage = false;
      }
    }

    }

}
