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
import { SqliteStore } from "../../infrastructure/sqlite/store";

const FINE_PER_DAY = 2000;

export class LibraryService {
  constructor(private readonly store: SqliteStore) {}

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

  private normalizeDate(date: Date): Date {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  }

  private calculateExpectedReturnDate(prestamo: Prestamo): Date {
    const ejemplar = this.store.getEjemplar(prestamo.ejemplarId);
    const libro = ejemplar ? this.store.getLibro(ejemplar.idLibro) : undefined;

    if (libro) {
      const fechaPrestamo = this.parseDate(prestamo.fechaPrestamo, "fechaPrestamo");
      const days = libro.tipo === "alta_demanda" ? 3 : 15;
      return this.addDays(fechaPrestamo, days);
    }

    return new Date(prestamo.fechaDevolucionEsperada);
  }

  private refreshLoanStatuses(referenceDate: Date = new Date()): void {
    const currentDay = this.normalizeDate(referenceDate);

    this.store.listPrestamos().forEach((prestamo) => {
      if (prestamo.fechaDevolucionReal !== null || prestamo.estado === "devuelto") {
        return;
      }

      const expectedDate = this.normalizeDate(this.calculateExpectedReturnDate(prestamo));
      const nextState: Prestamo["estado"] = currentDay > expectedDate ? "vencido" : "activo";

      if (prestamo.estado !== nextState) {
        prestamo.estado = nextState;
        this.store.updatePrestamo(prestamo);
      }
    });
  }

  public refreshLoanStatusesDaily(): void {
    this.refreshLoanStatuses(new Date());
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
    if (this.store.hasLibro(id)) {
      throw new AppError("Libro ya existe", 409);
    }

    const libro: Libro = {
      id,
      titulo: this.assertRequiredString(input.titulo, "titulo"),
      autor: this.assertRequiredString(input.autor, "autor"),
      ubicacionSala: this.assertRequiredString(input.ubicacion_sala, "ubicacion_sala"),
      tipo: this.assertBookType(input.tipo)
    };

    this.store.insertLibro(libro);
    return libro;
  }

  public listLibros(): Libro[] {
    return this.store.listLibros();
  }

  public getLibro(id: string): Libro {
    const libro = this.store.getLibro(id);
    if (!libro) {
      throw new AppError("Libro no encontrado", 404);
    }

    return libro;
  }

  public deleteLibro(id: string): { message: string } {
    if (!this.store.hasLibro(id)) {
      throw new AppError("Libro no encontrado", 404);
    }

    this.store.deleteLibro(id);
    return { message: "Libro eliminado" };
  }

  public createEjemplar(input: Record<string, unknown>): Ejemplar {
    const id = this.assertRequiredString(input.id, "id");
    if (this.store.hasEjemplar(id)) {
      throw new AppError("Ejemplar ya existe", 409);
    }

    const idLibro = this.assertRequiredString(input.idLibro, "idLibro");
    if (!this.store.hasLibro(idLibro)) {
      throw new AppError("Libro no encontrado", 404);
    }

    const ejemplar: Ejemplar = { id, idLibro };
    this.store.insertEjemplar(ejemplar);
    return ejemplar;
  }

  public listEjemplaresByLibro(idLibro: string): Ejemplar[] {
    return this.store.listEjemplaresByLibro(idLibro);
  }

  public listEjemplares(): Ejemplar[] {
    return this.store.listEjemplares();
  }

  public createEstudiante(input: Record<string, unknown>): Estudiante {
    const id = this.assertRequiredString(input.id, "id");
    if (this.store.hasEstudiante(id)) {
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

    this.store.insertEstudiante(estudiante);
    return estudiante;
  }

  public listEstudiantes(): Estudiante[] {
    return this.store.listEstudiantes();
  }

  public getEstudiante(id: string): Estudiante {
    const estudiante = this.store.getEstudiante(id);
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

    this.store.updateEstudiante(estudiante);
    return estudiante;
  }

  public deleteEstudiante(id: string): { message: string } {
    if (!this.store.hasEstudiante(id)) {
      throw new AppError("Estudiante no encontrado", 404);
    }

    this.store.deleteEstudiante(id);
    return { message: "Estudiante eliminado" };
  }

  public createPrestamo(input: Record<string, unknown>): Prestamo {
    this.refreshLoanStatuses();

    const id = this.assertRequiredString(input.id, "id");
    if (this.store.hasPrestamo(id)) {
      throw new AppError("Prestamo ya existe", 409);
    }

    const estudianteId = this.assertRequiredString(input.estudiante_id, "estudiante_id");
    const ejemplarId = this.assertRequiredString(input.ejemplar_id, "ejemplar_id");
    const fechaPrestamo = this.parseDate(
      this.assertRequiredString(input.fecha_prestamo, "fecha_prestamo"),
      "fecha_prestamo"
    );

    const estudiante = this.store.getEstudiante(estudianteId);
    if (!estudiante) {
      throw new AppError("Estudiante no encontrado", 404);
    }

    const ejemplar = this.store.getEjemplar(ejemplarId);
    if (!ejemplar) {
      throw new AppError("Ejemplar no encontrado", 404);
    }

    const libro = this.store.getLibro(ejemplar.idLibro);
    if (!libro) {
      throw new AppError("Libro no encontrado", 404);
    }

    const maxAllowed = estudiante.tipo === "pregrado" ? 3 : 5;
    const activeCount = this.store.listPrestamos().filter(
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

    const hasExpiredLoans = this.store.listPrestamos().some(
      (prestamo) => prestamo.estudianteId === estudianteId && prestamo.estado === "vencido"
    );

    const hasPendingFine = this.store.hasPendingFineByEstudiante(estudianteId);

    if (hasExpiredLoans || hasPendingFine) {
      throw new AppError(
        JSON.stringify({ error: "prestamo_vencidos_o_multas_pendientes" }),
        409
      );
    }

    const ejemplarActivo = this.store.listPrestamos().some(
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

    this.store.insertPrestamo(prestamo);
    return prestamo;
  }

  public listPrestamos(): Prestamo[] {
    this.refreshLoanStatuses();
    return this.store.listPrestamos();
  }

  public getPrestamo(id: string): Prestamo {
    this.refreshLoanStatuses();
    const prestamo = this.store.getPrestamo(id);
    if (!prestamo) {
      throw new AppError("Prestamo no encontrado", 404);
    }

    return prestamo;
  }

  public listPrestamosByEstudiante(estudianteId: string): Prestamo[] {
    this.refreshLoanStatuses();
    if (!this.store.hasEstudiante(estudianteId)) {
      throw new AppError("Estudiante no encontrado", 404);
    }

    return this.store.listPrestamos().filter((prestamo) => prestamo.estudianteId === estudianteId);
  }

  public renovarPrestamo(id: string, input: Record<string, unknown>): Prestamo {
    const prestamo = this.getPrestamo(id);
    if (prestamo.estado === "devuelto") {
      throw new AppError("Prestamo ya finalizado", 409);
    }

    if (this.store.hasSolicitudBlockingRenovacion(id, prestamo.estudianteId)) {
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
    this.store.updatePrestamo(prestamo);
    return prestamo;
  }

  public deletePrestamo(id: string): { message: string } {
    if (!this.store.hasPrestamo(id)) {
      throw new AppError("Prestamo no encontrado", 404);
    }

    this.store.deletePrestamo(id);
    return { message: "Prestamo eliminado" };
  }

  public registrarDevolucion(input: Record<string, unknown>): { devolucion: Devolucion; multa: Multa | null } {
    const id = this.assertRequiredString(input.id, "id");
    if (this.store.hasDevolucion(id)) {
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
    this.store.updatePrestamo(prestamo);

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
      this.store.insertMulta(multa);
    }

    const devolucion: Devolucion = {
      id,
      prestamoId,
      fechaDevolucion: this.toIsoDate(fechaDevolucion),
      multaId: multa?.id ?? null
    };

    this.store.insertDevolucion(devolucion);
    return { devolucion, multa };
  }

  public getDevolucion(id: string): Devolucion {
    const devolucion = this.store.getDevolucion(id);
    if (!devolucion) {
      throw new AppError("Devolucion no encontrada", 404);
    }

    return devolucion;
  }

  public createSolicitud(input: Record<string, unknown>): Solicitud {
    const estudianteId = this.assertRequiredString(input.estudiante_id, "estudiante_id");
    const prestamoId = this.assertRequiredString(input.prestamo_id, "prestamo_id");

    if (!this.store.hasEstudiante(estudianteId)) {
      throw new AppError("Estudiante no encontrado", 404);
    }

    if (!this.store.hasPrestamo(prestamoId)) {
      throw new AppError("Prestamo no encontrado", 404);
    }

    if (this.store.hasSolicitudByPair(estudianteId, prestamoId)) {
      throw new AppError("Solicitud ya existe", 409);
    }

    const solicitud: Solicitud = { estudianteId, prestamoId };
    this.store.insertSolicitud(solicitud);
    return solicitud;
  }

  public listSolicitudes(): Solicitud[] {
    return this.store.listSolicitudes();
  }
}