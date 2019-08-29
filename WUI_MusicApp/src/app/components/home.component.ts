import { Component } from '@angular/core';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
    selector: 'home-app',
    templateUrl: './../views/home.view.html'
})

export class HomeComponent {

    public identity:User;

    constructor(private _auth:AuthService, public _userService:UserService){
        this.identity = this._auth.getIdentity();
        console.log(this.identity);
    }
}