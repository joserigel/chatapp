import { Schema, model } from "mongoose";

// Schemas
const userSchema = new Schema({ username: String, password: String}, { versionKey: false });
export const User = model('User', userSchema, 'users');

const messageSchema = new Schema({ 
    sender: String, 
    recipient: String, 
    text: String, 
    unix: Number
}, { versionKey: false });
export const Message = model('Message', messageSchema, 'messages');

export const enforceSchema = () => {

}