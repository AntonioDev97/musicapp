import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate{

    constructor(private router: Router, private auth:AuthService){}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){

        if(state.url === '/login')
            if(this.auth.isAuthenticated()){
                this.router.navigate(['/profile']);
                return false;
            } else return true;

        if(this.auth.isAuthenticated())
            return true;

        this.router.navigate(['login']);
        return false;
    }
}