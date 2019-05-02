'use strict'

const bcrypt = require('bcrypt-nodejs');
const UserModel = require('../models/user');

const pruebas = (req, res) => {
    res.status(200).send({
        message: 'Probando una accion del controlador de usuarios'
    });
}

const registerUser = (req, res) =>{
    let user = new UserModel();
    let params = req.body;

    console.log(params);

    //Params Validation
    let validation = true;
    (params.name!=null)?user.name = params.name:validation=false;
    (params.surname!=null && params.surname.trim().length > 5)?user.surname = params.surname:validation=false;
    (params.email!=null)?user.email = params.email:validation=false;
    (params.role!=null)?user.role = "ROLE_USER":validation=false;
    (params.image!=null)?user.image = "null":validation=false;
    (params.password.length < 6)?validation=false:params.password;

    if(validation){
        bcrypt.hash(params.password,null,null,(err, hash)=>{
            res.status(200).send({
                message: hash
            });
        });
    }else{
        res.status(200).send({
            message: `Parametros incorrectos`
        });
    }
} 

module.exports ={
    pruebas,
    registerUser
};
