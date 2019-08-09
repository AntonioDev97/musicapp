import { Injectable } from '@angular/core';
import { HttpResponse, HttpClient, HttpHeaders } from '@angular/common/http'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs';
import { GLOBAL } from './global';



@Injectable()

export class UserService{
    private url: string;
    private readonly controlller:string = "login-request"
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
        return this.http.post(this.url+this.controlller, dataSend, {headers: headerss});
    }
}