import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';

import { AppServer } from './app';

const initConfig = dotenv.config({path: path.resolve(__dirname, "../.env")});
const SERVER_PORT = process.env.PORT || 4000;

const optionsCX = {
    user: process.env.USERDB,
    pass: process.env.PASSDB,
    useNewUrlParser: true,
    connectTimeoutMS: 5000,
    useFindAndModify:false
}

mongoose.connect(`${process.env.URLDB}`, optionsCX).then(
    res => {
        if(res){
            console.log("Conexion Succesfull");

            new AppServer().server.listen(SERVER_PORT, ()=>{
                console.log(`Server Running On Port ${SERVER_PORT}`);
            });
        }
        else throw res;
    }, 
    err => {
        if(err)
            throw err;
    }
);




