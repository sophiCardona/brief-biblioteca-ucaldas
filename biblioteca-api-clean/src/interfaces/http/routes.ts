import { Router, Request, Response, NextFunction } from "express";
import { LibraryService } from "../../core/services/libraryService";
import { store } from "../../infrastructure/sqlite/store";

const router = Router();
const service = new LibraryService(store);

const asyncHandler =
  (fn: (req: Request, res: Response) => unknown) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res)).catch(next);
  };

router.get("/libros", asyncHandler((_, res) => {
  res.status(200).json(service.listLibros());
}));

router.get("/libros/:id", asyncHandler((req, res) => {
  res.status(200).json(service.getLibro(req.params.id));
}));

router.post("/libros", asyncHandler((req, res) => {
  res.status(201).json(service.createLibro(req.body));
}));

router.delete("/libros/:id", asyncHandler((req, res) => {
  res.status(200).json(service.deleteLibro(req.params.id));
}));

router.post("/ejemplares", asyncHandler((req, res) => {
  res.status(201).json(service.createEjemplar(req.body));
}));

router.get("/ejemplares", asyncHandler((_, res) => {
  res.status(200).json(service.listEjemplares());
}));

router.get("/ejemplares/libro/:id_libro", asyncHandler((req, res) => {
  res.status(200).json(service.listEjemplaresByLibro(req.params.id_libro));
}));

router.post("/estudiantes", asyncHandler((req, res) => {
  res.status(201).json(service.createEstudiante(req.body));
}));

router.get("/estudiantes", asyncHandler((_, res) => {
  res.status(200).json(service.listEstudiantes());
}));

router.get("/estudiantes/:id", asyncHandler((req, res) => {
  res.status(200).json(service.getEstudiante(req.params.id));
}));

router.put("/estudiantes/:id", asyncHandler((req, res) => {
  res.status(200).json(service.updateEstudiante(req.params.id, req.body));
}));

router.delete("/estudiantes/:id", asyncHandler((req, res) => {
  res.status(200).json(service.deleteEstudiante(req.params.id));
}));

router.post("/prestamos", asyncHandler((req, res) => {
  res.status(201).json(service.createPrestamo(req.body));
}));

router.get("/prestamos", asyncHandler((_, res) => {
  res.status(200).json(service.listPrestamos());
}));

router.get("/prestamos/:id", asyncHandler((req, res) => {
  res.status(200).json(service.getPrestamo(req.params.id));
}));

router.get("/prestamos/estudiante/:id_estudiante", asyncHandler((req, res) => {
  res.status(200).json(service.listPrestamosByEstudiante(req.params.id_estudiante));
}));

router.put("/prestamos/:id", asyncHandler((req, res) => {
  res.status(200).json(service.renovarPrestamo(req.params.id, req.body));
}));

router.delete("/prestamos/:id", asyncHandler((req, res) => {
  res.status(200).json(service.deletePrestamo(req.params.id));
}));

router.post("/devoluciones", asyncHandler((req, res) => {
  res.status(200).json(service.registrarDevolucion(req.body));
}));

router.get("/devoluciones/:id", asyncHandler((req, res) => {
  res.status(200).json(service.getDevolucion(req.params.id));
}));

router.post("/solicitudes", asyncHandler((req, res) => {
  res.status(201).json(service.createSolicitud(req.body));
}));

router.get("/solicitudes", asyncHandler((_, res) => {
  res.status(200).json(service.listSolicitudes());
}));

// Endpoint de diagnóstico
router.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", message: "API funcionando", timestamp: new Date().toISOString() });
});

export { router, store, service };
