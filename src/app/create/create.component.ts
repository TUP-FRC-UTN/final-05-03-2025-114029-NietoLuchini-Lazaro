import { Component, OnInit } from '@angular/core';
import { CiudadesService } from '../services/ciudades.service';
import { Ciudad } from '../models/ciudad';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ServiciosService } from '../services/servicios.service';
import { Servicio } from '../models/servicio';
import { Reservas } from '../models/reserva';
import { ReservaService } from '../services/reserva.service';

@Component({
  selector: 'app-create',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent implements OnInit{

  
  listCiudades!: Ciudad[];
  listServicios: Servicio[] = [];
  formReserva!: FormGroup;

  constructor(private ciudadService: CiudadesService, private fb: FormBuilder,private servicioService:ServiciosService,private reservaService:ReservaService) {}

  ngOnInit(): void {
    this.ciudadService.getCiudades().subscribe(result => {
      this.listCiudades = result;
    });

    this.formReserva = this.fb.group({
      origen: ['', Validators.required],
      destino: ['', Validators.required],
      fecha: ['', Validators.required],
      servicio: [''],
      documento: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      pasajeros: this.fb.array([])
    });

    this.formReserva.get('destino')?.valueChanges.subscribe(destino => {
      const origen = this.formReserva.get('origen')?.value;
      if (destino && origen && destino === origen) {
        this.formReserva.get('destino')?.setErrors({ mismoOrigen: true });
      }
    });

    this.formReserva.get('documento')?.valueChanges.subscribe(() => {
      this.validarDocumento();
    });
  }

  get pasajeros(): FormArray {
    return this.formReserva.get('pasajeros') as FormArray;
  }
  addPasajero() {
    const pasajeroForm = this.fb.group({
      documento: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
    });

    this.pasajeros.push(pasajeroForm);
  }
  removePasajero(index: number) {
    this.pasajeros.removeAt(index);
  }

  buscarServicios(): void {
    const fechaSeleccionada = this.formReserva.get('fecha')?.value;
    console.log(fechaSeleccionada);
  
    if (!fechaSeleccionada) {
      alert('Debe seleccionar una fecha.');
      return;
    }
  
    this.servicioService.getServicios().subscribe(servicios => {
      const serviciosFiltrados = servicios.filter(servicio => {
        const fechaServicio = new Date(servicio.departureDate).toISOString().split('T')[0];
        return fechaServicio === fechaSeleccionada;
      });
      this.listServicios = serviciosFiltrados;
  
      if (this.listServicios.length === 0) {
        alert('No hay servicios disponibles para la fecha seleccionada.');
      }
    }, (error) => {
      console.error('Error al obtener los servicios:', error);
      alert('Hubo un error al obtener los servicios.');
    });
  }
  

  generarCodigo(): string {
    const nombre = this.formReserva.get('nombre')?.value;
    const apellido = this.formReserva.get('apellido')?.value;
    const documento = this.formReserva.get('documento')?.value;
    const identificadorUnico = 'XYZ987';

    const iniciales = nombre.charAt(0).toUpperCase() + apellido.charAt(0).toUpperCase();
    const ultimosTresDigitos = documento.slice(-3);
    const codigo = `${iniciales}${ultimosTresDigitos}-${identificadorUnico}`;

    return codigo;
  }

  guardar() {
    const form = this.formReserva.value;
  
  // Crear el objeto reserva
  const reserva: Reservas = {
    id: Math.floor(Math.random() * 1000000).toString(),
    reservationCode: this.generarCodigo(),
    document: form.documento,
    firstName: form.nombre,
    lastName: form.apellido,
    service: form.servicio,
    passengers: [
      // Agregar la persona fuera del array de pasajeros
      {
        document: form.documento,
        firstName: form.nombre,
        lastName: form.apellido
      },
      // Agregar los pasajeros del array de pasajeros
      ...this.pasajeros.controls.map((control: AbstractControl) => {
        const pasajero = control as FormGroup;
        return {
          document: pasajero.get('documento')?.value,
          firstName: pasajero.get('nombre')?.value,
          lastName: pasajero.get('apellido')?.value
        };
      }) || []
    ]
  };
  
    if (reserva) {
      this.reservaService.post(reserva).subscribe(
        (response) => {
         
          alert('Reserva guardada correctamente');
          console.log(reserva);
        },
        (error) => {
          console.error('Error al guardar la reserva', error);
          alert('Hubo un error al guardar la reserva');
        }
      );
    }
  }
  

  validarDocumento(): void {
    const documento = this.formReserva.get('documento')?.value;
  
    if (!documento) {
      alert('Debe ingresar un documento.');
      return;
    }

    this.reservaService.getReservas().subscribe(
      (reservas) => {
        const reservaExistente = reservas.find((reserva) => reserva.document === documento);
  
        if (reservaExistente) {
          alert('Ya existe una reserva con ese documento.');
        } else {

          console.log('No hay reservas con ese documento.');
        }
      },
      (error) => {
        console.error('Error al obtener las reservas:', error);
        alert('Hubo un error al verificar el documento.');
      }
    );
  }

}
