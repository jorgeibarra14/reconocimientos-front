import { Component, Input, OnInit } from '@angular/core';
import { throwMatDialogContentAlreadyAttachedError } from '@angular/material/dialog';

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

  capitalizeString: string = '?';
  showAvatar: boolean = false;

  constructor() { }

  ngOnInit(): void {
    setTimeout( () =>{
      // console.log("Name: " + this.name);
      if(this.name != ''){
        this.capitalizeString = this.name.toString().substring(0,1).toUpperCase();
        this.showAvatar = true;
      }
    }, 500);
  }

}
