import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from '../service/api.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FlightResponseDto} from '../dto/flightResponseDto';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  formData: FormGroup;
  flightsInfo: FlightResponseDto = new FlightResponseDto();
  submitting = false;

  constructor(public apiService: ApiService, private formBuilder: FormBuilder) {

    this.formData = this.formBuilder.group({
      from: 'madrid',
      to: 'budapest'
    });
  }

  submit() {
    this.submitting = true;
    const sub = this.apiService.makeApiCall(this.formData.get("from")?.getRawValue(), this.formData.get("to")?.getRawValue()).subscribe((res) => {
      this.submitting = false;
      this.flightsInfo = res;
      sub.unsubscribe();
    })
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    // aqui lo sutyo es un subject que automaticamente unsubscriba todas las suscripciones
  }
}
