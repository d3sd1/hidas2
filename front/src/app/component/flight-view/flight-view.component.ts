import {Component, Input} from '@angular/core';
import {SingleFlightDto} from '../../dto/single-flight.dto';

@Component({
  selector: 'app-flight-view',
  templateUrl: './flight-view.component.html',
  styleUrls: ['./flight-view.component.css']
})
export class FlightViewComponent {
  @Input()
  flight: SingleFlightDto = new SingleFlightDto();
}
