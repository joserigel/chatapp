import { Request, Response, NextFunction } from 'express';
import { TokenExpiredError } from 'jsonwebtoken';

const authorize = (req: Request, res: Response, next: NextFunction) => {
    try {

    } catch(e) {
        if (e instanceof TokenExpiredError) {
            res.status(401).end('<h1>Token has Expired</h1>');
        } else {
            res.status(500).end('<h1>Internal Server Error</h1>');
        }
    }
}