import { Component } from '@angular/core';
import { isUndefined } from 'util';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';

import { UserService } from '../services/user.service';
import { User } from '../models/user.model';


@Component({
    selector: 'login-app',
    templateUrl: './../views/login.view.html',
    providers: [UserService]
})

export class LoginComponent {

    
    //Component Variables
    public errMsg;
    public alertRegister;

    //Forms Variables
    public loginForm: FormGroup;
    public registerForm: FormGroup;
    
    //Models
    public user: User;
    public userRegister: User;

    constructor(private fb: FormBuilder, 
                private _userService:UserService, 
                private _auth:AuthService,
                private router:Router){
        this.user = new User('','','','','','','');
    
        this.loginForm =this.fb.group(this.user);
        this.loginForm.controls['email'].setValidators([Validators.required]);
        this.loginForm.controls['password'].setValidators([Validators.required]);

        this.buildRegisterForm();
    }

    private buildRegisterForm(){
        this.userRegister = new User('','','','','','ROLE_USER','');
        this.registerForm = this.fb.group(this.userRegister);
        
        let exent = ['_id', 'role', 'image'];
        Object.keys(this.registerForm.controls).forEach(key => {
            if(!exent.includes(key))
                this.registerForm.controls[key].setValidators([
                    Validators.required, 
                    Validators.minLength(4)
                ]);
        });
    }

    public authenticationUser():any{
        if(this.loginForm.valid)
            this._userService.singUp(this.loginForm.value).subscribe(resp => {
                const identity = resp.userData ? resp.userData : null;
                if(!identity._id)
                    alert("El usuario no esta logeado");
                else {
                    //Set identity sesion into local Storange
                    if(this._auth.setIdentity(identity))
                        this._userService.singUp(this.loginForm.value,true).subscribe(
                            resp => {
                                const token = resp.token
                                if(token.length <= 0) alert("El token no se ha generado correctamente");
                                else {
                                    //Set token for sesion in local storange
                                    if(this._auth.setToken(token)){
                                        this.loginForm.reset();
                                        console.log(identity);
                                        console.log(token);
                                        this.router.navigate(['profile']);
                                    }
                                    else this.errMsg = "Ocurrio un problema al generar su token, intente de nuevo";
                                }
                            },
                            err => err.error ? this.errMsg=err.error.message : console.log(err)
                        );
                    else this.errMsg("Ocurrio un error al generar su sesion");
                }
            }, err => {  
                if(err.error)
                this.errMsg=err.error.message;
                else console.log(err);
            });
        else this.errMsg = "Complete los campos correctamente!" 
    }

    public registerUser():void{
        console.log(this.userRegister);
        console.log(this.registerForm.value);
    
        const registerFormValues = this.registerForm.value;
        if(this.registerForm.valid)
          this._userService.register(registerFormValues).subscribe(
            resp=> {
              let user = resp.userStored;
              this.userRegister = user;
              console.log(this.userRegister);
              if(isUndefined(this.userRegister) || !this.userRegister._id) 
                this.alertRegister="Error al registrarse " + resp.message;
              else{
                this.alertRegister="El Registro se ha realizado correctamente, identificate con "+this.userRegister.email;
                this.userRegister = new User('','','','','','ROLE_USER','');
              }
    
            }, 
            err => err.error ? this.alertRegister=err.error.message : console.log(err)
          );
        else console.log("Revisa los campos");
    }
}