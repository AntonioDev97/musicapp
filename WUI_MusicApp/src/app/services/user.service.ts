import { Injectable } from '@angular/core';
import { HttpResponse, HttpClient, HttpHeaders } from '@angular/common/http'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { Router } from '@angular/router';

import { User } from '../models/user.model';




@Injectable({providedIn: 'root'})

export class UserService{
    private url: string;
    private headers:HttpHeaders;

    constructor(private http:HttpClient, private router:Router){
        this.url = GLOBAL.url;
        this.headers = new HttpHeaders();
        this.headers.set("Content-Type","application/json");

    }

    public singUp(userLogin:any, getHash:any=null):any{
        getHash ? userLogin.getHash = getHash : null;

        let headerss = this.headers;
        let dataSend = userLogin;
        return this.http.post(`${this.url}login-request`, dataSend, {headers: headerss});
    }

    public register(userRegister: User):Observable<any>{
       let headerss = this.headers;
       let dataSend = userRegister;

       return this.http.post(`${this.url}registerUser`, dataSend, {headers: headerss});
    }

    /* public updateUser(userUpdate:User):Observable<any>{
        if(typeof userUpdate )

    } */

    public logout(){
        localStorage.removeItem('identity');
        localStorage.removeItem('token');
        localStorage.clear();

        if(!localStorage.getItem('identity') && !localStorage.getItem('token'))
            this.router.navigate(['login']);

        else return alert('Error al cerrar la sesion');
    }  

  
}