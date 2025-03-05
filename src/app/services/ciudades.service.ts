import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ciudad } from '../models/ciudad';

@Injectable({
  providedIn: 'root'
})
export class CiudadesService {

  constructor(private http:HttpClient) { }

  getCiudades():Observable<Ciudad[]>{
    return this.http.get<Ciudad[]>("https://679b8dc433d31684632448c9.mockapi.io/cities");
  }
}
