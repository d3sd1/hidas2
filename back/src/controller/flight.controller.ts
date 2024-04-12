import {Request, Response, Router} from 'express';
import getFlightsFromTo from '../robot/flights';
import {getWeatherOfCity} from '../service/weatherapi.service';

const controller = Router();

controller

    // aqui lo suyo seria usar anotaciones de validacion en lugar de hacerlo en el codigo del propio controlador
    .get('/', async (req: Request, res: Response) => {
        const from: string = req.query.from as string;
        const to: string = req.query.to as string;

        const flights = await getFlightsFromTo(from, to, false);

        res.send({
            flights,
            weather: await getWeatherOfCity(to)
        });
    })

export default controller;
