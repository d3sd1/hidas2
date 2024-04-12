import {SingleFlightDto} from './single-flight.dto';
import {SinglePlaceWeatherDto} from './single-place-weather.dto';

export class FlightResponseDto {
  flights: SingleFlightDto[] = [];
  weather: SinglePlaceWeatherDto[] = [];
}
