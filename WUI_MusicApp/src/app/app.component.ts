import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  public title = 'Musicapp';


  constructor(){

  }

  

  ngOnInit(){
    /* this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken(); */

    /* console.log(`identity: ${this.identity}`);
    console.log(`token: ${this.token}`); */
  }




}
