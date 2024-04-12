import {Express, Request, Response} from 'express';
import flightsRouter from '../controller/flight.controller';

const routerSetup = (app: Express) =>
    app
        .get('/', async (req: Request, res: Response) => {
            res.send('Hello team!');
        })
        .use('/api/flights', flightsRouter);

export default routerSetup;
