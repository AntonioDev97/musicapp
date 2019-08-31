import express, { Router } from 'express';
import { UserController } from '../controllers/user.controller'
import { EnsureAuth } from "../middleware/authenticated.middleware";

class UserRoute {

    public api:Router = express.Router();

    constructor(){
        this.setRoutesUser();
    }

    private setRoutesUser():void{
        let UsCtrl = new UserController();
        
        this.api.get('/test', UsCtrl.test );
        this.api.get('/testSentry', UsCtrl.testLoggers);
        this.api.post('/register', UsCtrl.registerUser);
        this.api.put('/update/:id', EnsureAuth, UsCtrl.updateUser);
        this.api.post('/login', UsCtrl.loginUser);
    };

}

export const User_Route = new UserRoute().api; 