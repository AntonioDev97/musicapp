import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from './models/user.model';

import {FormBuilder, Validators, FormGroup} from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [UserService]
})
export class AppComponent {
  public title = 'Musicapp';
  public user: User;
  public identity;
  public token;
  public errMsg;

  public loginForm: FormGroup;

  constructor(private fb: FormBuilder, private _userService:UserService){
    this.user = new User('','','','','','','');
    
    this.loginForm =this.fb.group(this.user);
    this.loginForm.controls['email'].setValidators([Validators.required]);
    this.loginForm.controls['password'].setValidators([Validators.required]);

  }

  public authenticationUser():any{
    if(this.loginForm.valid)

      this._userService.singUp(this.loginForm.value).subscribe(resp => {
        
        resp.userData ? this.identity = resp.userData : null;
        if(!this.identity._id)
          alert("El usuario no esta logeado");
        else {
          this._userService.singUp(this.loginForm.value,true).subscribe(
            resp => {
              this.token = resp.token
              if(this.token.length <= 0) alert("El token no se ha generado correctamente");
              else {
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
  
}
