'use strict'

const JWT = require('jwt-simple');
const MOMENT = require('moment');
const SECRET = process.env.SECRET;

const ensureAuth = (request, response, next)=>{
    if(!request.headers.authorization) return response.status(403).send({message: "Esta operacion requiere autenticacion"});
    let token = request.headers.authorization.replace(/['"]+/g,'');
    try{

        var payload = JWT.decode(token,SECRET);
        if(payload.exp <= MOMENT().unix())
            return response.status(401).send({message: "Token Expirado"});

    } catch(ex){
        //console.log(ex);
        return response.status(404).send({message: "Token Invalido"});
    }
    request.user = payload;
    next();
};


module.exports = {
    ensureAuth
}