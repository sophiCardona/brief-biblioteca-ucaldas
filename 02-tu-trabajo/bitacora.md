
# Bitácora del Taller — Sophia Cardona - Mauricio Gonzáles


## Sección 1 — Hallazgos de la auditoría humana (Etapa 3)

### Inventario inicial

- **Archivos generados por la IA:**

Version 1
- `package.json`
- `src/index.js`
- `README.md`

Version 2
- Raíz: `package.json`, `tsconfig.json`, `.gitignore`, `.env`
- `src/core/`: `entities.ts`, `errors.ts`, `services/libraryService.ts`
- `src/infrastructure/`: `sqlite/store.ts`
- `src/interfaces/http/`: `app.ts`, `routes.ts`
- `src/server.ts`
- `tests/integration/api.test.ts`
- `jest.config.ts`

- **Dependencias instaladas:**

Version 1
- `express@4.18.2`
- `sqlite3@^6.0.1`

Version 2
- `better-sqlite3@^12.10.0`
- `dotenv@^16.4.5`
- `express@^4.19.2`
- `jest@^29.7.0`
- `supertest@^7.0.0`
- `ts-jest@^29.2.4`
- `ts-node@^10.9.2`
- `ts-node-dev@^2.0.0`
- `typescript@^5.5.4`
- `@types/better-sqlite3`, `@types/express`, `@types/jest`, `@types/node`, `@types/supertest`

- **Dependencias que NO pediste pero la IA agregó:**
  - `ts-node` (documentado en el prompt de generación de la versión 2)

- **Archivos que NO pediste pero la IA generó:**
  - `src/infrastructure/memory/store.ts` (artefacto de la migración; no se usa en el flujo actual)
  - `LoanState` como tipo exportado no usado (documentado en el prompt #2)

### Mapeo de reglas a código

Versión 1 

| Regla | Archivo y línea aproximada | ¿Aplica correctamente? | Notas |
|---|---|---|---|
| RN1 — Límite de préstamos por tipo de estudiante | index.js:71 | No | No realiza esta validación, unicamente si existe el libro, el prestador o si hay copias disponibles |
| RN2 — Tiempo de préstamo según tipo de libro | index.js:71 | No | No udita cuanto tiempo lleva el estudiante con el lirbo, ni tampoco cuantos dias puede estar con este de acuerdo al tipo de libro|
| RN3 — Prestamos vencidos bloquean nuevos préstamos | index.js:71  | No | No valida si el estudiante tiene al menos un préstamo con estado = "vencido" o una multa pendiente sin pagar |
| RN4 — Renovación solo si no hay solicitudes pendientes | index.js:106 | No | No se maneja un tipo de solicitudes pendientes simplemente si va a devolver el libro o si quiere renovarlo, se aumentan las copias o puede quedar se con el libro el tiempo que quiera, pues no valida limites de tiempo |

Version 2

| Regla | Archivo y línea aproximada | ¿Aplica correctamente? | Notas |
|---|---|---|---|
| RN1 — Límite de préstamos por tipo de estudiante | libraryService.ts:234 | Sí | hce verificacion de si el estudiante es de pregrado o posgrado y valida cuantos préstamos tiene |
| RN2 — Tiempo de préstamo según tipo de libro | libraryService.ts:271 | Sí | Valida si el llibro es de alta demanda, tiene un plazo de 3 dias, sino, el plazo es de 15 días |
| RN3 — Prestamos vencidos bloquean nuevos préstamos | libraryService.ts:250 | Sí | Valida si elestudiante tiene prestamos vencidos o multas |
| RN4 — Renovación solo si no hay solicitudes pendientes | libraryService.ts:310 | Sí | Valida si el libro tiene solicitudes pendientes, sino, presta el libro y actualiza fechas |

### Hallazgos detectados

#### Hallazgo H1

- **Archivo:** `biblioteca-api/src/index.js`
- **Tipo:** omisión estructural
- **Severidad:** alta
- **Regla violada:** RN1-RN8
- **Descripción:** la versión 1 mezcla rutas, lógica de negocio y acceso a datos en un solo archivo y no implementa la mayor parte de las reglas de negocio exigidas por el taller.
- **Cómo lo detecté:** lectura humana + comparación con `01-contexto/taller-analisis-v1-v2.md`
- **Reproducción:** revisar `src/index.js` y contrastarlo con las reglas RN1-RN8.

#### Hallazgo H2

- **Archivo:** `biblioteca-api/README.md`
- **Tipo:** documentación incompleta
- **Severidad:** alta
- **Regla violada:** ninguna específica
- **Descripción:** la documentación de v1 solo expone `/books`, `/loans` y `/returns/:loanId`; además marca `/api/estudiantes` y `/api/libros` como pendientes, por lo que no describe la API objetivo del taller.
- **Cómo lo detecté:** lectura humana
- **Reproducción:** leer el README de v1 y comparar con la especificación de la bitácora.

#### Hallazgo H3

- **Archivo:** `biblioteca-api-clean/src/infrastructure/memory/store.ts`
- **Tipo:** código huérfano / residuo de migración
- **Severidad:** media
- **Regla violada:** ninguna específica
- **Descripción:** el store en memoria sigue presente aunque el flujo actual usa `src/infrastructure/sqlite/store.ts`; no tiene referencias funcionales en el proyecto.
- **Cómo lo detecté:** búsqueda de referencias en el workspace
- **Reproducción:** buscar usos de `InMemoryStore` o `memory/store.ts`; no hay referencias funcionales fuera del archivo y del árbol documental.

#### Hallazgo H4

- **Archivo:** `biblioteca-api-clean/src/core/services/libraryService.ts`
- **Tipo:** bug funcional
- **Severidad:** alta
- **Regla violada:** RN6
- **Descripción:** `renovarPrestamo()` acepta `fecha_devolucion_nueva` del cliente y no recalcula el nuevo vencimiento con base en el tipo de libro; la renovación queda controlada por el payload, no por la regla de negocio.
- **Cómo lo detecté:** lectura humana del servicio
- **Reproducción:** llamar `PUT /prestamos/:id` con cualquier `fecha_devolucion_nueva` válida; el servicio asigna esa fecha sin recalcular el plazo.

#### Hallazgo H5

- **Archivo:** `biblioteca-api-clean/README.md`
- **Tipo:** desalineación documentación-código
- **Severidad:** media
- **Regla violada:** ninguna específica
- **Descripción:** el README documenta RN1-RN4, pero el código y los tests también implementan RN5-RN8.
- **Cómo lo detecté:** comparación entre README, `libraryService.ts` y `tests/integration/api.test.ts`
- **Reproducción:** comparar la lista de reglas del README con la suite de tests y el servicio.

---

## Sección 2 — Resultados de los tests (Etapa 4)

### Primera ejecución

- **Tests totales:** 5
- **Pasaron:** 5
- **Fallaron:** 0

### Evidencia documentada

- `01-contexto/taller-analisis-v1-v2.md` indica: `1.997 segundos (1997 ms) para toda la suite (5 tests). Todos los tests pasaron.`
- La suite de integración documentada en `biblioteca-api-clean/tests/integration/api.test.ts` cubre RN1, RN2, RN3, RN4 y devolución con multa.

### Análisis de los fallos

| Test | Tipo de fallo | ¿Bug del código o test mal escrito? | Acción tomada |
|---|---|---|---|
| Sin fallos | Sin fallos | Sin fallos | No aplica: la documentación indica que la suite documentada pasó completa. |

### Última ejecución (post-correcciones)

- **Tests totales:** 5
- **Pasaron:** 5
- **Fallaron:** 0

### Resultado final documentado

- Tiempo total: `1.997 s`
- Estado: suite verde

### Tests rojos declarados (bugs no corregidos por tiempo)

- No se documentan tests rojos en los archivos provistos.

---

## Sección 3 — Bugs corregidos (Etapa 5)

### Bug B1

- **Hallazgo asociado:** NO hay hallazgo asociado
- **Descripción del bug:** advertencia/error de `tsconfig.json` por `moduleResolution`.
- **Test que lo reveló:** `npm run build`
- **Corrección aplicada:** se dejó `moduleResolution` en `Node` y se agregó `ignoreDeprecations: "5.0"`.
- **Tipo de corrección:** por IA con prompt acotado
- **Resultado:** `npm run build` exitoso sin errores.

### Bug B2

- **Hallazgo asociado:** Hallazgo H3
- **Descripción del bug:** persistencia inicial en memoria/array hardcodeado en la versión 2.
- **Test que lo reveló:** `npx tsc --noEmit` y `npm test`
- **Corrección aplicada:** migración a SQLite local en `biblioteca-api-clean/src/infrastructure/sqlite/store.ts` y actualización de servicio/rutas/documentación.
- **Tipo de corrección:** mixta
- **Resultado:** validación documentada como correcta.

---

## Sección 4 — Aprendizajes (mínimo 3)

### Aprendizaje A1
La precisión del prompt inicial sí condicionó la calidad del código, pero no eliminó la necesidad de revisar detalles de compilación y tipado. El caso de `LoanState` y la advertencia de `tsconfig.json` muestran que la IA puede entregar una base correcta y aun así requerir correcciones manuales.

### Aprendizaje A2
Un prompt corto pero concreto sobre migrar a SQLite produjo una estructura más profesional de lo esperado: separación por capas, store dedicado y dependencias apropiadas. La IA infirió bastante bien la arquitectura cuando el objetivo estaba claro.

### Aprendizaje A3
La suite de `Jest + Supertest` dejó una evidencia mucho más verificable que la versión v1, porque el estado final del taller quedó cuantificado: 5 pruebas y 1.997 s. Eso hace más fácil justificar la calidad técnica frente a una revisión manual.

---

## Sección 5 — Decisiones de prompt (autorreflexión)

Sí. El flujo obligó a reescribir y afinar prompts: el primer prompt de generación dejó un detalle de configuración en `tsconfig.json`, así que fue necesario un prompt puntual de corrección. Eso confirma que un prompt inicial bueno no sustituye la validación posterior.

El prompt de migración a SQLite funcionó mejor porque estaba acotado a un objetivo técnico específico; en cambio, los prompts más abiertos tendieron a producir salidas correctas pero con detalles que luego hubo que ajustar a mano.

También quedó claro que la IA responde mejor cuando se le fija el stack y la intención arquitectónica, pero no conviene asumir que la respuesta está cerrada hasta correr `build` y `test`. En este taller, la revisión humana siguió siendo obligatoria.

## Chatbot Ollama — Registro

### Modelo usado
- Nombre: qwen2.5-coder:7b 
- RAM consumida aproximada: 10 GB

### Sesión 1 — Datos base
- Pregunta que hice:
  - `1#: Crea los datos de prueba base para todas las reglas: un estudiante pregrado EST-PRE-01, uno posgrado EST-POS-01, un libro normal LIB-001 con 6 ejemplares y un libro de alta demanda LIB-002 con 1 ejemplarcrea los datos de prueba base para todas las reglas: un estudiante pregrado EST-PRE-01, uno posgrado EST-POS-01, un libro normal LIB-001 con 6 ejemplares y un libro de alta demanda LIB-002 con 1 ejemplar`
- Qué generó el chatbot:
  - `1# Primero, necesitamos crear el estudiante pregrado y uno de postgrado.`
 
  ### Datos de Prueba:

  1. **Estudiante Pregrado**
    - ID: `EST-PRE-01`
    - Nombre: Juan Pérez
    - Tipo de Estudiante: Pregrado

  2. **Estudiante Posgrado**
    - ID: `EST-POS-01`
    - Nombre: Ana Rodríguez
    - Tipo de Estudiante: Posgrado

  3. **Libro Normal**
    - ID: `LIB-001`
    - Título: "Introducción a la Programación"
    - Autor: John Doe
    - Tipo: Libro normal

  4. **Libro de Alta Demanda**
    - ID: `LIB-002`
    - Título: "Teoría de los Juegos"
    - Autor: John Nash
    - Tipo: Libro de alta demanda


### Creación de Estudiantes y Libros:

**Crear Estudiante Pregrado:**

```bash
curl -X POST http://localhost:3001/estudiantes \
-H "Content-Type: application/json" \
-d '{
  "id": "EST-PRE-01",
  "nombre": "Juan Pérez",
  "tipoEstudiante": "Pregrado"
}'
```

**Crear Estudiante Posgrado:**

```bash
curl -X POST http://localhost:3001/estudiantes \
-H "Content-Type: application/json" \
-d '{
  "id": "EST-POS-01",
  "nombre": "Ana Rodríguez",
  "tipoEstudiante": "Posgrado"
}'
```

**Crear Libro Normal (LIB-001):**

```bash
curl -X POST http://localhost:3001/libros \
-H "Content-Type: application/json" \
-d '{
  "id": "LIB-001",
  "titulo": "Introducción a la Programación",
  "autor": "John Doe",
  "tipo": "Normal"
}'
```

**Crear Libro de Alta Demanda (LIB-002):**

```bash
curl -X POST http://localhost:3001/libros \
-H "Content-Type: application/json" \
-d '{
  "id": "LIB-002",
  "titulo": "Teoría de los Juegos",
  "autor": "John Nash",
  "tipo": "AltaDemanda"
}'
```

**Crear Ejemplares para LIB-001 (6 ejemplares):**

```bash
for i in {1..6}; do
  curl -X POST http://localhost:3001/ejemplares \
  -H "Content-Type: application/json" \
  -d '{
    "id": "EJ-001-'$i'",
    "libroId": "LIB-001",
    "disponible": true
  }'
done
```

**Crear Ejemplar para LIB-002 (1 ejemplar):**

```bash
curl -X POST http://localhost:3001/ejemplares \
-H "Content-Type: application/json" \
-d '{
  "id": "EJ-002",
  "libroId": "LIB-002",
  "disponible": true
}'
```

**Verificar Datos de Prueba Creados:**

- Listar estudiantes: `GET /estudiantes`
- Listar libros y ejemplares: `GET /libros` y `GET /ejemplares/libro/:id_libro`

Estos datos de prueba te permitirán probar todas las reglas que mencionaste.|

- ¿Fue útil?
  - `1# No, porque el chatbot no tiene contexto de como es la estructura de las entidades a las que les esta haciendo curl, lo que ocaciona que los endpoints no sean correctos, y por lo tanto no pueda crear los datos de prueba.`

### Sesión 2 — RN1
- Pregunta que hice:
  - `2# genera la prueba RN1 completa: crear los 3 préstamos válidos para pregrado y luego intentar el cuarto`
- Qué generó el chatbot:
  - `2# Chatbot: ### Prueba de RN1 (Un estudiante de pregrado no puede tener más de 3 préstamos activos)`
  - `Primero, necesitamos crear tres préstamos válidos para el estudiante EST-PRE-01 con libros disponibles y luego intentar crear un cuarto préstamo.`

#### 1. Crear el primer préstamo:

```bash
curl -X POST http://localhost:3001/prestamos \
-H "Content-Type: application/json" \
-d '{
  "estudianteId": "EST-PRE-01",
  "ejemplarId": "EJ-001-1"
}'
```

**Esperado:** Código HTTP `201 Created`.

#### 2. Crear el segundo préstamo:

```bash
curl -X POST http://localhost:3001/prestamos \
-H "Content-Type: application/json" \
-d '{
  "estudianteId": "EST-PRE-01",
  "ejemplarId": "EJ-001-2"
}'
```

**Esperado:** Código HTTP `201 Created`.

#### 3. Crear el tercer préstamo:

```bash
curl -X POST http://localhost:3001/prestamos \
-H "Content-Type: application/json" \
-d '{
  "estudianteId": "EST-PRE-01",
  "ejemplarId": "EJ-001-3"
}'
```

**Esperado:** Código HTTP `201 Created`.

#### 4. Intentar crear el cuarto préstamo:

```bash
curl -X POST http://localhost:3001/prestamos \
-H "Content-Type: application/json" \
-d '{
  "estudianteId": "EST-PRE-01",
  "ejemplarId": "EJ-002"
}'
```

**Esperado:** Código HTTP `409 Conflict`.

### EJECUTAR:

```bash
curl -X POST http://localhost:3001/prestamos \
-H "Content-Type: application/json" \
-d '{
  "estudianteId": "EST-PRE-01",
  "ejemplarId": "EJ-002"
}'
```
  - `Si el estudiante EST-PRE-01 intenta crear un cuarto préstamo, debería recibir un error 409 Conflict porque ha alcanzado su límite de préstamos activos (3)`
- ¿Fue útil?
  - `2# No, porque el chatbot no tiene contexto de como es la estructura de las entidades a las que les esta haciendo curl, lo que ocaciona que los endpoints no sean correctos, y por lo tanto no pueda crear los datos de prueba.`

### Sesión 3 — RN2
- Pregunta que hice:
  - `3# ahora haz lo mismo para RN2 con el estudiante de posgrado, recuerda que su límite es 5`
- Qué generó el chatbot:
  - `3# Chatbot: Claro, aquí tienes una prueba completa de la regla RN2, que establece que un estudiante de posgrado no puede tener más de 5 préstamos activos:`
  - `### Prueba RN2: Crear los 5 préstamos válidos para el estudiante de posgrado y luego intentar el sexto`

#### Paso 1: Crear un préstamo válido para el estudiante de posgrado
```sh
EJECUTAR:
curl -X POST http://localhost:3001/prestamos -H "Content-Type: application/json" -d '{"id":"PRES-005","estudiante_id":"EST-POS-01","ejemplar_id":"EJ-007","fecha_prestamo":"2026-05-24T00:00:00.000Z"}'
```

#### Paso 2: Crear un segundo préstamo válido para el estudiante de posgrado
```sh
EJECUTAR:
curl -X POST http://localhost:3001/prestamos -H "Content-Type: application/json" -d '{"id":"PRES-006","estudiante_id":"EST-POS-01","ejemplar_id":"EJ-008","fecha_prestamo":"2026-05-25T00:00:00.000Z"}'
```

#### Paso 3: Crear un tercer préstamo válido para el estudiante de posgrado
```sh
EJECUTAR:
curl -X POST http://localhost:3001/prestamos -H "Content-Type: application/json" -d '{"id":"PRES-007","estudiante_id":"EST-POS-01","ejemplar_id":"EJ-009","fecha_prestamo":"2026-05-26T00:00:00.000Z"}'
```

#### Paso 4: Crear un cuarto préstamo válido para el estudiante de posgrado
```sh
EJECUTAR:
curl -X POST http://localhost:3001/prestamos -H "Content-Type: application/json" -d '{"id":"PRES-008","estudiante_id":"EST-POS-01","ejemplar_id":"EJ-010","fecha_prestamo":"2026-05-27T00:00:00.000Z"}'
```

#### Paso 5: Crear un quinto préstamo válido para el estudiante de posgrado
```sh
EJECUTAR:
curl -X POST http://localhost:3001/prestamos -H "Content-Type: application/json" -d '{"id":"PRES-009","estudiante_id":"EST-POS-01","ejemplar_id":"EJ-011","fecha_prestamo":"2026-05-28T00:00:00.000Z"}'
```

#### Paso 6: Intentar crear el sexto préstamo (debería fallar con conflict)
```sh
EJECUTAR:
curl -X POST http://localhost:3001/prestamos -H "Content-Type: application/json" -d '{"id":"PRES-010","estudiante_id":"EST-POS-01","ejemplar_id":"EJ-012","fecha_prestamo":"2026-05-29T00:00:00.000Z"}'

```
  - `#### Resultado esperado:`
  - `El último comando (Paso 6) debe devolver un error 409 Conflict indicando que el estudiante de posgrado ya tiene 5 préstamos activos y no puede tomar más.`
  - `Este proceso te permite verificar que la regla RN2 está funcionando correctamente.`
- ¿Fue útil?
  - `3# Si, pero tuvo unos pequeños detalles que tuve que corregir, por que el chatbot ya que invento ejemplares que no existen, pero el resto de la estructura del curl esta bien, por lo que solo tuve que corregir el id del ejemplar, pero el resto de la estructura del curl esta bien.`

### Sesión 4 — RN5
- Pregunta que hice:
  - `4# prueba que un ejemplar ya prestado no se puede prestar de nuevo (RN5)`
- Qué generó el chatbot:
  - `4# Chatbot: Claro, aquí tienes una prueba completa de la regla RN5, que establece que un ejemplar que ya está prestado no puede prestarse de nuevo:`
  - `### Prueba RN5: Intentar prestar un ejemplar que ya está prestado`
  
#### Paso 1: Crear un préstamo válido para el ejemplar
```sh
EJECUTAR:
curl -X POST http://localhost:3001/prestamos -H "Content-Type: application/json" -d '{"id":"PRES-011","estudiante_id":"EST-PRE-01","ejemplar_id":"EJ-007","fecha_prestamo":"2026-05-30T00:00:00.000Z"}'
```

#### Paso 2: Intentar crear un nuevo préstamo con el mismo ejemplar (debería fallar)
```sh
EJECUTAR:
curl -X POST http://localhost:3001/prestamos -H "Content-Type: application/json" -d '{"id":"PRES-012","estudiante_id":"EST-PRE-02","ejemplar_id":"EJ-007","fecha_prestamo":"2026-05-31T00:00:00.000Z"}'
```

  - `#### Resultado esperado:`
  - `El último comando (Paso 2) debe devolver un error 409 Conflict indicando que el ejemplar ya está prestado y no puede ser prestado de nuevo.`
  - `Este proceso te permite verificar que la regla RN5 está funcionando correctamente.`
- ¿Fue útil?
  - `4# SI, Funciono pero medio otra vez datos imaginarios, pero el resto de la estructura del curl esta bien, por lo que solo tuve que corregir el id del estudiante, pero el resto de la estructura del curl esta bien.`

### Sesión 5 — RN6
- Pregunta que hice:
  - `5# prueba que el plazo del préstamo es correcto para un libro normal versus uno de alta demanda (RN6)`
- Qué generó el chatbot:
  - `5# Chatbot: Claro, aquí tienes una prueba completa para verificar que el plazo del préstamo es correcto para un libro normal y uno de alta demanda:`
  - `### Prueba RN6: Verificar los plazos de préstamo`

#### Paso 1: Crear un préstamo con un libro normal
```sh
EJECUTAR:
curl -X POST http://localhost:3001/prestamos -H "Content-Type: application/json" -d '{"id":"PRES-013","estudiante_id":"EST-PRE-02","ejemplar_id":"EJ-008","fecha_prestamo":"2026-05-30T00:00:00.000Z"}'
```

#### Paso 2: Crear un préstamo con un libro de alta demanda
```sh
EJECUTAR:
curl -X POST http://localhost:3001/prestamos -H "Content-Type: application/json" -d '{"id":"PRES-014","estudiante_id":"EST-PRE-02","ejemplar_id":"EJ-013","fecha_prestamo":"2026-05-30T00:00:00.000Z"}'
```

  - `#### Resultado esperado:`
  - `El primer comando (Paso 1) debe devolver un id de préstamo con una fecha de vencimiento que sea el día 15 de mayo de 2026.`
  - `El segundo comando (Paso 2) debe devolver un id de préstamo con una fecha de vencimiento que sea el día 3 de junio de 2026.`
  - `Este proceso te permite verificar que la regla RN6 está funcionando correctamente.`
- ¿Fue útil?
  - `5# SI, Funcionó pero medio otra vez datos imaginarios, pero el resto de la estructura del curl esta bien, por lo que solo tuve que corregir el id del estudiante y el id del ejemplar, pero el resto de la estructura del curl esta bien.`

### Sesión 6 — Validaciones
- Pregunta que hice:
  - `6# genera pruebas de entradas inválidas: body vacío, estudiante inexistente y ejemplar inexistente`
- Qué generó el chatbot:
  - `6# Chatbot: Claro, aquí tienes pruebas para probar las entradas inválidas como cuerpo vacío, estudiante inexistente y ejemplar inexistente:`

### Prueba de entrada inválida: Cuerpo vacío
```sh
EJECUTAR:
curl -X POST http://localhost:3001/prestamos -H "Content-Type: application/json" -d '{}'
```

#### Resultado esperado:
Debería devolver un error `400 Bad Request` indicando que el cuerpo de la solicitud no es válido.

### Prueba de entrada inválida: Estudiante inexistente
```sh
EJECUTAR:
curl -X POST http://localhost:3001/prestamos -H "Content-Type: application/json" -d '{"id":"PRES-015","estudiante_id":"EST-PRE-99","ejemplar_id":"EJ-014","fecha_prestamo":"2026-06-01T00:00:00.000Z"}'
```

#### Resultado esperado:
Debería devolver un error `404 Not Found` indicando que el estudiante no existe.

### Prueba de entrada inválida: Ejemplar inexistente
```sh
EJECUTAR:
curl -X POST http://localhost:3001/prestamos -H "Content-Type: application/json" -d '{"id":"PRES-016","estudiante_id":"EST-PRE-02","ejemplar_id":"EJ-99","fecha_prestamo":"2026-06-01T00:00:00.000Z"}'
```
  - `#### Resultado esperado:`
  - `Estas pruebas te ayudan a verificar que la API maneja correctamente las entradas inválidas y devuelve los errores apropiados.`
- ¿Fue útil?
  - `6# SI, Funcionó  sin ningun defecto, el resultado del body vacío fue { "error": "..." } con código 400, lo cual es correcto según la especificación, ya que el cuerpo de la solicitud no es válido.`

### Sesión 7 — Análisis de un fallo
- Pregunta que hice:
  - `7# el resultado del body vacío fue { "error": "..." } con código 400. ¿Eso es correcto según la especificación?`
- Qué generó el chatbot:
  - `7# Chatbot: Si el resultado de un cuerpo vacío es { "error": "..." } con un código 400, entonces eso está dentro de lo esperado según la convención de errores HTTP. El código 400 indica que la solicitud tiene problemas con la sintaxis y no puede ser procesada por el servidor.`
  - `Aquí tienes una tabla para resumir los códigos de estado y sus significados:`
  - `| Código | Descripción                               |`
  - `|--------|-------------------------------------------|`
  - `| 400    | Solicitud incorrecta (Bad Request)        |`
  - `| 404    | Recurso no encontrado (Not Found)         |`
  - `Para una solicitud con un cuerpo vacío, el servidor puede devolver un error más específico en el cuerpo de la respuesta para proporcionar información adicional sobre lo que falló.`
  - `Aunque el formato exacto del mensaje de error ({ "error": "..." }) es flexible y depende de cómo esté configurado el servidor, lo importante es que:`
  - `- El código de estado sea 400 (Bad Request).`
  - `- El cuerpo contenga un mensaje de error descriptivo.`
  - `Dicho esto, si la API tiene una especificación detallada sobre cómo manejar los errores, asegúrate de que esta convención se esté siguiendo y ajusta el ejemplo según sea necesario.`
- ¿Fue útil?
  - `7# No, no dio mas imfomacion util sobre el error, solo dio un mensaje generico, lo cual no es ideal para la depuración, pero al menos el código de estado 400 es correcto para indicar que la solicitud es incorrecta.`

### Limitaciones observadas
- ¿El chatbot inventó endpoints que no existen?
  - `NO, pero si inventó la estructura de los datos que se le deben enviar a los endpoints, lo que hace que no pueda crear los datos de prueba.`
- ¿Confundió reglas entre sí?
  - `NO, las reglas las tiene claras`
- ¿Tuvo que corregirle algo?
  - `SI, la estructura de los datos que se le deben enviar a los endpoints, por esos añadi pruebas al chat para que entendiera como es la estructura de los datos.`

### Comparación: chatbot local vs ChatGPT/Claude en la nube
- ¿Qué diferencias notaste en la calidad de las respuestas?
  - El chatbot local fue suficiente para proponer pruebas y comandos, pero tendió a inventar IDs, ejemplares y estructuras de datos que no coincidían con la API real. Una IA en la nube suele responder con más coherencia y menos desvíos de contexto, aunque igual requiere validación manual.
- ¿Qué ventajas tiene correrlo localmente?
  - Permite probar sin enviar el código ni los datos a servicios externos, trabajar sin depender de internet y ajustar el prompt con rapidez. También deja repetir las pruebas con el mismo contexto local y sin costo por uso de API.