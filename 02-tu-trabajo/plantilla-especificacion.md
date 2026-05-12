# Especificación Formal — Sistema de Préstamo de Libros

> **Autor:** [Tu nombre]
> **Fecha:** [Fecha del taller]
> **Versión:** 1.0
> **Brief de origen:** Correo de Diana Restrepo, Coordinadora de Biblioteca

> Lo que está entre corchetes `[...]` es lo que tú debes escribir.

---

## 1. Propósito del sistema

[Describe en 3-5 líneas qué hace el sistema, en tus propias palabras. No copies el correo. Reformúlalo como técnico.]

---

## 2. Alcance

**Incluido en esta versión:**

- [Lista lo que sí está cubierto, bullet a bullet]

**Explícitamente fuera del alcance:**

- [Lista lo que el correo menciona pero NO se va a implementar. Por ejemplo: el caso de los profesores investigadores.]

---

## 3. Modelo de datos

### Entidad: Libro

| Campo     | Tipo     | Obligatorio | Descripción   |
| `[campo]` | `[tipo]` | sí/no       | [descripción] |

### Entidad: Ejemplar

[Repite la tabla. Cada libro puede tener varios ejemplares. Decide tú la estructura.]

### Entidad: Estudiante

[Tabla de campos]

### Entidad: Préstamo

[Tabla de campos. Aquí va estudiante_id, ejemplar_id, fecha_prestamo, fecha_devolucion_esperada, fecha_devolucion_real, estado, etc.]

### Entidad: Multa

[Tabla de campos]

### Diagrama de relaciones

```
[Dibuja con texto las relaciones. Por ejemplo:

Libro 1 --- N Ejemplar
Estudiante 1 --- N Prestamo
Ejemplar 1 --- N Prestamo (a lo largo del tiempo)
Prestamo 0..1 --- 1 Multa
]
```

---

## 4. Endpoints REST

| Método | Ruta | Propósito | Body / Query | Respuesta éxito | Códigos error posibles |
|---|---|---|---|---|---|
| `GET` | `/libros` | Listar catálogo | filtros opcionales | `200` con lista | - |
| `GET` | `/libros/:id` | Detalle libro | - | `200` con objeto | `404` |
| `POST` | `/libros` | Crear libro | `{id, título, autor, Ubicacion_sala, tipo}` | `201` con libro | `400`, `409` |
| `DELETE` | `/libros/:id` | Eliminar libro | - | `200` con mensaje de éxito | `404` |
| `POST` | `/ejemplares` | Crear ejemplar | `{id, idLibro}` | `201` con ejemplar | `400`, `404`, `409` |
| `GET` | `/ejemplares/libro/:id_libro` | Listar ejemplares de un libro | filtros opcionales | `200` con lista | - |
| `POST`| `/estudiantes` | Crear estudiante | `{id, nombre, correo, tipo,carrera, semestre}` | `201` con estudiante | `400`, `409` |
| `GET` | `/estudiantes` | Listar estudiantes | filtros opcionales | `200` con lista | - |
| `GET` | `/estudiantes/:id` | Detalle estudiante | - | `200` con objeto | `404` |
| `PUT` | `/estudiantes/:id` | Actualizar estudiante | `{correo, tipo}` | `200` con estudiante actualizado | `400`, `404` |
| `DELETE` | `/estudiantes/:id` | Eliminar estudiante | - | `200` con mensaje de éxito | `404` |
| `POST` | `/prestamos` | Crear préstamo | `{id, estudiante_id, ejemplar_id, fecha_prestamo, estado, fecha_devolucion_esperada, fecha_devolucion_real}` | `201` con préstamo | `400`, `404`, `409` |
| `GET`| `/prestamos` | Listar préstamos | filtros opcionales | `200` con lista | - |
| `GET` | `/prestamos/:id` | Detalle préstamo | - | `200` con objeto | `404` |
| `GET` | `/prestamos/estudiante/:id_estudiante` | Listar préstamos de un estudiante | - | `200` con lista | `404` |
| `PUT` | `/prestamos/:id` | Renovar préstamo | `{fecha_devolucion_nueva}` | `200` con préstamo actualizado | `400`, `404` |
| `DELETE` | `/prestamos/:id` | Eliminar préstamo | - | `200` con mensaje de éxito | `404` |
| `POST` | `/devoluciones` | Registrar devolución | `{id, préstamo_id, fecha_devolucion}` | `200` con multa calculada si aplica | `400`, `404` |
|`GET`| `/devoluciones/:id` | Detalle devolución | - | `200` con objeto | `404` |

[Llena la tabla con todos los endpoints que necesitas. Mínimo 8.]

---

## 5. Reglas de negocio

### RN1 — Límite de préstamos por tipo de estudiante

- **Trigger:** al recibir `POST /prestamos`.
- **Condición:**
  - Estudiante de pregrado: máximo 3 préstamos con `estado = "activo"`.
  - Estudiante de posgrado: máximo 5 préstamos con `estado = "activo"`.
- **Acción si cumple:** continuar con el flujo de creación.
- **Acción si no cumple:** retornar `409 Conflict` con `{error: "limite_prestamos_alcanzado", limite: N, actuales: M}`.

### RN2 — [Tiempo de préstamo según tipo de libro]

- **Trigger:** [al recibir `POST /prestamos` o `PUT /prestamos/:id` para renovación].
- **Condición:** [si el libro es de alta demanda, entonces el plazo es 3 días; si no es de alta demanda, el plazo es 15 días].
- **Acción si cumple:** [calcular fecha_devolucion_esperada en base a la fecha_prestamo o fecha_devolucion_nueva].
- **Acción si no cumple:** [retornar `400 Bad Request` con `{error: "tipo_libro_desconocido"}`].

### RN3 — [Prestamos vencidos bloquean nuevos préstamos]

- **Trigger:** [al recibir `POST /prestamos`].
- **Condición:** [si el estudiante tiene al menos un préstamo con `estado = "vencido"` o una multa pendiente sin pagar].
- **Acción si cumple:** [no permitir nuevo préstamo, retornar `409 Conflict` con `{error: "prestamo vencidos o multas pendientes"}`].
- **Acción si no cumple:** [continuar con el flujo de creación].

### RN4 — [Renovación solo si no hay solicitudes pendientes ]

- **Trigger:** [al recibir `PUT /prestamos/:id`].
- **Condición:** [si el préstamo es de un libro que tiene solicitudes pendientes por otros estudiantes, no se puede renovar].
- **Acción si cumple:** [no permitir renovación, retornar `409 Conflict` con `{error: "renovacion no permitida solicitudes pendientes"}`].
- **Acción si no cumple:** [continuar con el flujo de actualización].



---

## 6. Decisiones tomadas (lo que el correo no dice)

### D1 — Cálculo de días para multa

- **Contexto:** el correo no precisa si los días de retraso son calendario o hábiles.
- **Decisión:** usar días calendario.
- **Justificación:** es la interpretación más simple y se alinea con lo que la mayoría de bibliotecas hacen.

### D2 — [Decisión que tomaste]

- **Contexto:** [qué hueco había]
- **Decisión:** [qué decidiste]
- **Justificación:** [por qué esta decisión y no otra]

### D3 — [Decisión que tomaste]

- **Contexto:** [qué hueco había]
- **Decisión:** [qué decidiste]
- **Justificación:** [por qué esta decisión y no otra]

### D4 — [Decisión que tomaste]

- **Contexto:** [qué hueco había]
- **Decisión:** [qué decidiste]
- **Justificación:** [por qué esta decisión y no otra]

### D5 — [Decisión que tomaste]

- **Contexto:** [qué hueco había]
- **Decisión:** [qué decidiste]
- **Justificación:** [por qué esta decisión y no otra]

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

---

## 8. Restricciones técnicas

- **Stack:** [Node.js + Express]
- **Persistencia:** datos en memoria. No usar base de datos.
- **TypeScript** (según tu stack) .
- **Sin autenticación** en esta versión.
- **Sin frontend** en esta versión. Solo API REST.