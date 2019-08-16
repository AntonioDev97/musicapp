import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from './models/user.model';

import {FormBuilder, Validators, FormGroup} from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [UserService]
})
export class AppComponent implements OnInit{
  public title = 'Musicapp';

  public identity;
  public token;
  public errMsg;
  public alertRegister;

  public loginForm: FormGroup;
  public registerForm: FormGroup;
  public user: User;
  public userRegister: User;

  constructor(private fb: FormBuilder, private _userService:UserService){
    this.user = new User('','','','','','','');
    
    this.loginForm =this.fb.group(this.user);
    this.loginForm.controls['email'].setValidators([Validators.required]);
    this.loginForm.controls['password'].setValidators([Validators.required]);

    this.buildRegisterForm();

  }

  public authenticationUser():any{
    if(this.loginForm.valid)

      this._userService.singUp(this.loginForm.value).subscribe(resp => {
        
        resp.userData ? this.identity = resp.userData : null;
        if(!this.identity._id)
          alert("El usuario no esta logeado");
        else {
          //Set identity sesion into local Storange
          localStorage.setItem('identity',JSON.stringify(this.identity))

          this._userService.singUp(this.loginForm.value,true).subscribe(
            resp => {
              this.token = resp.token
              if(this.token.length <= 0) alert("El token no se ha generado correctamente");
              else {
                //Set token for sesion in local storange
                localStorage.setItem('token', this.token);
                this.user = new User('','','','','','','');
                this.userRegister = new User('','','','','','','');
                console.log(this.identity);
                console.log(this.token);
              }
            },
            err => err.error ? this.errMsg=err.error.message : console.log(err)
          );
        }
      }, err => {  
        if(err.error)
          this.errMsg=err.error.message;
        else console.log(err);
      }); 
  }

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();

    console.log(`identity: ${this.identity}`);
    console.log(`token: ${this.token}`);
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
          if(!this.userRegister._id) 
            this.alertRegister="Error al registrarse";
          else{
            this.alertRegister="El Registro se ha realizado correctamente, identificate con "+this.userRegister.email;
            this.userRegister = new User('','','','','','ROLE_USER','');
          }

        }, 
        err => err.error ? this.alertRegister=err.error.message : console.log(err)
      );
    else console.log("Revisa los campos");
  }

  public logout(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();
    this.identity = null;
    this.token = null;  
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
}
