import { AppError } from "../errors";
import {
  BookType,
  Devolucion,
  Ejemplar,
  Estudiante,
  Libro,
  Multa,
  Prestamo,
  Solicitud,
  StudentType
} from "../entities";
import { InMemoryStore } from "../../infrastructure/memory/store";

const FINE_PER_DAY = 2000;

export class LibraryService {
  constructor(private readonly store: InMemoryStore) {}

  private parseDate(value: string, fieldName: string): Date {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      throw new AppError(`Fecha invalida en ${fieldName}`, 400);
    }
    return parsed;
  }

  private toIsoDate(date: Date): string {
    return date.toISOString();
  }

  private addDays(date: Date, days: number): Date {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
  }

  private refreshLoanStatuses(referenceDate: Date = new Date()): void {
    this.store.prestamos.forEach((prestamo) => {
      if (prestamo.estado === "devuelto") {
        return;
      }

      const due = new Date(prestamo.fechaDevolucionEsperada);
      if (referenceDate > due) {
        prestamo.estado = "vencido";
      } else {
        prestamo.estado = "activo";
      }
    });
  }

  private assertRequiredString(value: unknown, fieldName: string): string {
    if (typeof value !== "string" || value.trim() === "") {
      throw new AppError(`Campo requerido: ${fieldName}`, 400);
    }
    return value.trim();
  }

  private assertBookType(value: unknown): BookType {
    if (value === "normal" || value === "alta_demanda") {
      return value;
    }
    throw new AppError("tipo_libro_desconocido", 400);
  }

  private assertStudentType(value: unknown): StudentType {
    if (value === "pregrado" || value === "posgrado") {
      return value;
    }
    throw new AppError("Campo tipo debe ser pregrado o posgrado", 400);
  }

  public createLibro(input: Record<string, unknown>): Libro {
    const id = this.assertRequiredString(input.id, "id");
    if (this.store.libros.has(id)) {
      throw new AppError("Libro ya existe", 409);
    }

    const libro: Libro = {
      id,
      titulo: this.assertRequiredString(input.titulo, "titulo"),
      autor: this.assertRequiredString(input.autor, "autor"),
      ubicacionSala: this.assertRequiredString(input.ubicacion_sala, "ubicacion_sala"),
      tipo: this.assertBookType(input.tipo)
    };

    this.store.libros.set(libro.id, libro);
    return libro;
  }

  public listLibros(): Libro[] {
    return Array.from(this.store.libros.values());
  }

  public getLibro(id: string): Libro {
    const libro = this.store.libros.get(id);
    if (!libro) {
      throw new AppError("Libro no encontrado", 404);
    }
    return libro;
  }

  public deleteLibro(id: string): { message: string } {
    if (!this.store.libros.has(id)) {
      throw new AppError("Libro no encontrado", 404);
    }

    this.store.libros.delete(id);

    Array.from(this.store.ejemplares.values())
      .filter((ejemplar) => ejemplar.idLibro === id)
      .forEach((ejemplar) => {
        this.store.ejemplares.delete(ejemplar.id);
      });

    return { message: "Libro eliminado" };
  }

  public createEjemplar(input: Record<string, unknown>): Ejemplar {
    const id = this.assertRequiredString(input.id, "id");
    if (this.store.ejemplares.has(id)) {
      throw new AppError("Ejemplar ya existe", 409);
    }

    const idLibro = this.assertRequiredString(input.idLibro, "idLibro");
    if (!this.store.libros.has(idLibro)) {
      throw new AppError("Libro no encontrado", 404);
    }

    const ejemplar: Ejemplar = { id, idLibro };
    this.store.ejemplares.set(ejemplar.id, ejemplar);
    return ejemplar;
  }

  public listEjemplaresByLibro(idLibro: string): Ejemplar[] {
    return Array.from(this.store.ejemplares.values()).filter((ejemplar) => ejemplar.idLibro === idLibro);
  }

  public createEstudiante(input: Record<string, unknown>): Estudiante {
    const id = this.assertRequiredString(input.id, "id");
    if (this.store.estudiantes.has(id)) {
      throw new AppError("Estudiante ya existe", 409);
    }

    const semestre = Number(input.semestre);
    if (!Number.isInteger(semestre) || semestre <= 0) {
      throw new AppError("Campo semestre invalido", 400);
    }

    const estudiante: Estudiante = {
      id,
      progAcademico: this.assertRequiredString(input.progAcademico, "progAcademico"),
      semestre,
      tipo: this.assertStudentType(input.tipo)
    };

    this.store.estudiantes.set(estudiante.id, estudiante);
    return estudiante;
  }

  public listEstudiantes(): Estudiante[] {
    return Array.from(this.store.estudiantes.values());
  }

  public getEstudiante(id: string): Estudiante {
    const estudiante = this.store.estudiantes.get(id);
    if (!estudiante) {
      throw new AppError("Estudiante no encontrado", 404);
    }
    return estudiante;
  }

  public updateEstudiante(id: string, input: Record<string, unknown>): Estudiante {
    const estudiante = this.getEstudiante(id);

    if (input.progAcademico !== undefined) {
      estudiante.progAcademico = this.assertRequiredString(input.progAcademico, "progAcademico");
    }
    if (input.semestre !== undefined) {
      const semestre = Number(input.semestre);
      if (!Number.isInteger(semestre) || semestre <= 0) {
        throw new AppError("Campo semestre invalido", 400);
      }
      estudiante.semestre = semestre;
    }
    if (input.tipo !== undefined) {
      estudiante.tipo = this.assertStudentType(input.tipo);
    }

    this.store.estudiantes.set(estudiante.id, estudiante);
    return estudiante;
  }

  public deleteEstudiante(id: string): { message: string } {
    if (!this.store.estudiantes.has(id)) {
      throw new AppError("Estudiante no encontrado", 404);
    }

    this.store.estudiantes.delete(id);
    return { message: "Estudiante eliminado" };
  }

  public createPrestamo(input: Record<string, unknown>): Prestamo {
    this.refreshLoanStatuses();

    const id = this.assertRequiredString(input.id, "id");
    if (this.store.prestamos.has(id)) {
      throw new AppError("Prestamo ya existe", 409);
    }

    const estudianteId = this.assertRequiredString(input.estudiante_id, "estudiante_id");
    const ejemplarId = this.assertRequiredString(input.ejemplar_id, "ejemplar_id");
    const fechaPrestamo = this.parseDate(
      this.assertRequiredString(input.fecha_prestamo, "fecha_prestamo"),
      "fecha_prestamo"
    );

    const estudiante = this.store.estudiantes.get(estudianteId);
    if (!estudiante) {
      throw new AppError("Estudiante no encontrado", 404);
    }

    const ejemplar = this.store.ejemplares.get(ejemplarId);
    if (!ejemplar) {
      throw new AppError("Ejemplar no encontrado", 404);
    }

    const libro = this.store.libros.get(ejemplar.idLibro);
    if (!libro) {
      throw new AppError("Libro no encontrado", 404);
    }

    const maxAllowed = estudiante.tipo === "pregrado" ? 3 : 5;
    const activeCount = Array.from(this.store.prestamos.values()).filter(
      (prestamo) => prestamo.estudianteId === estudianteId && prestamo.estado === "activo"
    ).length;

    if (activeCount >= maxAllowed) {
      throw new AppError(
        JSON.stringify({
          error: "limite_prestamos_alcanzado",
          limite: maxAllowed,
          actuales: activeCount
        }),
        409
      );
    }

    const hasExpiredLoans = Array.from(this.store.prestamos.values()).some(
      (prestamo) => prestamo.estudianteId === estudianteId && prestamo.estado === "vencido"
    );

    const hasPendingFine = Array.from(this.store.multas.values()).some((multa) => multa.estudianteId === estudianteId);

    if (hasExpiredLoans || hasPendingFine) {
      throw new AppError(
        JSON.stringify({ error: "prestamo_vencidos_o_multas_pendientes" }),
        409
      );
    }

    const ejemplarActivo = Array.from(this.store.prestamos.values()).some(
      (prestamo) => prestamo.ejemplarId === ejemplarId && prestamo.estado !== "devuelto"
    );

    if (ejemplarActivo) {
      throw new AppError("Ejemplar no disponible", 409);
    }

    const days = libro.tipo === "alta_demanda" ? 3 : 15;
    const prestamo: Prestamo = {
      id,
      estudianteId,
      ejemplarId,
      fechaPrestamo: this.toIsoDate(fechaPrestamo),
      fechaDevolucionEsperada: this.toIsoDate(this.addDays(fechaPrestamo, days)),
      fechaDevolucionReal: null,
      estado: "activo"
    };

    this.store.prestamos.set(prestamo.id, prestamo);
    return prestamo;
  }

  public listPrestamos(): Prestamo[] {
    this.refreshLoanStatuses();
    return Array.from(this.store.prestamos.values());
  }

  public getPrestamo(id: string): Prestamo {
    this.refreshLoanStatuses();
    const prestamo = this.store.prestamos.get(id);
    if (!prestamo) {
      throw new AppError("Prestamo no encontrado", 404);
    }
    return prestamo;
  }

  public listPrestamosByEstudiante(estudianteId: string): Prestamo[] {
    this.refreshLoanStatuses();
    if (!this.store.estudiantes.has(estudianteId)) {
      throw new AppError("Estudiante no encontrado", 404);
    }

    return Array.from(this.store.prestamos.values()).filter((prestamo) => prestamo.estudianteId === estudianteId);
  }

  public renovarPrestamo(id: string, input: Record<string, unknown>): Prestamo {
    const prestamo = this.getPrestamo(id);
    if (prestamo.estado === "devuelto") {
      throw new AppError("Prestamo ya finalizado", 409);
    }

    const blockedByRequest = this.store.solicitudes.some(
      (solicitud) => solicitud.prestamoId === id && solicitud.estudianteId !== prestamo.estudianteId
    );

    if (blockedByRequest) {
      throw new AppError(
        JSON.stringify({ error: "renovacion_no_permitida_solicitudes_pendientes" }),
        409
      );
    }

    const nuevaFecha = this.parseDate(
      this.assertRequiredString(input.fecha_devolucion_nueva, "fecha_devolucion_nueva"),
      "fecha_devolucion_nueva"
    );

    prestamo.fechaDevolucionEsperada = this.toIsoDate(nuevaFecha);
    prestamo.estado = "activo";
    this.store.prestamos.set(prestamo.id, prestamo);
    return prestamo;
  }

  public deletePrestamo(id: string): { message: string } {
    if (!this.store.prestamos.has(id)) {
      throw new AppError("Prestamo no encontrado", 404);
    }

    this.store.prestamos.delete(id);
    return { message: "Prestamo eliminado" };
  }

  public registrarDevolucion(input: Record<string, unknown>): { devolucion: Devolucion; multa: Multa | null } {
    const id = this.assertRequiredString(input.id, "id");
    if (this.store.devoluciones.has(id)) {
      throw new AppError("Devolucion ya existe", 409);
    }

    const prestamoId = this.assertRequiredString(input.prestamo_id, "prestamo_id");
    const prestamo = this.getPrestamo(prestamoId);
    if (prestamo.estado === "devuelto") {
      throw new AppError("Prestamo ya devuelto", 409);
    }

    const fechaDevolucion = this.parseDate(
      this.assertRequiredString(input.fecha_devolucion, "fecha_devolucion"),
      "fecha_devolucion"
    );

    prestamo.fechaDevolucionReal = this.toIsoDate(fechaDevolucion);
    prestamo.estado = "devuelto";
    this.store.prestamos.set(prestamo.id, prestamo);

    const dueDate = new Date(prestamo.fechaDevolucionEsperada);
    const delayMs = fechaDevolucion.getTime() - dueDate.getTime();
    const daysLate = Math.max(0, Math.ceil(delayMs / (1000 * 60 * 60 * 24)));

    let multa: Multa | null = null;
    if (daysLate > 0) {
      multa = {
        id: `multa-${prestamo.id}`,
        estudianteId: prestamo.estudianteId,
        historialId: prestamo.id,
        fechaDevolucionEsperada: prestamo.fechaDevolucionEsperada,
        fechaDevolucionReal: prestamo.fechaDevolucionReal,
        diasRetraso: daysLate,
        valor: daysLate * FINE_PER_DAY
      };
      this.store.multas.set(multa.id, multa);
    }

    const devolucion: Devolucion = {
      id,
      prestamoId,
      fechaDevolucion: this.toIsoDate(fechaDevolucion),
      multaId: multa?.id ?? null
    };

    this.store.devoluciones.set(devolucion.id, devolucion);
    return { devolucion, multa };
  }

  public getDevolucion(id: string): Devolucion {
    const devolucion = this.store.devoluciones.get(id);
    if (!devolucion) {
      throw new AppError("Devolucion no encontrada", 404);
    }
    return devolucion;
  }

  public createSolicitud(input: Record<string, unknown>): Solicitud {
    const estudianteId = this.assertRequiredString(input.estudiante_id, "estudiante_id");
    const prestamoId = this.assertRequiredString(input.prestamo_id, "prestamo_id");

    if (!this.store.estudiantes.has(estudianteId)) {
      throw new AppError("Estudiante no encontrado", 404);
    }
    if (!this.store.prestamos.has(prestamoId)) {
      throw new AppError("Prestamo no encontrado", 404);
    }

    const exists = this.store.solicitudes.some(
      (solicitud) => solicitud.estudianteId === estudianteId && solicitud.prestamoId === prestamoId
    );
    if (exists) {
      throw new AppError("Solicitud ya existe", 409);
    }

    const solicitud: Solicitud = { estudianteId, prestamoId };
    this.store.solicitudes.push(solicitud);
    return solicitud;
  }

  public listSolicitudes(): Solicitud[] {
    return [...this.store.solicitudes];
  }
}
