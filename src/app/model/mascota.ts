import { Propietario } from "./propietario";

export class Mascota {
  idMascota?: number;
  nombreMascota: string = "";
  especieMascota: string = "";
  edadMascota: number = 0;
  idPropietario?: Propietario;
  createAt: string = new Date().toISOString().split('T')[0];
}
