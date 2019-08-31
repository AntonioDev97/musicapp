import { Request, Response } from 'express';
import * as Sentry  from '@sentry/node';
import {logger} from "../services/winston.service";
import { hdlResponse } from '../services/handle-request.service';
import bcrypt from 'bcrypt-nodejs';
import { GenerateToken } from "../services/jwt.service";
import User from '../models/user.model';


export class UserController {

    constructor(){}

    public test(request: Request, response:Response ){
        return hdlResponse.makeResponse(response, 200, 'Api End-Point Ok', {data:[{test:'ok'}]});
    }

    public testLoggers(request: Request, response:Response ){
        const erre ='Test Error';
        Sentry.captureException(erre);
        Sentry.captureMessage('Something went wrong');
        logger.error(erre);
        return erre ? hdlResponse.makeResponse(response, 500, 'No Error Send')
                    : hdlResponse.makeResponse(response, 200, 'Error enviado correctamente!')
        
    }

    public registerUser(req:Request, res: Response):any{

        const user = new User();
        const params = req.body;

        let validation = true;
        //VALIDATION
        (params.name!=null && params.name.length > 3)?user.name=params.name:validation=false;
        (params.surname!=null && params.surname.length > 3)?user.surname=params.surname:validation=false;
        (params.email!=null)?user.email = params.email:validation=false;
        (params.role!=null)?user.role = "ROLE_USER":validation=false;
        (params.image!=null)?user.image = "null":validation=false;
        (params.password!=null && params.password.trim().length > 4)?params.password:validation=false;

        if(validation)
            bcrypt.hash(params.password,'',()=>{},(err:any, hash:any)=>{
                if(err)
                    return hdlResponse.makeResponse(res, 500, `Error al encriptar contraseña`, err);
                else{
                    user.password = hash;
                    user.save().then((userStored) => {
                        return userStored ? hdlResponse.makeResponse(res, 200, "¡Exito!", {newUser: userStored})
                                            : hdlResponse.makeResponse(res, 404, "No se ha registrado el usuario");
                    }).catch((err)=>{
                        logger.error(err);
                        return hdlResponse.makeResponse(res, 409, `Error al guardar usuario`, err);
                    })
                }
            });
            
        else return hdlResponse.makeResponse(res, 400, "Campos Incorrectos");
    }

    public loginUser(req:Request, res:Response):any{

        const params = req.body;
        const user = new User();

        let validation = true;
        params.email != null ? user.email = params.email : validation = false;
        params.password != null ? user.password = params.password : validation = false;

        if(validation)
            User.findOne({email: user.email}).then((userData:any)=>{
                return !userData ? hdlResponse.makeResponse(res, 404, "Usuario no encontrado")
                                 : bcrypt.compare(user.password, userData.password, (err:any, check:any)=>{
                                    if(err) hdlResponse.makeResponse(res, 500, "Conflicto de contraseñas", err);
                                    else{
                                        userData.password = undefined;
                                        check ? params.getHash ? hdlResponse.makeResponse(res, 200, "¡Exito!", {token: GenerateToken(userData)})
                                                                : hdlResponse.makeResponse(res, 200, "¡Exito!", {user: userData})
                                                : hdlResponse.makeResponse(res, 404, "Contraseña Incorrecta");
                                    }
                                });
            }).catch((error)=>{
                return hdlResponse.makeResponse(res, 500, "Error al buscar usuario", error);
            });

        else return hdlResponse.makeResponse(res, 400, "Campos Incorrectos");
    }

    public async updateUser(req:Request, res:Response):Promise<any>{
        
        const userId = req.params.id;
        const update = req.body;

        try{
            const userUpdate = await User.findByIdAndUpdate(userId, update);
            !userUpdate ? hdlResponse.makeResponse(res, 404, "Usuario no encontrado")
                        : hdlResponse.makeResponse(res, 200, "!Exito¡", {userUpdated: userUpdate});
        } 
        catch(error){
            return hdlResponse.makeResponse(res, 500, "Error al actualizar Usuario", error)
        }
    }
}