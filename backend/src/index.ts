// Imports
import Express, { Request, Response, NextFunction } from 'express';
import { TokenExpiredError } from 'jsonwebtoken';
import mongoose, { Schema, model } from 'mongoose';
import { authorize, login } from './authorization'; 
const jwt = require('jsonwebtoken');
const moment = require('moment');
require('dotenv').config();

import { User, Message } from './schemas';

// Express
const app = Express();
app.use(Express.json());

// Send new Message
app.post('/send/:recipient', authorize, async (req: Request, res: Response) => {
    const recipient = await User.findOne({username: req.params['recipient']});

    if (!recipient) {
        res.status(400).end('<h1>User not found</h1>');
    } else {
        const { text } = req.body;
        if (!text || text === "") {
            res.status(400).end('<h1>Text cannot be empty</h1>');
        } else {
            const message = new Message({ 
                sender: res.locals.username, 
                recipient: recipient.username,
                text: text,
                unix: moment().unix()
            });
            message.save();
            res.status(200).json({
                token: res.locals.token
            });
        }
    }
});

// Retrieve Messages
app.post('/messages/:recipient', authorize, async (req: Request, res: Response, next: NextFunction) => {
    const recipient = req.params['recipient'];
    const messages = await Message.aggregate([
        { $project: { _id: 0} },
        { $match : { $or: [
            { sender: res.locals.username, recipient: recipient},
            { sender: recipient, recipient: res.locals.username}
        ]}},
        { $sort: { unix: -1} },
        { $skip: 0 },
        { $limit: 10}
    ]);

    res.status(200).json(messages);
});

// Login
app.post('/login', login);

// Testing
app.get('/verify', authorize, (req: Request, res: Response) => {
    res.end('SUCCESS');
})
app.use('/', (req: Request, res: Response) => {
    res.status(404);
    res.end('<h1>404 Not Found</h1>');
});

app.listen(process.env.PORT, async () => {
    console.log(`Listening @localhost:${process.env.PORT}`);
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