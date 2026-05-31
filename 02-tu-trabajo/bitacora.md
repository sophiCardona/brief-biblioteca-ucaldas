
# Bitácora del Taller — Sophia Cardona - Mauricio Gonzáles


## Sección 1 — Hallazgos de la auditoría humana (Etapa 3)

### Inventario inicial

- **Archivos generados por la IA:** 

Version1 
- package.json 
- src/index.js (servidor Express con 6 endpoints principales)
- README.md (con instrucciones de instalación y ejemplos curl)

Version2 
- Raíz:
package.json
tsconfig.json
.gitignore
.env

- src/core:
src/core/entities.ts
src/core/errors.ts
src/core/services/libraryService.ts

- src/infrastructure:
src/infrastructure/memory/store.ts

- src/interfaces/http:
src/interfaces/http/app.ts
src/interfaces/http/routes.ts

- src:
src/server.ts

- tests:
tests/api.test.ts

- Configuración de tests:
jest.config.ts

- **Dependencias instaladas:** 

Version1: 
express@4.22.2
UNMET DEPENDENCY sqlite3@^6.0.1 =>  Dependencia no satisfecha, libreria que no esta bien descargada dentro de node_modules

Version2: 
├── @types/better-sqlite3@7.6.13
├── @types/express@4.17.25
├── @types/jest@29.5.14
├── @types/node@20.19.41
├── @types/supertest@6.0.3
├── better-sqlite3@12.10.0
├── dotenv@16.6.1
├── express@4.22.2
├── jest@29.7.0
├── supertest@7.2.2
├── ts-jest@29.4.9
├── ts-node-dev@2.0.0
├── ts-node@10.9.2
└── typescript@5.9.3

- **Dependencias que NO pediste pero la IA agregó:** 

Version 2:  
-  ts-node

- **Archivos que NO pediste pero la IA generó:** 

Version 2: 

- Unused files 
src/infrastructure/memory/store.ts
src/server.ts                     
- Unused devDependencies
ts-node  package.json:39:6
- Unused exported types
LoanState  type  src/core/entities.ts:3:13

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

- **Archivo:** [archivo y línea]
- **Tipo:** [bug / omisión / decisión cuestionable / código duplicado / etc.]
- **Severidad:** [alta / media / baja]
- **Regla violada:** [RNX o "ninguna específica"]
- **Descripción:** [qué está mal y cómo se manifiesta]
- **Cómo lo detecté:** [lectura humana / IA auditora / test fallando / llamado manual]
- **Reproducción:** [pasos exactos para reproducirlo]

#### Hallazgo H2

[Repite la estructura. Mínimo 5 hallazgos para una calificación aceptable. 8+ para excelente.]

---

## Sección 2 — Resultados de los tests (Etapa 4)

### Primera ejecución

- **Tests totales:** [N]
- **Pasaron:** [N]
- **Fallaron:** [N]

### Análisis de los fallos

| Test | Tipo de fallo | ¿Bug del código o test mal escrito? | Acción tomada |
|---|---|---|---|
| `test_RN1_...` | AssertionError | Bug del código | Anotado como H6 |
| `test_RN2_...` | TypeError | Test mal escrito (campo mal nombrado) | Corregí el test |
| ... | | | |

### Última ejecución (post-correcciones)

- **Tests totales:** [N]
- **Pasaron:** [N]
- **Fallaron:** [N — si quedó alguno, declarar abajo]

### Tests rojos declarados (bugs no corregidos por tiempo)

- [Lista de bugs que documentaste pero no alcanzaste a corregir, con justificación]

---

## Sección 3 — Bugs corregidos (Etapa 5)

### Bug B1

- **Hallazgo asociado:** H1 (de la sección 1)
- **Descripción del bug:** [...]
- **Test que lo reveló:** [nombre del test]
- **Corrección aplicada:** [resumen de la corrección]
- **Tipo de corrección:** [por mí a mano / por IA con prompt acotado / mixta]
- **Resultado:** test ahora pasa. Sin regresiones.

### Bug B2

[Repite]

---

## Sección 4 — Aprendizajes (mínimo 3)

### Aprendizaje A1

[Una observación honesta de algo que descubriste hoy. No respondas lo políticamente correcto. Sé específico.]

**Ejemplo bueno:**

> "La IA generó código que parecía manejar correctamente las fechas, pero al ejecutar los tests descubrí que estaba comparando strings ISO directamente con `<` y `>`, lo cual funciona por accidente con fechas del mismo año pero rompe en otros casos. Aprendí que la IA confía en heurísticas que pueden ser frágiles."

**Ejemplo malo:**

> "Aprendí que la IA es útil pero hay que revisarla."

### Aprendizaje A2

### Aprendizaje A3

[Mínimo 3. Si tienes más, mejor.]

---

## Sección 5 — Decisiones de prompt (autorreflexión)

¿Hubo algún prompt que reescribiste a mitad de la sesión? Por ejemplo, primero le pediste a la IA "genera tests" y luego cambiaste a "genera tests anclados a las reglas de negocio sin mirar el código". Si pasó algo así, descríbelo.

[Tu respuesta]

¿Hubo algún momento en que la IA "dijo que terminó" pero al verificar tú descubriste que no? Descríbelo.

[Tu respuesta]

## Chatbot Ollama — Registro

### Modelo usado
- Nombre: qwen2.5-coder:7b (o el que usaste)
- RAM consumida aproximada: 10 GB

### Sesión 1 — Datos base
- Pregunta que hice:
  - `1#: Crea los datos de prueba base para todas las reglas: un estudiante pregrado EST-PRE-01, uno posgrado EST-POS-01, un libro normal LIB-001 con 6 ejemplares y un libro de alta demanda LIB-002 con 1 ejemplarcrea los datos de prueba base para todas las reglas: un estudiante pregrado EST-PRE-01, uno posgrado EST-POS-01, un libro normal LIB-001 con 6 ejemplares y un libro de alta demanda LIB-002 con 1 ejemplar`
- Qué generó el chatbot:
  - `1# Primero, necesitamos crear el estudiante pregrado y uno de postgrado.`
  - `### Datos de Prueba:`
  - `1. **Estudiante Pregrado**`
    - `- ID: EST-PRE-01`
    - `- Nombre: Juan Pérez`
    - `- Tipo de Estudiante: Pregrado`
  - `2. **Estudiante Posgrado**`
    - `- ID: EST-POS-01`
    - `- Nombre: Ana Rodríguez`
    - `- Tipo de Estudiante: Posgrado`
  - `3. **Libro Normal**`
    - `- ID: LIB-001`
    - `- Título: "Introducción a la Programación"`
    - `- Autor: John Doe`
    - `- Tipo: Libro normal`
  - `4. **Libro de Alta Demanda**`
    - `- ID: LIB-002`
    - `- Título: "Teoría de los Juegos"`
    - `- Autor: John Nash`
    - `- Tipo: Libro de alta demanda`
  - `### Creación de Estudiantes y Libros:`
  - `**Crear Estudiante Pregrado:**`
  - `**Crear Estudiante Posgrado:**`
  - `**Crear Libro Normal (LIB-001):**`
  - `**Crear Libro de Alta Demanda (LIB-002):**`
  - `**Crear Ejemplares para LIB-001 (6 ejemplares):**`
  - `**Crear Ejemplar para LIB-002 (1 ejemplar):**`
  - `**Verificar Datos de Prueba Creados:**`
  - `- Listar estudiantes: GET /estudiantes`
  - `- Listar libros y ejemplares: GET /libros y GET /ejemplares/libro/:id_libro`
  - `Estos datos de prueba te permitirán probar todas las reglas que mencionaste.`
- ¿Fue útil?
  - `1# No, porque el chatbot no tiene contexto de como es la estructura de las entidades a las que les esta haciendo curl, lo que ocaciona que los endpoints no sean correctos, y por lo tanto no pueda crear los datos de prueba.`

### Sesión 2 — RN1
- Pregunta que hice:
  - `2# genera la prueba RN1 completa: crear los 3 préstamos válidos para pregrado y luego intentar el cuarto`
- Qué generó el chatbot:
  - `2# Chatbot: ### Prueba de RN1 (Un estudiante de pregrado no puede tener más de 3 préstamos activos)`
  - `Primero, necesitamos crear tres préstamos válidos para el estudiante EST-PRE-01 con libros disponibles y luego intentar crear un cuarto préstamo.`
  - `#### 1. Crear el primer préstamo:`
  - `#### 2. Crear el segundo préstamo:`
  - `#### 3. Crear el tercer préstamo:`
  - `#### 4. Intentar crear el cuarto préstamo:`
  - `### EJECUTAR:`
  - `Si el estudiante EST-PRE-01 intenta crear un cuarto préstamo, debería recibir un error 409 Conflict porque ha alcanzado su límite de préstamos activos (3)`
- ¿Fue útil?
  - `2# No, porque el chatbot no tiene contexto de como es la estructura de las entidades a las que les esta haciendo curl, lo que ocaciona que los endpoints no sean correctos, y por lo tanto no pueda crear los datos de prueba.`

### Sesión 3 — RN2
- Pregunta que hice:
  - `3# ahora haz lo mismo para RN2 con el estudiante de posgrado, recuerda que su límite es 5`
- Qué generó el chatbot:
  - `3# Chatbot: Claro, aquí tienes una prueba completa de la regla RN2, que establece que un estudiante de posgrado no puede tener más de 5 préstamos activos:`
  - `### Prueba RN2: Crear los 5 préstamos válidos para el estudiante de posgrado y luego intentar el sexto`
  - `#### Paso 1: Crear un préstamo válido para el estudiante de posgrado`
  - `#### Paso 2: Crear un segundo préstamo válido para el estudiante de posgrado`
  - `#### Paso 3: Crear un tercer préstamo válido para el estudiante de posgrado`
  - `#### Paso 4: Crear un cuarto préstamo válido para el estudiante de posgrado`
  - `#### Paso 5: Crear un quinto préstamo válido para el estudiante de posgrado`
  - `#### Paso 6: Intentar crear el sexto préstamo (debería fallar con conflict)`
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
  - `#### Paso 1: Crear un préstamo válido para el ejemplar`
  - `#### Paso 2: Intentar crear un nuevo préstamo con el mismo ejemplar (debería fallar)`
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
  - `#### Paso 1: Crear un préstamo con un libro normal`
  - `#### Paso 2: Crear un préstamo con un libro de alta demanda`
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
  - `### Prueba de entrada inválida: Cuerpo vacío`
  - `#### Resultado esperado:`
  - `### Prueba de entrada inválida: Estudiante inexistente`
  - `#### Resultado esperado:`
  - `### Prueba de entrada inválida: Ejemplar inexistente`
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
- ¿Qué ventajas tiene correrlo localmente?
