// Imports
import Express from 'express';
import { TokenExpiredError } from 'jsonwebtoken';
import mongoose, { Schema, model } from 'mongoose';
const jwt = require('jsonwebtoken');
const moment = require('moment');
require('dotenv').config();

// Schemas
const schema = new Schema({ username: String, password: String});
const User = model('User', schema, 'users');

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

app.post('/login', async (req: Express.Request, res: Express.Response) => {
    try {
        const { username, password } = req.body;
        
        if (!(username && password)) {
            res.status(400).end('Bad Request');
        } else {
            const user = await User.findOne({ username });
            
            if (user?.password === password) {
                const token = jwt.sign(
                    { ip: req.ip, username},
                    process.env.TOKEN_KEY,
                    {
                        expiresIn: "2h",
                    }
                );

                res.status(200).json(token);
            } else {
                res.status(400).end('Bad Credentials');
            }
        }
    } catch (e) {
        res.status(500).end(e);
    }
});


// Testing

app.get('/verify', async(req: Express.Request, res: Express.Response) => {
    try {
        const { token } = req.body;

        const {ip, username, iat, exp, password} = jwt.verify(token, process.env.TOKEN_KEY);

        if (!password) {
            console.log('password is null');
        }
        res.end(`${ip} == ${req.ip}`);
        
    } catch(e) {
        if (e instanceof TokenExpiredError) {
            res.status(409).end('<h1>Token has Expired</h1>')
        } else {
            res.status(500).end('<h1>Internal Server Error</h1>')
        }
    }
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