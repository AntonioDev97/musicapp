import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    
    constructor(private route:Router){}

    public isAuthenticated():boolean{
        const token = this.getToken();
        const identity = this.getIdentity();

        if(identity && identity._id && token && token.length > 0)
            return true;

        return false;
    }

    public setIdentity(identity:any):boolean{
        
        const identityStore = this.getIdentity();

        if(identityStore && identityStore._id) alert("Ya existe una sesion");
        else{
            identity._id ? localStorage.setItem('identity',JSON.stringify(identity))
                         : alert("Identidad Incorrecta");
            if(this.getIdentity() && this.getIdentity()._id)
                return true;
        }

        return false;

    }

    public setToken(token:string):boolean{

        const tokenStore = this.getToken();

        if(tokenStore && tokenStore.length > 0) alert("Sesion inciada cierre e intente de nuevo TK");
        else{
            token.length > 0 ? localStorage.setItem('token', token)
                             : alert("Sesion invalida");
            if(this.getToken() && this.getToken().length > 0) 
                return true; 
        }

        return false;
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