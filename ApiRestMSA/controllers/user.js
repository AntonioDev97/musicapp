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

    (params.name!=null && params.name.length > 3)?user.name=params.name:validation=false;
    (params.surname!=null && params.surname.length > 3)?user.surname=params.surname:validation=false;
    (params.email!=null)?user.email = params.email:validation=false;
    (params.role!=null)?user.role = "ROLE_USER":validation=false;
    (params.image!=null)?user.image = "null":validation=false;
    (params.password!=null && params.password.trim().length > 4)?params.password:validation=false;
 

    if(validation){
        bcrypt.hash(params.password,null,null,(err, hash)=>{
            if(!err){
                user.password = hash;
                user.save((err, userStored)=>{
                    if(err) res.status(500).send({message: `Error al guardar usuario: ${err}`});
                    else{
                        (userStored)?res.status(200).send({message: `Exito! ${userStored}`}): res.status(404).send({message: "No se ha registrado el usuario"});
                    }
                });
            }
            else res.status(500).send({message: `Error al encriptar la contraseña: ${err}`});
        });
    }else{
        res.status(200).send({
            message: `Parametros incorrectos`
        });
    }
}

const loginUser = (request,response)=>{
    
    let params = request.body;
    let user;
    let passw;
    let validation=true;

    (params.user!=null)?user=params.user:validation=false;
    (params.passw!=null)?passw=params.passw:validation=false;

    if(validation){
        UserModel.findOne({surname: user},(err,userData)=>{
            if(err) response.status(500).send({message:`¡Error!: ${err}`});
            else{
                if(!userData) response.status(404).send({message: "Usuario no encontrado"});
                else{
                    bcrypt.compare(passw, userData.password,(err, check)=>{
                        if(err) response.status(500).send({message: "Error al desencriptar contraseña"});
                        else{
                            if(check){
                                if(params.getHash){
                                    //devolver un token de jwt
                                }
                                else response.status(200).send({userData});
                            }
                            else response.status(404).send({message: "Contraseña incorrecta!"});
                        }
                    });
                } 
            }
        });
    }
    else
        response.status(200).send({message: `Los campos son invalidos revise e intente nuevamente`});
};

module.exports ={
    pruebas,
    registerUser,
    loginUser
};
