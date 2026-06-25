export class Propietario {
  idPropietario?: number;
  nombrePropietario: string = "";
  telefonoPropietario: string = "";
  createAt: string = new Date().toISOString().split('T')[0];
}
