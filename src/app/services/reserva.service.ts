import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reservas } from '../models/reserva';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  constructor(private http:HttpClient) { }

  getReservas():Observable<Reservas[]>{
    return this.http.get<Reservas[]>("https://671fe287e7a5792f052fdf93.mockapi.io/reservations");
  }

  post(reserva:Reservas):Observable<Reservas>{
    return this.http.post<Reservas>("https://671fe287e7a5792f052fdf93.mockapi.io/reservations",reserva);
  }
  

}
