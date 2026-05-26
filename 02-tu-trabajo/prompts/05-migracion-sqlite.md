/02-tu-trabajo/prompts/01-migracion-sqlite.md

# Plantilla — Registro de Prompts

## Prompt #1

**Fecha y hora:** 2026-05-19 14:30

**Propósito en una línea:** Migrar la API de arrays en memoria a base de datos SQLite con arquitectura de modelos.

**Etapa del taller:** 4

**IA usada:** GitHub Copilot

---

### Prompt enviado (literal)
toma el rol de desarrolldo senior en backend y dejaras de consumir el array harcodeado y vas a crear una base de datos sqlite


---

### Resumen de la respuesta de la IA

La IA creó una arquitectura completa con separación de responsabilidades:
- **3 nuevas carpetas:** `src/db/`, `src/models/`, `src/database/`
- **Archivos creados:** `connection.js` (conexión SQLite), `schema.js` (inicialización de tablas), `bookModel.js` y `loanModel.js` (operaciones CRUD)
- **Dependencia instalada:** sqlite3 (55 paquetes)
- **Decisiones no pedidas:** Promesas (async/await), seeding automático de datos iniciales, foreign keys habilitadas
- **Compatibilidad:** Mantuvo 100% compatibilidad con los endpoints anteriores

---

### Mi evaluación

**¿La respuesta cumplió con lo que pedí?**

- [x] Completamente.
- [ ] Parcialmente. Faltó: 
- [ ] No, se desvió. Hizo:

**¿La acepté tal cual o la modifiqué?**

- [x] Tal cual.
- [ ] La modifiqué a mano. Cambios:
- [ ] Le pedí corrección con un prompt nuevo (ver prompt #[N+1]).
- [ ] La rechacé completamente. Razón:

**¿Qué aprendí de esta interacción?**

Un prompt corto pero específico (mencionando "rol senior", "dejar arrays", "sqlite") genera código profesional sin especificar detalles de arquitectura. La IA dedujo automáticamente que debía separar modelos, agregar async/await y crear tablas con relaciones.

---