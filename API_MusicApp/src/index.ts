import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';

import { AppServer } from './app';

dotenv.config({path: path.resolve(__dirname, "../.env")});

class InitApplication {
    private readonly SERVER_PORT = process.env.PORT || 4000;
    private readonly DB_CONFIG =  {
        user: process.env.USERDB,
        pass: process.env.PASSDB,
        useNewUrlParser: true,
        connectTimeoutMS: 5000,
        useFindAndModify:false
    }

    constructor(){
        this.initServer();        
    }

    private initServer(){
        new AppServer().server.listen(this.SERVER_PORT, ()=>{
            console.log(`Server Running On Port ${this.SERVER_PORT}`);
            this.initDB(); 
        });
    }

    private initDB(){
        
        mongoose.connect(`${process.env.URLDB}`, this.DB_CONFIG).then(
            res => {
                if(res){
                    console.log("Conexion to DataBase Complete!");
                }
            }
        ).catch(error=>{
            console.error(error);
        });
    }
}

new InitApplication();




