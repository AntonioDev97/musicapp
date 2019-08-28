import express, { Router } from 'express';
import { UserController } from '../controllers/user.controller'

class UserRoute {

    public api:Router = express.Router();

    constructor(){
        this.setRoutesUser();
    }

    private setRoutesUser():void{
        let UsCtrl = new UserController();
        
        this.api.get('/test', UsCtrl.test );
        this.api.post('/registerUser', UsCtrl.registerUser );
    };

}

export const User_Route = new UserRoute().api; 