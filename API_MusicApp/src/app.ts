import express, { Request, Response } from 'express';
import { User_Route } from './routes/user.route';

export class AppServer{

    //SERVER CONFIG
    public server = express();

    constructor(){
        this.server.use(express.json());
        this.server.use(express.urlencoded({extended: false}));
        
        this.setHeaders();
        this.setEndPoints();
    }

    private setHeaders():void{
        this.server.use((request:Request, response:Response, next)=>{
            response.header('Access-Control-Allow-Origin', '*');
            response.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
            response.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
            response.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
            next();
        });
    } 

    private setEndPoints():void{
        this.server.use('/api', [ 
            User_Route, 
        ]);
    }

}
