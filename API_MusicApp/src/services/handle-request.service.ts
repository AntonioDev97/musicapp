import {Response} from 'express';

class HandleResponse {
    
    public makeResponse(response:Response ,status:any, msg:any, data:any=null):Response{
        let sending:any = null;

        switch(status){
            case 200:
                sending = {
                    status: 200,
                    error: false,
                    type: 'success',
                    message: msg,
                    data: data
                }
            break;

            case 400: 
                sending = {
                    status: 400,
                    error: true,
                    type: 'Bad request',
                    message: msg
                }
            break;
            case 404:
                sending = {
                    status: 404,
                    error: true,
                    type: 'Not Found',
                    message: msg
                }
            break;
            case 409:
                sending = {
                    status: 409,
                    error: true,
                    type: 'Conflict',
                    message: msg
                }
            break;
           
            default: sending = {
                    status: 500,
                    error: true,
                    type: 'Server Error',
                    message: msg
                }
            break;
        }

        return response.status(status).send(sending);
    }

}

export const hdlResponse = new HandleResponse();