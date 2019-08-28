import {Response} from 'express';

class HandleResponse {
    
    public makeResponse(response:Response, status:any, msg:any=null, data:any=null):Response{
        let sending:any = null;

        switch(status){
            case 200:
                sending = {
                    status: 200,
                    type: 'success',
                    error: false,
                    message: msg,
                    data: data
                }
            break;

            case 400: 
                sending = {
                    status: 400,
                    type: 'Bad request',
                    error: true,
                    errorDesc: data,
                    message: msg
                }
            break;
            case 401: 
                sending = {
                    status: 401,
                    type: 'Unauthorized',
                    error: true,
                    errorDesc: data,
                    message: msg
                }
            break;
            case 404:
                sending = {
                    status: 404,
                    type: 'Not Found',
                    error: true,
                    errorDesc: data,
                    message: msg
                }
            break;
            case 409:
                sending = {
                    status: 409,
                    type: 'Conflict',
                    error: true,
                    errorDesc: data,
                    message: msg
                }
            break;

            case 500:
                sending = {
                    status: 500,
                    type: 'Server Error',
                    error: true,
                    errorDesc: data,
                    message: msg
                }
            break;
           
            default: 
                sending = {
                    status: 500,
                    error: true,
                    errorDesc: data || 'Unknow Error',
                    type: 'Server Error',
                    message: msg
                }
            break;
        }

        return response.status(status).send(sending);
    }

}

export const hdlResponse = new HandleResponse();