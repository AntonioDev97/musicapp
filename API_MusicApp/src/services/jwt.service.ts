import jwt from 'jwt-simple';
import moment from 'moment';

export const GenerateToken = (user:any)=>{

    const Secret:string = `${process.env.SECRET}`;
    const payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(7, 'days').unix
    };

    return jwt.encode(payload, Secret);
}