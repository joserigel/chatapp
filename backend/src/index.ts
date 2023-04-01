// Imports
import Express, { NextFunction } from 'express';
import { TokenExpiredError } from 'jsonwebtoken';
import mongoose, { Schema, model } from 'mongoose';
import { authorize, login } from './authorization';
const jwt = require('jsonwebtoken');
const moment = require('moment');
require('dotenv').config();

import { User } from './schemas';

// Express
const app = Express();
app.use(Express.json());
app.get('/send/:user', async (req: Express.Request, res: Express.Response) => {
    try {
         

        
        const user: string = req.params['user'];

        let recipient = await User.findOne({username: user});

        if (!recipient) {
            res.status(400).end('<h1>User not found</h1>');
        } else {
            
        }
        
    } catch (e) {
        if (e instanceof TokenExpiredError) {
            res.status(500).end('<h1>Bad Auth</h1>');
        } else {
            res.status(500).end('<h1>Internal Server Error</h1>')
        }
    }
});

app.post('/login', login);


// Testing
app.get('/verify', authorize, (req: Express.Request, res: Express.Response) => {
    res.end('SUCCESS');
})
app.use('/', (req: Express.Request, res: Express.Response) => {
    res.status(404);
    res.end('<h1>404 Not Found</h1>');
});

app.listen(3000, async () => {
    console.log(`listening ${3000}`);
    console.log(process.env.PORT);
    
    await mongoose.connect(
        `mongodb://${process.env.MONGO_HOST}:27017`, 
        {
            user: process.env.MONGO_USER,
            pass: process.env.MONGO_PASS,
            dbName: 'chat'
        }
    );

    // Just for testing MongoConnection
    console.log(await User.findOne({}));
});