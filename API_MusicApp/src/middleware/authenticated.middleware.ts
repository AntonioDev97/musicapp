import {Request, Response} from 'express';
import jwt from 'jwt-simple';
import moment from 'moment';
import { hdlResponse } from "../services/handle-request.service";

export const EnsureAuth = (request:any, response:Response, next:any):any =>{
    
    let token = request.headers.authorization;

    if(!token || token.length < 1)
        return hdlResponse.makeResponse(response, 401, "Esta operacion requiere autenticacion");

    token = token.replace(/['"]+/g,'');

    try{

        var payload = jwt.decode(token, `${process.env.SECRET}`);
        if(payload.exp <= moment().unix)
            return hdlResponse.makeResponse(response, 401, "Token Expirado");
        
    } catch(err){
        return hdlResponse.makeResponse(response, 401, "Token Invalido", err);
    }

    request.user = payload;
    next();

}