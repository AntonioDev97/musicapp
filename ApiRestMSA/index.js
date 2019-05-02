'use strict'

const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const port = process.env.PORT || 3977;

mongoose.connect(process.env.URL_DB, { useNewUrlParser:true, connectTimeoutMS: 5000 }).then(
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