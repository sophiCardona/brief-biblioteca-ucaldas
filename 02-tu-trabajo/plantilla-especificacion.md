# Especificación Formal — Sistema de Préstamo de Libros

> **Autor:** Mauricio Gonzáles- Sophia Cardona 
> **Fecha:** 5 de mayo de 2026
> **Versión:** 1.0
> **Brief de origen:** Correo de Diana Restrepo, Coordinadora de Biblioteca

---

## 1. Propósito del sistema

El sistema gestiona el préstamo de libros a estudiantes de la universidad. Debe seguir unas reglas de negocio o condiciones que
deben tenerse en cuenta para llevar un registro consistente de los libros que salen y entran de la biblioteca. 
El sistema gestiona el préstamo de libros a estudiantes de la universidad. Debe seguir unas reglas de negocio o condiciones que
deben tenerse en cuenta para llevar un registro consistente de los libros que salen y entran de la biblioteca. 

## 2. Alcance

**Incluido en esta versión:**

- [Lista lo que sí está cubierto, bullet a bullet]

**Explícitamente fuera del alcance:**

Se mencionan profesores de investigacion que tambien solicitan el préstamo de libros, pero este no será implemnetado. 
Se mencionan profesores de investigacion que tambien solicitan el préstamo de libros, pero este no será implemnetado. 

## 3. Modelo de datos

### Entidad: Libro

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| id | string | sí | Código único de inventario del libro |
| titulo | string | sí | Título del libro |
| autor | string | sí | Autor del libro |
| ubicacionSala | string | sí | Sala en la que se encuentra el libro |
| tipo | string | sí | Tipo de libro: "normal" o "altaDemanda" |

### Entidad: Ejemplar

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| id | string | sí | Código único de inventario del ejemplar |
| idLibro | string | sí | ID del libro al que pertenece este ejemplar |
| estado | string | sí | Estado: "disponible", "prestado", "dañado" |

### Entidad: Estudiante

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| id | string | sí | Código único del estudiante |
| nombre | string | sí | Nombre completo del estudiante |
| correo | string | sí | Correo institucional del estudiante |
| programaAcademico | string | sí | Programa académico del estudiante |
| semestre | int | sí | Semestre actual del estudiante |
| tipo | string | sí | Tipo: "pregrado" o "posgrado" |

### Entidad: Préstamo

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| id | string | sí | Código único del préstamo |
| estudianteId | string | sí | ID del estudiante que realiza el préstamo |
| ejemplarId | string | sí | ID del ejemplar prestado |
| fechaPrestamo | dateTime | sí | Fecha en que se realizó el préstamo |
| fechaDevolucionEsperada | dateTime | sí | Fecha esperada de devolución |
| fechaDevolucionReal | dateTime | no | Fecha real de devolución (null si aún no devuelve) |
| estado | string | sí | Estado: "activo", "devuelto", "vencido" |

### Entidad: Multa

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| id | string | sí | Código único de la multa |
| estudianteId | string | sí | ID del estudiante con multa |
| prestamoId | string | sí | ID del préstamo asociado |
| fechaDevolucionEsperada | dateTime | sí | Fecha de devolución esperada |
| fechaDevolucionReal | dateTime | sí | Fecha real de devolución |
| diasRetraso | int | sí | Número de días de retraso |
| valor | decimal | sí | Valor en pesos de la multa |
| estado | string | sí | Estado: "pendiente", "pagada" |

### Entidad: Solicitud

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| id | string | sí | Código único de la solicitud |
| estudianteId | string | sí | ID del estudiante que solicita |
| ejemplarId | string | sí | ID del ejemplar solicitado |
| fechaSolicitud | dateTime | sí | Fecha de la solicitud |
| estado | string | sí | Estado: "pendiente", "completada", "cancelada" | 



### Diagrama de relaciones

Libro      1 --- N Ejemplar
Libro      1 --- N Ejemplar
Estudiante 1 --- N Prestamo
Ejemplar   1 --- N Prestamo (a lo largo del tiempo)
Prestamo   0..1 --- 1 Multa
Estudiante 1 --- 1 historial

Ejemplar   1 --- N Prestamo (a lo largo del tiempo)
Prestamo   0..1 --- 1 Multa
Estudiante 1 --- 1 historial


## 4. Endpoints REST

| Método | Ruta | Propósito | Body / Query | Respuesta éxito | Códigos error posibles |
|---|---|---|---|---|---|
| GET | /libros | Listar catálogo | filtros opcionales | 200 con lista | - |
| GET | /libros/:id | Detalle libro | - | 200 con objeto | 404 |
| POST | /libros | Crear libro | {id, título, autor, Ubicacion_sala, tipo} | 201 con libro | 400, 409 |
| DELETE | /libros/:id | Eliminar libro | - | 200 con mensaje de éxito | 404 |
| POST | /ejemplares | Crear ejemplar | {id, idLibro} | 201 con ejemplar | 400, 404, 409 |
| GET | /ejemplares/libro/:id_libro | Listar ejemplares de un libro | filtros opcionales | 200 con lista | - |
| POST| /estudiantes | Crear estudiante | {id, nombre, correo, tipo,carrera, semestre} | 201 con estudiante | 400, 409 |
| GET | /estudiantes | Listar estudiantes | filtros opcionales | 200 con lista | - |
| GET | /estudiantes/:id | Detalle estudiante | - | 200 con objeto | 404 |
| PUT | /estudiantes/:id | Actualizar estudiante | {correo, tipo} | 200 con estudiante actualizado | 400, 404 |
| DELETE | /estudiantes/:id | Eliminar estudiante | - | 200 con mensaje de éxito | 404 |
| POST | /prestamos | Crear préstamo | {id, estudiante_id, ejemplar_id, fecha_prestamo, estado, fecha_devolucion_esperada, fecha_devolucion_real} | 201 con préstamo | 400, 404, 409 |
| GET| /prestamos | Listar préstamos | filtros opcionales | 200 con lista | - |
| GET | /prestamos/:id | Detalle préstamo | - | 200 con objeto | 404 |
| GET | /prestamos/estudiante/:id_estudiante | Listar préstamos de un estudiante | - | 200 con lista | 404 |
| PUT | /prestamos/:id | Renovar préstamo | {fecha_devolucion_nueva} | 200 con préstamo actualizado | 400, 404 |
| DELETE | /prestamos/:id | Eliminar préstamo | - | 200 con mensaje de éxito | 404 |
| POST | /devoluciones | Registrar devolución | {id, préstamo_id, fecha_devolucion} | 200 con multa calculada si aplica | 400, 404 |
|GET| /devoluciones/:id | Detalle devolución | - | 200 con objeto | 404 |
| GET | /libros | Listar catálogo | filtros opcionales | 200 con lista | - |
| GET | /libros/:id | Detalle libro | - | 200 con objeto | 404 |
| POST | /libros | Crear libro | {id, título, autor, Ubicacion_sala, tipo} | 201 con libro | 400, 409 |
| DELETE | /libros/:id | Eliminar libro | - | 200 con mensaje de éxito | 404 |
| POST | /ejemplares | Crear ejemplar | {id, idLibro} | 201 con ejemplar | 400, 404, 409 |
| GET | /ejemplares/libro/:id_libro | Listar ejemplares de un libro | filtros opcionales | 200 con lista | - |
| POST| /estudiantes | Crear estudiante | {id, nombre, correo, tipo,carrera, semestre} | 201 con estudiante | 400, 409 |
| GET | /estudiantes | Listar estudiantes | filtros opcionales | 200 con lista | - |
| GET | /estudiantes/:id | Detalle estudiante | - | 200 con objeto | 404 |
| PUT | /estudiantes/:id | Actualizar estudiante | {correo, tipo} | 200 con estudiante actualizado | 400, 404 |
| DELETE | /estudiantes/:id | Eliminar estudiante | - | 200 con mensaje de éxito | 404 |
| POST | /prestamos | Crear préstamo | {id, estudiante_id, ejemplar_id, fecha_prestamo, estado, fecha_devolucion_esperada, fecha_devolucion_real} | 201 con préstamo | 400, 404, 409 |
| GET| /prestamos | Listar préstamos | filtros opcionales | 200 con lista | - |
| GET | /prestamos/:id | Detalle préstamo | - | 200 con objeto | 404 |
| GET | /prestamos/estudiante/:id_estudiante | Listar préstamos de un estudiante | - | 200 con lista | 404 |
| PUT | /prestamos/:id | Renovar préstamo | {fecha_devolucion_nueva} | 200 con préstamo actualizado | 400, 404 |
| DELETE | /prestamos/:id | Eliminar préstamo | - | 200 con mensaje de éxito | 404 |
| POST | /devoluciones | Registrar devolución | {id, préstamo_id, fecha_devolucion} | 200 con multa calculada si aplica | 400, 404 |
|GET| /devoluciones/:id | Detalle devolución | - | 200 con objeto | 404 |

[Llena la tabla con todos los endpoints que necesitas. Mínimo 8.]

---

## 5. Reglas de negocio

### RN1 — Límite de préstamos por tipo de estudiante

- *Trigger:* al recibir POST /prestamos.
- *Condición:*
  - Estudiante de pregrado: máximo 3 préstamos con estado = "activo".
  - Estudiante de posgrado: máximo 5 préstamos con estado = "activo".
- *Acción si cumple:* continuar con el flujo de creación.
- *Acción si no cumple:* retornar 409 Conflict con {error: "limite_prestamos_alcanzado", limite: N, actuales: M}.
- *Trigger:* al recibir POST /prestamos.
- *Condición:*
  - Estudiante de pregrado: máximo 3 préstamos con estado = "activo".
  - Estudiante de posgrado: máximo 5 préstamos con estado = "activo".
- *Acción si cumple:* continuar con el flujo de creación.
- *Acción si no cumple:* retornar 409 Conflict con {error: "limite_prestamos_alcanzado", limite: N, actuales: M}.

### RN2 — [Tiempo de préstamo según tipo de libro]

- *Trigger:* [al recibir POST /prestamos o PUT /prestamos/:id para renovación].
- *Condición:* [si el libro es de alta demanda, entonces el plazo es 3 días; si no es de alta demanda, el plazo es 15 días].
- *Acción si cumple:* [calcular fecha_devolucion_esperada en base a la fecha_prestamo o fecha_devolucion_nueva].
- *Acción si no cumple:* [retornar 400 Bad Request con {error: "tipo_libro_desconocido"}].
- *Trigger:* [al recibir POST /prestamos o PUT /prestamos/:id para renovación].
- *Condición:* [si el libro es de alta demanda, entonces el plazo es 3 días; si no es de alta demanda, el plazo es 15 días].
- *Acción si cumple:* [calcular fecha_devolucion_esperada en base a la fecha_prestamo o fecha_devolucion_nueva].
- *Acción si no cumple:* [retornar 400 Bad Request con {error: "tipo_libro_desconocido"}].

### RN3 — [Prestamos vencidos bloquean nuevos préstamos]

- *Trigger:* [al recibir POST /prestamos].
- *Condición:* [si el estudiante tiene al menos un préstamo con estado = "vencido" o una multa pendiente sin pagar].
- *Acción si cumple:* [no permitir nuevo préstamo, retornar 409 Conflict con {error: "prestamo vencidos o multas pendientes"}].
- *Acción si no cumple:* [continuar con el flujo de creación].
- *Trigger:* [al recibir POST /prestamos].
- *Condición:* [si el estudiante tiene al menos un préstamo con estado = "vencido" o una multa pendiente sin pagar].
- *Acción si cumple:* [no permitir nuevo préstamo, retornar 409 Conflict con {error: "prestamo vencidos o multas pendientes"}].
- *Acción si no cumple:* [continuar con el flujo de creación].

### RN4 — [Renovación solo si no hay solicitudes pendientes ]

- *Trigger:* [al recibir PUT /prestamos/:id].
- *Condición:* [si el préstamo es de un libro que tiene solicitudes pendientes por otros estudiantes, no se puede renovar].
- *Acción si cumple:* [no permitir renovación, retornar 409 Conflict con {error: "renovacion no permitida solicitudes pendientes"}].
- *Acción si no cumple:* [continuar con el flujo de actualización].
- *Trigger:* [al recibir PUT /prestamos/:id].
- *Condición:* [si el préstamo es de un libro que tiene solicitudes pendientes por otros estudiantes, no se puede renovar].
- *Acción si cumple:* [no permitir renovación, retornar 409 Conflict con {error: "renovacion no permitida solicitudes pendientes"}].
- *Acción si no cumple:* [continuar con el flujo de actualización].



---

## 6. Decisiones tomadas (lo que el correo no dice)

### D1 — Cálculo de días para multa

- *Contexto:* el correo no precisa si los días de retraso son calendario o hábiles.
- *Decisión:* usar días calendario.
- *Justificación:* es la interpretación más simple y se alinea con lo que la mayoría de bibliotecas hacen.

### D2 — [Decisión que tomaste]

- *Contexto:* [qué hueco había]
- *Decisión:* [qué decidiste]
- *Justificación:* [por qué esta decisión y no otra]

### D3 — [Decisión que tomaste]

- *Contexto:* [qué hueco había]
- *Decisión:* [qué decidiste]
- *Justificación:* [por qué esta decisión y no otra]

### D4 — [Decisión que tomaste]

- *Contexto:* [qué hueco había]
- *Decisión:* [qué decidiste]
- *Justificación:* [por qué esta decisión y no otra]

### D5 — [Decisión que tomaste]

- *Contexto:* [qué hueco había]
- *Decisión:* [qué decidiste]
- *Justificación:* [por qué esta decisión y no otra]

[Mínimo 5 decisiones documentadas.]


---

## 7. Códigos HTTP usados

| Código | Significado | Cuándo se usa |
|---|---|---|
| 200 | OK | GET exitosos |
| 201 | Created | POST exitosos que crean recursos |
| 400 | Bad Request | Body malformado o validación fallida |
| 404 | Not Found | Recurso no existe |
| 409 | Conflict | Reglas de negocio violadas (límite alcanzado, duplicado, etc.) |
| 500 | Internal Server Error | Error no controlado del servidor |

[Si usas otros, agrégalos.]
[Si usas otros, agrégalos.]
[Si usas otros, agrégalos.]


## 8. Restricciones técnicas

- **Stack:** Node.js + Express
- **Stack:** Node.js + Express
- **Persistencia:** datos en memoria. No usar base de datos.
- **TypeScript** 
- **TypeScript** 
- **Sin autenticación** en esta versión.
- **Sin frontend** en esta versión. Solo API REST.