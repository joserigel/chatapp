import { Request, Response, NextFunction } from 'express';
import { TokenExpiredError } from 'jsonwebtoken';

import { User } from './schemas';

const jwt = require('jsonwebtoken');
const moment = require('moment');

const generateToken = (username: string, ip: string):string => {
    const token = jwt.sign(
        { ip, username },
        process.env.TOKEN_KEY,
        { expiresIn: "2h" }
    );

    return token
}

export const authorize = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.body;

        if (!token) {
            res.status(401).end('<h1>Token is required</h1>');
        } else {
            const { ip, username, iat, exp} = jwt.verify(token, process.env.TOKEN_KEY);

            if (!(ip && username && iat && exp)) {
                res.status(401).end('Bad Auth');
            } else {
                if (req.ip === ip && exp >= moment().unix()) {
                    res.locals.username = username;
                    res.locals.token = generateToken(username, req.ip);
                    next();
                } else {
                    res.status(401).end('Bad Auth');
                }
            }
        }
    } catch(e) {
        if (e instanceof TokenExpiredError) {
            res.status(401).end('<h1>Token has Expired</h1>');
        } else {
            console.log(e);
            res.status(500).end('<h1>Internal Server Error</h1>');
        }
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    try {
        
        if (!(username && password)) {
            res.status(400).end(`<h1>Username and Password is required!</h1>`);
        } else {
            const cred = await User.findOne({username: username});
            
            if (cred?.password === password) {
                const token = generateToken(username, req.ip);
                
                res.status(200).json({token});
            } else {
                res.status(400).end('<h1>Bad Credentials</h1>');
            }
        }
    } catch (e) {
        console.log(e);
        res.end(`<h1>Internal Server Error</h1>`);
    }
}