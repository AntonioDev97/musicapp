import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
    name:string,
    surname:string,
    email:string,
    password:string,
    role:string,
    image:string
}

const UserSchema: Schema = new Schema({
    name: {type: String, required: true},
    surname:  {type: String, required: true},
    email:  {type: String, required: true},
    password:  {type: String, required: true},
    role:  {type: String, required: true},
    image:  {type: String}
});

export default mongoose.model<IUser>('User', UserSchema);