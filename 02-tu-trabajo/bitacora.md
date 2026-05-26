
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
