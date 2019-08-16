'use strict'

const bcrypt = require('bcrypt-nodejs');
const UserModel = require('../models/user');
const Jwt = require('../services/jwt');
const Fs = require('fs');
const Path = require('path');

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
                        (userStored)?res.status(200).send({message: `Exito!`, userStored}): res.status(404).send({message: "No se ha registrado el usuario"});
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
    let email;
    let passw;
    let validation=true;

    (params.email!=null)?email=params.email:validation=false;
    (params.password!=null)?passw=params.password:validation=false;

    if(validation){
        UserModel.findOne({email: email},(err,userData)=>{
            if(err) response.status(500).send({message:`¡Error!: ${err}`});
            else{
                if(!userData) response.status(404).send({message: "Usuario no encontrado"});
                else{
                    bcrypt.compare(passw, userData.password,(err, check)=>{
                        if(err) response.status(500).send({message: "Error al desencriptar contraseña"});
                        else{
                            userData.password = undefined;
                            if(check){
                                if(params.getHash){
                                    response.status(200).send({
                                        token: Jwt.createToken(userData)
                                    });
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
        response.status(422).send({message: `Los campos son invalidos revise e intente nuevamente`});
};

const updateUser = (req,res)=>{
    let userId = req.params.id;
    let update = req.body;

    UserModel.findByIdAndUpdate(userId,update,(err,userUpdate)=>{
        if(err) return res.status(500).send({message: "Error al actualizar el usuario"});
        else{
            return (!userUpdate) ? res.status(404).send({message:"No se ha actualizado el usuario"}) : res.status(200).send({user: userUpdate}); 
        }
    });
}

const uploadAvatar = (req,res)=>{
    let userId = req.params.id;
    let file_name = "Image not Found";
    if(req.files){
        let file_path = req.files.image.path;
        file_name = file_path.split("\\")[2];
        let file_ext = file_name.split('\.')[1];    
        if( file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
            UserModel.findByIdAndUpdate(userId, {image: file_name},(err,userUpdate)=>{
                if(err) return res.status(500).send({message: "Error al actualizar imagen del usuario"});
                else{
                    return (!userUpdate) ? res.status(404).send({message:"No se ha actualizado la imagen del usuario"}) : res.status(200).send({user: userUpdate}); 
                }
            });
        }
        else return res.status(200).send({message: "Imagen o extension incorrecta",file: file_name});
    }
    else return res.status(200).send({message: 'No se encontro imagen'});
}

const getImageFile = (req,res)=>{
    let imageFile = req.params.imageFile;
    let path_file = `./upl2oad/users/${imageFile}`;
    Fs.exists(path_file,exist=>{
        (exist)?res.sendFile(Path.resolve(path_file)) : res.status(200).send({message: "No Existe la imagen"}); 
    });
}

module.exports ={
    pruebas,
    registerUser,
    loginUser,
    updateUser,
    uploadAvatar,
    getImageFile
};
