import { Schema, model } from "mongoose";

// Schemas
const schema = new Schema({ username: String, password: String});
export const User = model('User', schema, 'users');