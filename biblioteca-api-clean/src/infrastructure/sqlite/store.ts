import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import {
  Devolucion,
  Ejemplar,
  Estudiante,
  Libro,
  Multa,
  Prestamo,
  Solicitud
} from "../../core/entities";

export class SqliteStore {
  private readonly db: Database.Database;

  public constructor(dbPath: string = process.env.BIBLIOTECA_DB_PATH ?? path.join(process.cwd(), "data", "biblioteca.sqlite")) {
    try {
      console.log(`[SQLite] Inicializando BD en: ${dbPath}`);
      fs.mkdirSync(path.dirname(dbPath), { recursive: true });
      this.db = new Database(dbPath);
      console.log(`[SQLite] Conexión exitosa`);
      this.db.pragma("foreign_keys = ON");
      this.initializeSchema();
      console.log(`[SQLite] Schema creado exitosamente`);
    } catch (error) {
      console.error(`[SQLite] Error al inicializar BD:`, error);
      throw error;
    }
  }

  private initializeSchema(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS libros (
        id TEXT PRIMARY KEY,
        titulo TEXT NOT NULL,
        autor TEXT NOT NULL,
        ubicacion_sala TEXT NOT NULL,
        tipo TEXT NOT NULL CHECK (tipo IN ('normal', 'alta_demanda'))
      );

      CREATE TABLE IF NOT EXISTS ejemplares (
        id TEXT PRIMARY KEY,
        id_libro TEXT NOT NULL,
        FOREIGN KEY (id_libro) REFERENCES libros(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS estudiantes (
        id TEXT PRIMARY KEY,
        prog_academico TEXT NOT NULL,
        semestre INTEGER NOT NULL CHECK (semestre > 0),
        tipo TEXT NOT NULL CHECK (tipo IN ('pregrado', 'posgrado'))
      );

      CREATE TABLE IF NOT EXISTS prestamos (
        id TEXT PRIMARY KEY,
        estudiante_id TEXT NOT NULL,
        ejemplar_id TEXT NOT NULL,
        fecha_prestamo TEXT NOT NULL,
        fecha_devolucion_esperada TEXT NOT NULL,
        fecha_devolucion_real TEXT,
        estado TEXT NOT NULL CHECK (estado IN ('activo', 'vencido', 'devuelto')),
        FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE,
        FOREIGN KEY (ejemplar_id) REFERENCES ejemplares(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS multas (
        id TEXT PRIMARY KEY,
        estudiante_id TEXT NOT NULL,
        historial_id TEXT NOT NULL,
        fecha_devolucion_esperada TEXT NOT NULL,
        fecha_devolucion_real TEXT NOT NULL,
        dias_retraso INTEGER NOT NULL,
        valor INTEGER NOT NULL,
        FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE,
        FOREIGN KEY (historial_id) REFERENCES prestamos(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS solicitudes (
        estudiante_id TEXT NOT NULL,
        prestamo_id TEXT NOT NULL,
        PRIMARY KEY (estudiante_id, prestamo_id),
        FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE,
        FOREIGN KEY (prestamo_id) REFERENCES prestamos(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS devoluciones (
        id TEXT PRIMARY KEY,
        prestamo_id TEXT NOT NULL,
        fecha_devolucion TEXT NOT NULL,
        multa_id TEXT,
        FOREIGN KEY (prestamo_id) REFERENCES prestamos(id) ON DELETE CASCADE,
        FOREIGN KEY (multa_id) REFERENCES multas(id) ON DELETE SET NULL
      );
    `);
  }

  public reset(): void {
    const clear = this.db.transaction(() => {
      this.db.prepare("DELETE FROM devoluciones").run();
      this.db.prepare("DELETE FROM solicitudes").run();
      this.db.prepare("DELETE FROM multas").run();
      this.db.prepare("DELETE FROM prestamos").run();
      this.db.prepare("DELETE FROM ejemplares").run();
      this.db.prepare("DELETE FROM estudiantes").run();
      this.db.prepare("DELETE FROM libros").run();
    });

    clear();
  }

  public hasLibro(id: string): boolean {
    return this.db.prepare("SELECT 1 FROM libros WHERE id = ?").get(id) !== undefined;
  }

  public insertLibro(libro: Libro): void {
    this.db.prepare(
      `INSERT INTO libros (id, titulo, autor, ubicacion_sala, tipo)
       VALUES (?, ?, ?, ?, ?)`
    ).run(libro.id, libro.titulo, libro.autor, libro.ubicacionSala, libro.tipo);
  }

  public listLibros(): Libro[] {
    return this.db.prepare(
      "SELECT id, titulo, autor, ubicacion_sala AS ubicacionSala, tipo FROM libros ORDER BY id"
    ).all() as Libro[];
  }

  public getLibro(id: string): Libro | undefined {
    return this.db.prepare(
      "SELECT id, titulo, autor, ubicacion_sala AS ubicacionSala, tipo FROM libros WHERE id = ?"
    ).get(id) as Libro | undefined;
  }

  public deleteLibro(id: string): void {
    this.db.prepare("DELETE FROM libros WHERE id = ?").run(id);
  }

  public hasEjemplar(id: string): boolean {
    return this.db.prepare("SELECT 1 FROM ejemplares WHERE id = ?").get(id) !== undefined;
  }

  public getEjemplar(id: string): Ejemplar | undefined {
    return this.db.prepare(
      "SELECT id, id_libro AS idLibro FROM ejemplares WHERE id = ?"
    ).get(id) as Ejemplar | undefined;
  }

  public insertEjemplar(ejemplar: Ejemplar): void {
    this.db.prepare("INSERT INTO ejemplares (id, id_libro) VALUES (?, ?)").run(ejemplar.id, ejemplar.idLibro);
  }

  public listEjemplares(): Ejemplar[] {
    return this.db.prepare(
      "SELECT id, id_libro AS idLibro FROM ejemplares ORDER BY id"
    ).all() as Ejemplar[];
  }

  public listEjemplaresByLibro(idLibro: string): Ejemplar[] {
    return this.db.prepare(
      "SELECT id, id_libro AS idLibro FROM ejemplares WHERE id_libro = ? ORDER BY id"
    ).all(idLibro) as Ejemplar[];
  }

  public deleteEjemplaresByLibro(idLibro: string): void {
    this.db.prepare("DELETE FROM ejemplares WHERE id_libro = ?").run(idLibro);
  }

  public hasEstudiante(id: string): boolean {
    return this.db.prepare("SELECT 1 FROM estudiantes WHERE id = ?").get(id) !== undefined;
  }

  public insertEstudiante(estudiante: Estudiante): void {
    try {
      console.log("[SQLite] insertEstudiante recibió:", estudiante);
      this.db.prepare(
        `INSERT INTO estudiantes (id, prog_academico, semestre, tipo)
         VALUES (?, ?, ?, ?)`
      ).run(estudiante.id, estudiante.progAcademico, estudiante.semestre, estudiante.tipo);
      console.log("[SQLite] insertEstudiante exitoso para id:", estudiante.id);
    } catch (error) {
      console.error("[SQLite] insertEstudiante error:", error);
      throw error;
    }
  }

  public listEstudiantes(): Estudiante[] {
    return this.db.prepare(
      "SELECT id, prog_academico AS progAcademico, semestre, tipo FROM estudiantes ORDER BY id"
    ).all() as Estudiante[];
  }

  public getEstudiante(id: string): Estudiante | undefined {
    return this.db.prepare(
      "SELECT id, prog_academico AS progAcademico, semestre, tipo FROM estudiantes WHERE id = ?"
    ).get(id) as Estudiante | undefined;
  }

  public updateEstudiante(estudiante: Estudiante): void {
    this.db.prepare(
      `UPDATE estudiantes
       SET prog_academico = ?,
           semestre = ?,
           tipo = ?
       WHERE id = ?`
    ).run(estudiante.progAcademico, estudiante.semestre, estudiante.tipo, estudiante.id);
  }

  public deleteEstudiante(id: string): void {
    this.db.prepare("DELETE FROM estudiantes WHERE id = ?").run(id);
  }

  public hasPrestamo(id: string): boolean {
    return this.db.prepare("SELECT 1 FROM prestamos WHERE id = ?").get(id) !== undefined;
  }

  public insertPrestamo(prestamo: Prestamo): void {
    this.db.prepare(
      `INSERT INTO prestamos (
        id,
        estudiante_id,
        ejemplar_id,
        fecha_prestamo,
        fecha_devolucion_esperada,
        fecha_devolucion_real,
        estado
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(prestamo.id, prestamo.estudianteId, prestamo.ejemplarId, prestamo.fechaPrestamo, prestamo.fechaDevolucionEsperada, prestamo.fechaDevolucionReal, prestamo.estado);
  }

  public listPrestamos(): Prestamo[] {
    return this.db.prepare(
      `SELECT
        id,
        estudiante_id AS estudianteId,
        ejemplar_id AS ejemplarId,
        fecha_prestamo AS fechaPrestamo,
        fecha_devolucion_esperada AS fechaDevolucionEsperada,
        fecha_devolucion_real AS fechaDevolucionReal,
        estado
       FROM prestamos
       ORDER BY id`
    ).all() as Prestamo[];
  }

  public getPrestamo(id: string): Prestamo | undefined {
    return this.db.prepare(
      `SELECT
        id,
        estudiante_id AS estudianteId,
        ejemplar_id AS ejemplarId,
        fecha_prestamo AS fechaPrestamo,
        fecha_devolucion_esperada AS fechaDevolucionEsperada,
        fecha_devolucion_real AS fechaDevolucionReal,
        estado
       FROM prestamos
       WHERE id = ?`
    ).get(id) as Prestamo | undefined;
  }

  public updatePrestamo(prestamo: Prestamo): void {
    this.db.prepare(
      `UPDATE prestamos
       SET estudiante_id = ?,
           ejemplar_id = ?,
           fecha_prestamo = ?,
           fecha_devolucion_esperada = ?,
           fecha_devolucion_real = ?,
           estado = ?
       WHERE id = ?`
    ).run(prestamo.estudianteId, prestamo.ejemplarId, prestamo.fechaPrestamo, prestamo.fechaDevolucionEsperada, prestamo.fechaDevolucionReal, prestamo.estado, prestamo.id);
  }

  public deletePrestamo(id: string): void {
    this.db.prepare("DELETE FROM prestamos WHERE id = ?").run(id);
  }

  public hasPendingFineByEstudiante(estudianteId: string): boolean {
    return this.db.prepare("SELECT 1 FROM multas WHERE estudiante_id = ? LIMIT 1").get(estudianteId) !== undefined;
  }

  public insertMulta(multa: Multa): void {
    this.db.prepare(
      `INSERT INTO multas (
        id,
        estudiante_id,
        historial_id,
        fecha_devolucion_esperada,
        fecha_devolucion_real,
        dias_retraso,
        valor
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(multa.id, multa.estudianteId, multa.historialId, multa.fechaDevolucionEsperada, multa.fechaDevolucionReal, multa.diasRetraso, multa.valor);
  }

  public hasSolicitudByPair(estudianteId: string, prestamoId: string): boolean {
    return this.db.prepare(
      "SELECT 1 FROM solicitudes WHERE estudiante_id = ? AND prestamo_id = ?"
    ).get(estudianteId, prestamoId) !== undefined;
  }

  public hasSolicitudBlockingRenovacion(prestamoId: string, estudianteId: string): boolean {
    return this.db.prepare(
      "SELECT 1 FROM solicitudes WHERE prestamo_id = ? AND estudiante_id <> ? LIMIT 1"
    ).get(prestamoId, estudianteId) !== undefined;
  }

  public insertSolicitud(solicitud: Solicitud): void {
    this.db.prepare("INSERT INTO solicitudes (estudiante_id, prestamo_id) VALUES (?, ?)").run(
      solicitud.estudianteId,
      solicitud.prestamoId
    );
  }

  public listSolicitudes(): Solicitud[] {
    return this.db.prepare(
      "SELECT estudiante_id AS estudianteId, prestamo_id AS prestamoId FROM solicitudes ORDER BY estudiante_id, prestamo_id"
    ).all() as Solicitud[];
  }

  public hasDevolucion(id: string): boolean {
    return this.db.prepare("SELECT 1 FROM devoluciones WHERE id = ?").get(id) !== undefined;
  }

  public insertDevolucion(devolucion: Devolucion): void {
    this.db.prepare(
      `INSERT INTO devoluciones (id, prestamo_id, fecha_devolucion, multa_id)
       VALUES (?, ?, ?, ?)`
    ).run(devolucion.id, devolucion.prestamoId, devolucion.fechaDevolucion, devolucion.multaId);
  }

  public getDevolucion(id: string): Devolucion | undefined {
    return this.db.prepare(
      "SELECT id, prestamo_id AS prestamoId, fecha_devolucion AS fechaDevolucion, multa_id AS multaId FROM devoluciones WHERE id = ?"
    ).get(id) as Devolucion | undefined;
  }
}

export const store = new SqliteStore();