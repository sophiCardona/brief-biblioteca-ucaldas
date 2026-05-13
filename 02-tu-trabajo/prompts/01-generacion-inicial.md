# 02-tu-trabajo/prompts/01-generacion-inicial.md

# Registro de Prompts — Prompt #1

**Fecha y hora:** 2026-05-12 [Sin hora exacta registrada]

**Propósito en una línea:** Generar una API REST mínima en Node.js con endpoints para gestionar préstamos de libros usando Express y datos en memoria.

**Etapa del taller:** 1

**IA usada:** GitHub Copilot (Claude Haiku 4.5)

---

### Prompt enviado (literal)

Construye una API REST en Node.js para gestionar prestamos de libros en una biblioteca universitaria nesesito endpoints para listar libros, crear prestamos devolver libros y consultar prestamos vigentes. Usa Express, datos en memoria

---

### Resumen de la respuesta de la IA

La IA creó 3 archivos: package.json (con Express como dependencia), src/index.js (servidor Express con 6 endpoints principales), y README.md (con instrucciones de instalación y ejemplos curl). Los endpoints implementados fueron: GET /books, GET /books/:id, POST /loans, POST /returns/:loanId, GET /loans/active y GET /loans. Usó un modelo de datos simple en memoria con arrays para libros y préstamos. No instaló dependencias adicionales fuera de lo solicitado.
---

### Mi evaluación

**¿La respuesta cumplió con lo que pedí?**

[x] Parcialmente Falto[ No se hizo distinciones en el apartado estudiantes ni otras 4 entidades necesarias ] demas de que no es escalable

**¿La acepté tal cual o la modifiqué?**

- [x] Tal cual.

**¿Qué aprendí de esta interacción?**

>LA IA Sin contexto su trabajo es superficial y poco util ademas de incompleta no la modifique para mostrar las deficiencias de esta forma de vide code.  

