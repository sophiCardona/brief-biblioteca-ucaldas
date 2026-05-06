# Especificación Formal — Sistema de Préstamo de Libros

> **Autor:** Mauricio y Sophia
> **Fecha:** 5 de mayo de 2026
> **Versión:** 1.0
> **Brief de origen:** Correo de Diana Restrepo, Coordinadora de Biblioteca

> Lo que está entre corchetes `[...]` es lo que tú debes escribir.

---

## 1. Propósito del sistema

El sistema gestiona el préstamo de libros a estudiantes de la universidad. Debe seguir unas reglas de negocio o condiciones que
deben tenerse en cuenta para llevar un registro consistente de los libros que salen y entran de la biblioteca. 

## 2. Alcance

**Incluido en esta versión:**

- [Lista lo que sí está cubierto, bullet a bullet]

**Explícitamente fuera del alcance:**

Se mencionan profesores de investigacion que tambien solicitan el préstamo de libros, pero este no será implemnetado. 

## 3. Modelo de datos

### Entidad: Libro

| Campo         | Tipo         | Obligatorio | Descripción   |
| id            | string       | si          | Cada libro tiene un código único de inventario
| titulo        | string       | si          | titulo del libro
| autor         | string       | si          | autor del libro
| ubciacionSala | string       | si          | sala en la que se encuentra el libro 
| tipo          | string       | si          | para saber si el libro es de requerimiento normal o de alta demanda 


### Entidad: Ejemplar

[Repite la tabla. Cada libro puede tener varios ejemplares. Decide tú la estructura.]

| Campo         | Tipo         | Obligatorio | Descripción   |
| id            | string       | si          | Cada ejemplar tiene un código único de inventario
| idLibro       | string       | si          | id del libro al que es ejemplar 


### Entidad: Estudiante

| Campo         | Tipo         | Obligatorio | Descripción   |
| id            | string       | si          | Cada estudiante tiene un código único
| progAcademico | string       | si          | programa academico al que pertenece el estudiante
| semestre      | int          | si          | semestre al que pertence el estudiante


### Entidad: Préstamo

[Tabla de campos. Aquí va estudiante_id, ejemplar_id, fecha_prestamo, fecha_devolucion_esperada, fecha_devolucion_real, estado, etc.]

| Campo                      | Tipo         | Obligatorio | Descripción   |
| prestamo_id                | string       | si          | cada prestamo tiene un id 
| estudiante_id              | string       | si          | debe permitir a traves del id conocer que estudiante presto el libro
| ejemplar_id                | string       | si          | debe permitir a traves del id conocer que libro prestó el estudiante
| fecha_prestamo             | dateTime          | si          | fecha que se realizó el prestamo
| fecha_devolucion_esperada      | dateTime          | si          | fecha de devolucion que se esperaba 
| fecha_devolucion_real      | dateTime          | si          | fecha real que el estudiante devolvió el libro
| estado      | int          | boolean           | para saber si esta activo el préstamo o ya pasó



### Entidad: Multa

| Campo                     | Tipo         | Obligatorio | Descripción   |
| id                        | string       | si          | Cada multa tiene un código único
| estudiante_id             | string       | si          | id del estudiante al que pertence la multa
| historial_id              | string       | si          | la multa debe agregarse al hitorial del estudiante, identificandose por un id 
| fecha_devolucion_esperada | dateTime     | si          | fecha de devolucion que se esperaba 
| fecha_devolucion_real     | dateTime     | si          | fecha real que el estudiante devolvió el libro
| dias_retraso              | int          | si          | dias que debe pagar el estudiante por la no devolucion del libro 
| valor                     | int          | si          | valor total que debe pagar el estudiante 

### Entidad: Solicitud

| Campo         | Tipo         | Obligatorio | Descripción   |
| estudiante_id            | string       | si          | estudiante que ha realizado la solicitud
| prestamo_id                | string       | si          | prestamo al que hace referencia esta solicitud 



### Diagrama de relaciones

Libro      1 --- N Ejemplar
Estudiante 1 --- N Prestamo
Ejemplar   1 --- N Prestamo (a lo largo del tiempo)
Prestamo   0..1 --- 1 Multa
Estudiante 1 --- 1 historial


## 4. Endpoints REST

| Método | Ruta | Propósito | Body / Query | Respuesta éxito | Códigos error posibles |
|---|---|---|---|---|---|
| `GET` | `/libros` | Listar catálogo | filtros opcionales | `200` con lista | - |
| `GET` | `/libros/:id` | Detalle libro | - | `200` con objeto | `404` |
| `POST` | `/prestamos` | Crear préstamo | `{estudiante_id, ejemplar_id}` | `201` con préstamo | `400`, `404`, `409` |
| ... | ... | ... | ... | ... | ... |

[Llena la tabla con todos los endpoints que necesitas. Mínimo 8.]

---

## 5. Reglas de negocio

### RN1 — [nombre corto de la regla]

- **Trigger:** [cuándo se evalúa]
- **Condición:** [qué se valida exactamente, en términos precisos]
- **Acción si cumple:** [qué hace el sistema]
- **Acción si no cumple:** [código HTTP, mensaje, qué retorna]

**Ejemplo:**

### RN1 — Límite de préstamos por tipo de estudiante

- **Trigger:** al recibir `POST /prestamos`.
- **Condición:**
  - Estudiante de pregrado: máximo 3 préstamos con `estado = "activo"`.
  - Estudiante de posgrado: máximo 5 préstamos con `estado = "activo"`.
- **Acción si cumple:** continuar con el flujo de creación.
- **Acción si no cumple:** retornar `409 Conflict` con `{error: "limite_prestamos_alcanzado", limite: N, actuales: M}`.

[Llena RN2, RN3, RN4... hasta cubrir todas las reglas del correo.]

### RN2 — [...]

[...]

### RN3 — [...]

[...]


---

## 6. Decisiones tomadas (lo que el correo no dice)

### D1 — [Decisión que tomaste]

- **Contexto:** [qué hueco había]
- **Decisión:** [qué decidiste]
- **Justificación:** [por qué esta decisión y no otra]

**Ejemplo:**

### D1 — Cálculo de días para multa

- **Contexto:** el correo no precisa si los días de retraso son calendario o hábiles.
- **Decisión:** usar días calendario.
- **Justificación:** es la interpretación más simple y se alinea con lo que la mayoría de bibliotecas hacen.

[Mínimo 5 decisiones documentadas.]

### D2, D3, D4, D5...


## 7. Códigos HTTP usados

| Código | Significado | Cuándo se usa |

| 200 | OK | GET exitosos |
| 201 | Created | POST exitosos que crean recursos |
| 400 | Bad Request | Body malformado o validación fallida |
| 404 | Not Found | Recurso no existe |
| 409 | Conflict | Reglas de negocio violadas (límite alcanzado, duplicado, etc.) |
| 500 | Internal Server Error | Error no controlado del servidor |


---

## 8. Restricciones técnicas

- **Stack:** Node.js + Express
- **Persistencia:** datos en memoria. No usar base de datos.
- **TypeScript** 
- **Sin autenticación** en esta versión.
- **Sin frontend** en esta versión. Solo API REST.

