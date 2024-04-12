import {Component, Input} from '@angular/core';
import {SinglePlaceWeatherDto} from '../../dto/single-place-weather.dto';

@Component({
  selector: 'app-weather-view',
  templateUrl: './weather-view.component.html',
  styleUrls: ['./weather-view.component.css']
})
export class WeatherViewComponent {
  @Input()
  weather: SinglePlaceWeatherDto = new SinglePlaceWeatherDto();
}
