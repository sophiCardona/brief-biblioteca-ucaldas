import {
  Devolucion,
  Ejemplar,
  Estudiante,
  Libro,
  Multa,
  Prestamo,
  Solicitud
} from "../../core/entities";

export class InMemoryStore {
  public readonly libros = new Map<string, Libro>();
  public readonly ejemplares = new Map<string, Ejemplar>();
  public readonly estudiantes = new Map<string, Estudiante>();
  public readonly prestamos = new Map<string, Prestamo>();
  public readonly multas = new Map<string, Multa>();
  public readonly solicitudes: Solicitud[] = [];
  public readonly devoluciones = new Map<string, Devolucion>();

  public reset(): void {
    this.libros.clear();
    this.ejemplares.clear();
    this.estudiantes.clear();
    this.prestamos.clear();
    this.multas.clear();
    this.solicitudes.length = 0;
    this.devoluciones.clear();
  }
}

export const store = new InMemoryStore();
