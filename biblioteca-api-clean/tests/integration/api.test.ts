import request from "supertest";
import { app } from "../../src/interfaces/http/app";
import { store } from "../../src/interfaces/http/routes";

describe("API Biblioteca", () => {
  beforeEach(() => {
    store.reset();
  });

  it("test_RN1_estudiante_pregrado_no_puede_tener_4_prestamos_activos", async () => {
    await request(app).post("/libros").send({
      id: "L1",
      titulo: "Libro",
      autor: "Autor",
      ubicacion_sala: "Sala A",
      tipo: "normal"
    });

    await request(app).post("/estudiantes").send({
      id: "E1",
      progAcademico: "Ing Sistemas",
      semestre: 4,
      tipo: "pregrado"
    });

    for (let i = 1; i <= 4; i += 1) {
      await request(app).post("/ejemplares").send({ id: `EJ${i}`, idLibro: "L1" });
    }

    for (let i = 1; i <= 3; i += 1) {
      const response = await request(app).post("/prestamos").send({
        id: `P${i}`,
        estudiante_id: "E1",
        ejemplar_id: `EJ${i}`,
        fecha_prestamo: "2026-05-12T10:00:00.000Z"
      });
      expect(response.status).toBe(201);
    }

    const fourth = await request(app).post("/prestamos").send({
      id: "P4",
      estudiante_id: "E1",
      ejemplar_id: "EJ4",
      fecha_prestamo: "2026-05-12T10:00:00.000Z"
    });

    expect(fourth.status).toBe(409);
    expect(fourth.body.error).toBe("limite_prestamos_alcanzado");
  });

  it("test_RN2_libro_alta_demanda_tiene_plazo_3_dias", async () => {
    await request(app).post("/libros").send({
      id: "L2",
      titulo: "Alta demanda",
      autor: "Autor",
      ubicacion_sala: "Sala B",
      tipo: "alta_demanda"
    });
    await request(app).post("/ejemplares").send({ id: "EJ5", idLibro: "L2" });
    await request(app).post("/estudiantes").send({
      id: "E2",
      progAcademico: "Derecho",
      semestre: 2,
      tipo: "pregrado"
    });

    const response = await request(app).post("/prestamos").send({
      id: "P10",
      estudiante_id: "E2",
      ejemplar_id: "EJ5",
      fecha_prestamo: "2026-05-12T00:00:00.000Z"
    });

    expect(response.status).toBe(201);
    expect(new Date(response.body.fechaDevolucionEsperada).toISOString()).toBe("2026-05-15T00:00:00.000Z");
  });

  it("test_RN3_estudiante_con_prestamo_vencido_no_puede_crear_nuevo_prestamo", async () => {
    await request(app).post("/libros").send({
      id: "L3",
      titulo: "Normal",
      autor: "Autor",
      ubicacion_sala: "Sala C",
      tipo: "normal"
    });

    await request(app).post("/estudiantes").send({
      id: "E3",
      progAcademico: "Medicina",
      semestre: 6,
      tipo: "posgrado"
    });

    await request(app).post("/ejemplares").send({ id: "EJ6", idLibro: "L3" });
    await request(app).post("/ejemplares").send({ id: "EJ7", idLibro: "L3" });

    const oldLoan = await request(app).post("/prestamos").send({
      id: "P20",
      estudiante_id: "E3",
      ejemplar_id: "EJ6",
      fecha_prestamo: "2026-01-01T00:00:00.000Z"
    });
    expect(oldLoan.status).toBe(201);

    const blocked = await request(app).post("/prestamos").send({
      id: "P21",
      estudiante_id: "E3",
      ejemplar_id: "EJ7",
      fecha_prestamo: "2026-05-12T00:00:00.000Z"
    });

    expect(blocked.status).toBe(409);
    expect(blocked.body.error).toBe("prestamo_vencidos_o_multas_pendientes");
  });

  it("test_RN4_renovacion_bloqueada_por_solicitudes_pendientes", async () => {
    await request(app).post("/libros").send({
      id: "L4",
      titulo: "Libro 4",
      autor: "Autor",
      ubicacion_sala: "Sala D",
      tipo: "normal"
    });

    await request(app).post("/estudiantes").send({
      id: "E4",
      progAcademico: "Arquitectura",
      semestre: 7,
      tipo: "pregrado"
    });

    await request(app).post("/estudiantes").send({
      id: "E5",
      progAcademico: "Historia",
      semestre: 3,
      tipo: "pregrado"
    });

    await request(app).post("/ejemplares").send({ id: "EJ8", idLibro: "L4" });

    const loan = await request(app).post("/prestamos").send({
      id: "P30",
      estudiante_id: "E4",
      ejemplar_id: "EJ8",
      fecha_prestamo: "2026-05-12T00:00:00.000Z"
    });
    expect(loan.status).toBe(201);

    const reqResponse = await request(app).post("/solicitudes").send({
      estudiante_id: "E5",
      prestamo_id: "P30"
    });
    expect(reqResponse.status).toBe(201);

    const renew = await request(app).put("/prestamos/P30").send({
      fecha_devolucion_nueva: "2026-05-25T00:00:00.000Z"
    });

    expect(renew.status).toBe(409);
    expect(renew.body.error).toBe("renovacion_no_permitida_solicitudes_pendientes");
  });

  it("test_devolucion_con_retraso_genera_multa_de_2000_por_dia", async () => {
    await request(app).post("/libros").send({
      id: "L5",
      titulo: "Libro 5",
      autor: "Autor",
      ubicacion_sala: "Sala E",
      tipo: "alta_demanda"
    });

    await request(app).post("/estudiantes").send({
      id: "E6",
      progAcademico: "Matematicas",
      semestre: 5,
      tipo: "pregrado"
    });

    await request(app).post("/ejemplares").send({ id: "EJ9", idLibro: "L5" });

    const loan = await request(app).post("/prestamos").send({
      id: "P40",
      estudiante_id: "E6",
      ejemplar_id: "EJ9",
      fecha_prestamo: "2026-05-01T00:00:00.000Z"
    });
    expect(loan.status).toBe(201);

    const devolucion = await request(app).post("/devoluciones").send({
      id: "D1",
      prestamo_id: "P40",
      fecha_devolucion: "2026-05-06T00:00:00.000Z"
    });

    expect(devolucion.status).toBe(200);
    expect(devolucion.body.multa).not.toBeNull();
    expect(devolucion.body.multa.diasRetraso).toBe(2);
    expect(devolucion.body.multa.valor).toBe(4000);
  });
});
