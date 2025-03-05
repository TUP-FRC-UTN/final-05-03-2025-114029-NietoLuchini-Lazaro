export interface Pasajeros {
    document: string;
    firstName: string;
    lastName: string;
  }
  
  export interface Reservas {
    id: string;
    document: string;
    firstName: string;
    lastName: string;
    service: string;
    reservationCode: string;
    passengers: Pasajeros[];
  }
  