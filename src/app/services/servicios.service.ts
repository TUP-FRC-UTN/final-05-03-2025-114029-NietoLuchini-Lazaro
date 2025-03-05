import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Servicio } from '../models/servicio';

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {

  constructor(private http:HttpClient) { }

  apiUrl:string="https://679b8dc433d31684632448c9.mockapi.io/services";
  getServicios():Observable<Servicio[]>{
    return this.http.get<Servicio[]>("https://679b8dc433d31684632448c9.mockapi.io/services");
  }



  getServiciosPorFecha(fecha: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?fecha=${fecha}`);
  }
}
