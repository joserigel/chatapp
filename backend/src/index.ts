// Imports
import Express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { authorize, login, tryCookies } from './authorization'; 
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const moment = require('moment');
require('dotenv').config();

import { User, Message } from './schemas';

// Express
const app = Express();
app.use(Express.json());
app.use(cookieParser());
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof SyntaxError) {
        return res.status(400).send(`<h1>Bad Request: JSON is not formatted correctly</h1>`);
    }
    next();
})

// Send new Message
app.post('/send/:recipient', authorize, async ( req: Request, res: Response) => {
    try {
        const recipient = await User.findOne({username: req.params['recipient']});

        if (!recipient) {
            res.status(400).send('<h1>User not found</h1>');
        } else {
            const { text } = req.body;
            if (!text || text === "") {
                res.status(400).send('<h1>Text cannot be empty</h1>');
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
    } catch(e) {
        console.log(e);
        res.status(500).send('<h1>Internal Server Error</h1>');
    }
    
    
});

// Retrieve Messages
app.get('/messages/:recipient', authorize, async (req: Request, res: Response, next: NextFunction) => {
    const recipient = req.params['recipient'];
    const messages = await Message.aggregate([
        { $match : { $or: [
            { sender: res.locals.username, recipient: recipient},
            { sender: recipient, recipient: res.locals.username}
        ]}},
        { $sort: { unix: -1} },
        { $skip: 0 },
        { $limit: 10},
        { $addFields: {
            fromMe: { $eq: ["$sender", res.locals.username] }
        }},
        { $project: { _id: 0, sender: 0, recipient: 0 } },
    ]);

    res.status(200).json(messages);
});

// Login
app.post('/login', login);

// Testing
app.get('/verify', authorize, (req: Request, res: Response) => {
    res.send('SUCCESS');
})

app.get('/cookies', (req: Request, res: Response) => {
    console.log(req.cookies);
    res.json(req.cookies);
    console.log('hello world');
});

app.get('/custom', tryCookies, (req: Request, res: Response) => {});

app.use('/', (req: Request, res: Response) => {
    res.status(404);
    res.send('<h1>404 Not Found</h1>');
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
    console.log(await User.find({}));
});