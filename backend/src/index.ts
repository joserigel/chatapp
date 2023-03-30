// Import
import Express from 'express';
require('dotenv').config();

const app = Express();

app.get('/send/:user', (req: Express.Request, res: Express.Response) => {
    console.log(req.params);
    let user: string = req.params['user'];
    console.log(user);
});

app.use('/', (req: Express.Request, res: Express.Response) => {
    res.status(404);
    res.end('<h1>404 Not Found</h1>');
});

app.listen(3000, () => {
    console.log(`listening ${3000}`);
});