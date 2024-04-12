import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {FlightResponseDto} from '../dto/flightResponseDto';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) {
  }

  public makeApiCall(from: string, to: string): Observable<FlightResponseDto> {
    if (!from || !to) {
      return new Observable<FlightResponseDto>();
    }
    return this.httpClient.get<FlightResponseDto>(`${environment.apiUrl}/api/flights?to=${to}&from=${from}`);
  }
}
