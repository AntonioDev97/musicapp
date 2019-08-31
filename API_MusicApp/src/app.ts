import express, { Request, Response } from 'express';
//import Raven from 'raven';
import * as Sentry from "@sentry/node";
import { User_Route } from './routes/user.route';

export class AppServer{

    //SERVER CONFIG
    public server = express();

    constructor(){
        this.server.use(express.json());
        this.server.use(express.urlencoded({extended: false}));
        
        this.setLoggers();
        this.setHeaders();
        this.setEndPoints();
        this.setAutomaticSentryErrorHandler();
        
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
        this.server.use('/user', User_Route);
        this.server.get('/', (req:Request, res:Response) => res.status(200).send('¡API WORK! \n Welcome to API_MusicApp'));
        //this.server.use('*', (req: Request, res: Response) => res.status(200).send("¡API CAN'T GET URL PLEASE TRY LATER OR VERIFY ENDPOINT!"));
    }

    private setLoggers():void{
        //Raven.config(`${process.env.SENTRYURL}`).install();
        Sentry.init({ dsn: `${process.env.SENTRYURL}` });
        this.server.use(Sentry.Handlers.requestHandler() as express.RequestHandler);
    }

    private setAutomaticSentryErrorHandler():void{
        this.server.use(Sentry.Handlers.errorHandler() as express.ErrorRequestHandler);
    }

}
