import { Request, Response, response } from 'express';
import { hdlResponse } from '../services/handle-request.service';
import bcrypt from 'bcrypt-nodejs';
import { GenerateToken } from "../services/jwt.service";
import User from '../models/user.model';

export class UserController {

    constructor(){}

    public test(request: Request, response:Response ){
        return hdlResponse.makeResponse(response, 200, 'Api End-Point Ok', {data:[{test:'ok'}]});
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
                    user.save((err:any, userStored:any) => {
                        if(err) return hdlResponse.makeResponse(res, 409, `Error al guardar usuario`, err);
                        else
                            return userStored ? hdlResponse.makeResponse(res, 200, "¡Exito!", {newUser: userStored})
                                              : hdlResponse.makeResponse(res, 404, "No se ha registrado el usuario");
                    });
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
            User.findOne({email: user.email}, (err:any, userData:any)=>{
                return err ? hdlResponse.makeResponse(res, 500, "Error al buscar usuario", err) 
                           : !userData ? hdlResponse.makeResponse(res, 404, "Usuario no encontrado")
                                       : bcrypt.compare(user.password, userData.password, (err:any, check:any)=>{
                                           if(err) hdlResponse.makeResponse(res, 500, "Conflicto de contraseñas", err);
                                           else{
                                               userData.password = undefined;
                                               check ? params.getHash ? hdlResponse.makeResponse(res, 200, "¡Exito!", {token: GenerateToken(userData)})
                                                                      : hdlResponse.makeResponse(res, 200, "¡Exito!", {user: userData})
                                                     : hdlResponse.makeResponse(res, 404, "Contraseña Incorrecta");
                                           }
                                       });
            })

        else return hdlResponse.makeResponse(res, 400, "Campos Incorrectos");
    }

    public updateUser(req:Request, res:Response):any{
        
        const userId = req.params.id;
        const update = req.body;

        User.findByIdAndUpdate(userId, update, (err, userUpdate)=>{
            return err ? hdlResponse.makeResponse(res, 500, "Error al actualizar Usuario", err)
                       : !userUpdate ? hdlResponse.makeResponse(res, 404, "Usuario no encontrado")
                                      : hdlResponse.makeResponse(res, 200, "!Exito¡", {userUpdated: userUpdate});
        });
    }
}