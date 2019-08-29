import { Injectable } from '@angular/core';
import { 
    HttpRequest, 
    HttpHandler, 
    HttpEvent,
    HttpInterceptor, 
    HttpResponse,
    HttpErrorResponse
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable()

export class HttpInterceptorService implements HttpInterceptor{
    constructor(private auth:AuthService, private _userService:UserService){}

    intercept(request:HttpRequest<any>, next:HttpHandler):Observable<HttpEvent<any>>{
        if(this.auth.isAuthenticated())
            request = request.clone({
                setHeaders: {
                    Authorization: this.auth.getToken()
                }
            });

        return next.handle(request).pipe(tap((event:HttpEvent<any>) => {
            if(event instanceof HttpResponse){

            }
        }, error => {
            if(error instanceof HttpErrorResponse)
                if(error.status === 401) 
                    this._userService.logout();
                else console.log(error);
        })
        )
    }
}