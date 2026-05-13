export type BookType = "normal" | "alta_demanda";
export type StudentType = "pregrado" | "posgrado";
export type LoanState = "activo" | "vencido" | "devuelto";

export interface Libro {
  id: string;
  titulo: string;
  autor: string;
  ubicacionSala: string;
  tipo: BookType;
}

export interface Ejemplar {
  id: string;
  idLibro: string;
}

export interface Estudiante {
  id: string;
  progAcademico: string;
  semestre: number;
  tipo: StudentType;
}

export interface Prestamo {
  id: string;
  estudianteId: string;
  ejemplarId: string;
  fechaPrestamo: string;
  fechaDevolucionEsperada: string;
  fechaDevolucionReal: string | null;
  estado: LoanState;
}

export interface Multa {
  id: string;
  estudianteId: string;
  historialId: string;
  fechaDevolucionEsperada: string;
  fechaDevolucionReal: string;
  diasRetraso: number;
  valor: number;
}

export interface Solicitud {
  estudianteId: string;
  prestamoId: string;
}

export interface Devolucion {
  id: string;
  prestamoId: string;
  fechaDevolucion: string;
  multaId: string | null;
}
