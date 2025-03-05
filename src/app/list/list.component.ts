import { Component, OnInit } from '@angular/core';
import { Reservas } from '../models/reserva';
import { ReservaService } from '../services/reserva.service';
import { CommonModule, NgFor } from '@angular/common';
import { Servicio } from '../models/servicio';
import { ServiciosService } from '../services/servicios.service';

@Component({
  selector: 'app-list',
  imports: [NgFor,CommonModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {



listReservas!: Reservas[];
  listServicios!: Servicio[];

  constructor(private reservaService: ReservaService,private servicioService:ServiciosService) {}

  ngOnInit(): void {
    this.reservaService.getReservas()
      .subscribe(reservas => {
        this.listReservas = reservas;
      });

    this.servicioService.getServicios()
      .subscribe(servicios => {
        this.listServicios = servicios;
      });
  }

  getFechaSalida(idServicio: string): string {
    const servicio = this.listServicios.find(serv => serv.id === idServicio);
    return servicio ? `${servicio.departureDate} ${servicio.departureTime}` : 'No disponible';
  }

}
