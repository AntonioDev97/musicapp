import { Injectable } from '@angular/core';
import { HttpResponse, HttpClient, HttpHeaders } from '@angular/common/http'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs';
import { GLOBAL } from './global';

import { User } from '../models/user.model';



@Injectable()

export class UserService{
    private url: string;
    private headers:HttpHeaders;

    constructor(private http:HttpClient){
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

    public getIdentity(){
        let identity = JSON.parse(localStorage.getItem('identity'));
        return identity ? identity : null;
    }

    public getToken(){
        let token = localStorage.getItem('token');
        return token ? token : null;
    }
}