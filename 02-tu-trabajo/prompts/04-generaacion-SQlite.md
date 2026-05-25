# /02-tu-trabajo/prompts/04-generaacion-SQlite.md

## Prompt #4

**Fecha y hora:** 2026-05-19 16:57

**Propósito en una línea:** Migrar la persistencia de la versión 2 desde el array hardcodeado a una base de datos SQLite.

**Etapa del taller:** 2

**IA usada:** Copilot

---

### Prompt enviado (literal)

```text
toma el rol de desarrolldo senior de backend y dejaras de consumir el array harcodeado existente y vas a crear una base de datos sqlite. Vas a trabajar en la carpeta de biblioteca-api-clean, que pertenece a la version 2 del proyecto

Resumen de la respuesta de la IA
Se creó una infraestructura SQLite local en src/infrastructure/sqlite/store.ts y se migró el servicio de negocio para usar esa persistencia en lugar de Map y arreglos en memoria. También se actualizó routes.ts para consumir la nueva store y se añadieron las dependencias better-sqlite3 y @types/better-sqlite3.
Además, se ajustó el README.md para documentar la persistencia SQLite y la variable BIBLIOTECA_DB_PATH.
La solución fue validada con npx tsc --noEmit y npm test, ambos con resultado correcto. ``````


### Mi evaluación

**¿La respuesta cumplió con lo que pedí?**

- [X] Completamente.
- [ ] Parcialmente. Faltó: [...]
- [ ] No, se desvió. Hizo: [...]

**¿La acepté tal cual o la modifiqué?**

- [X] Tal cual.
- [ ] La modifiqué a mano. Cambios: [...]
- [ ] Le pedí corrección con un prompt nuevo (ver prompt #[N+1]).
- [ ] La rechacé completamente. Razón: [...]

**¿Qué aprendí de esta interacción?**

El promt si era un poco corto. La IA pide que le acepte muchas indicaciones que hace y corrije errores que hizo. 

