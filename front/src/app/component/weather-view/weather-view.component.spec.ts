import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WeatherViewComponent} from './weather-view.component';

describe('WeatherViewComponent', () => {
  let component: WeatherViewComponent;
  let fixture: ComponentFixture<WeatherViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WeatherViewComponent]
    });
    fixture = TestBed.createComponent(WeatherViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
