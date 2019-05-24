'use strict'

const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const port = process.env.PORT || 3977;

const optionsCx = {
    user: process.env.USERDB,
    pass: process.env.PASSDB,
    useNewUrlParser:true,
    connectTimeoutMS:5000,
    useFindAndModify:false
}

mongoose.connect(process.env.URL_DB, optionsCx).then(
    res => {
        if(res){
            console.log("Conexion Connect 200");
            app.listen(port,()=>{
                console.log(`server running PORT: ${process.env.PORT}`);
            });
        }
        else
            throw res;
    },
    err => {
        if(err)
          throw(err);
    }
);