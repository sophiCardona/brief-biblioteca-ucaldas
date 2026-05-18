**Requisitos previos:** Haber explorado los proyectos `proyecto-v1` y `proyecto-v2` del repositorio

---

## Contexto

Durante este taller trabajarás con dos versiones de la misma API REST para gestión de préstamos de una biblioteca universitaria.

- **`proyecto-v1`** — Implementación simple en JavaScript con Express o . Sin validaciones formales, sin arquitectura en capas, sin tests.
- **`proyecto-v2`** — Implementación en TypeScript con Clean Architecture, validaciones con Zod, manejo de errores tipado y suite completa de tests unitarios e integración.

El objetivo no es determinar cuál versión es "mejor", sino comprender qué impacto tiene la estructura del código sobre la capacidad de probarlo.

---

## Antes de empezar

Levanta ambos servidores en terminales separadas:

```bash
# Terminal 1
cd proyecto-v1
node src/index.js
```

```bash
# Terminal 2
cd proyecto-v2
npm run dev
```

Verifica que ambos respondan:

```bash
curl http://localhost:3000/
curl http://localhost:3001/
```

---

## Bloque 1 — Lectura y comparación estructural

### Ejercicio 1.1 — Inventario de diferencias

Recorre ambos proyectos y completa la siguiente tabla en tu bitácora:

| Dimensión | v1 | v2 |
|---|---|---|
| Lenguaje | JavaScript | TypeScript|
| Validación de entradas al servidor | Mínima: solo verifica que bookId y borrower existan (if (!bookId || !borrower)) | Manual robusta en la capa de servicio: verifica campos requeridos, tipos enumerados, números enteros y fechas válidas. Lanza AppError 400 ante datos inválidos |
| Manejo de errores HTTP |Inline en cada ruta con return res.status(4xx).json(...) sin middleware centralizado |Middleware centralizado en app.ts que captura todos los AppError y responde con el código y mensaje apropiado |
| Arquitectura (número de capas) |1 capa: todo en src/index.js (rutas, lógica y datos mezclados) |3 capas: core (entidades y servicios), infrastructure (almacenamiento), interfaces (rutas HTTP) |
| Tests incluidos | No |Sí: Jest + Supertest  |
| Tipado de datos |Sin tipado (JavaScript puro) |Tipado estricto con interfaces TypeScript (Libro, Estudiante, Prestamo, etc.) en entities.ts |
| Forma de iniciar la aplicación |npm start |npm run dev (ts-node-dev) en desarrollo, npm start (node dist/) en producción |

### Ejercicio 1.2 — Rastreo de una regla de negocio

Localiza la **RN1: límite de préstamos simultáneos por tipo de estudiante** en ambas versiones y responde:

1. ¿En qué archivo está en v1? ¿En cuántas líneas se implementa?

- No existe la restriccion, simplemente crea el prestamo sin verificar que ya hayan prestamos simultaneos. 

2. ¿En qué archivo(s) está en v2? ¿Qué capas atraviesa?

- Esta en el archivo rc/core/services/libraryService.ts, atraviesa estas capas: 

HTTP Request (POST /prestamos)
        ↓
interfaces/http/routes.ts        ← recibe el request y llama al servicio
        ↓
core/services/libraryService.ts  ← aquí vive la restricción
        ↓
infrastructure/memory/store.ts   ← consulta los préstamos activos del estudiante

3. Si el cliente pide cambiar el límite de pregrado de 3 a 4, ¿cuántos archivos hay que modificar en cada versión?

Version 1: Habría que crear la restriccion desde cero en index.js, mezclando la logica con las rutas. 

Version 2: Habría que modificar unicamente un archivo "src/core/services/libraryService.ts" , exatamente esta linea "const maxAllowed = estudiante.tipo === "pregrado" ? 3 : 5", cambiando el 3 por el 4. 

4. ¿Cómo sabrías que el cambio no rompió nada en cada versión?

Version 1: Habría que proparlo manualmente haciendo peticiones con postman por ejemplo y verificar que todo siga funcionando correctamente. 

Version 2: Podriamos correr los test con "npm test", si algo se rompe, un test fallaria y me diría exactamente donde. En este caso, tenemos el test implementado "test_RN1_estudiante_pregrado_no_puede_tener_4_prestamos_activos", el cual arroja error 409 si se hace un 4to préstamo por tanto, habría que modificar el préstamo también en caso de que sean permitido 4 préstamos. 
---

## Bloque 2 — Análisis de calidad y comportamiento ante errores

**Modalidad:** Parejas  
**Tiempo:** 30 minutos

### Ejercicio 2.1 — El request que no debería funcionar

Ejecuta el siguiente comando contra **v1**:

```bash
curl -s -X POST http://localhost:3000/api/prestamos \
  -H "Content-Type: application/json" \
  -d '{"estudianteId": "NO-EXISTE", "ejemplarId": "abc"}' | jq
```

Luego ejecuta el mismo request contra **v2** (ajusta el puerto si es necesario).

**Consideraciones antes de responder:** 

Modificacion del comando a ejecutar para v1: 

```bash
curl.exe -s -X POST http://localhost:3000/loans -H "Content-Type: application/json" -d "{\"bookId\": \"NO-EXISTE\", \"borrower\": \"test\"}"
```
Se ejecuta con estos nombres en lugar de "estudianteId" y "ejemplarId" ya que la version 1, no tiene estas entidades, por tanto se realiza con "bookId" y "borrower", que hacen referencia al id del libro y el prestador. Antes de este comando ejecutar el request correctamente, devuelve una página HTML con el stack trace completo del error interno, exponiendo rutas de archivos, versiones de librerías y estructura interna del servidor, lo que indica que no hay middleware de errores que intercepte y sanitice la respuesta. 
Esto sucedIÓ debido a que PowerShell transformó las comillas y el JSON llegó malformado al servidor. 

También es importante notar que esta versión, no verifica si quiera que el estudiante existe: 
- No hay concepto de estudiante, solo un campo borrower que acepta cualquier texto sin validar
- No verifica tipo de estudiante ni límite de préstamos simultáneos
- No verifica fechas

Para no volver a presenciar el problema y poder ver el funcionamiento del request, se cera ejecuta la siguiente instruccion en bash, que crea el archivo directamente con los datos anteriores: 

```bash
'{"bookId": "NO-EXISTE", "borrower": "abc"}' | Out-File -FilePath body.json -Encoding utf8
```
Y se envía la petición: 

```bash
curl.exe -i -X POST http://localhost:3000/loans -H "Content-Type: application/json" -d "@body.json"
```

Modificacion del comando a ejecutar para v2: 

```bash
curl.exe -s -X POST http://localhost:3001/prestamos -H "Content-Type: application/json" -d "{\"estudianteId\": \"NO-EXISTE\", \"ejemplarId\": \"abc\"}"
```
En esta version si existen los campos "estudianteid", "ejemplarid". 
Aun presenciamos que el JSON llega malformado al servidor, pero en este caso la respuesta fue: {"error":"Internal Server Error"}

Se hace el mismo procedimiento anterior, creacion del archivo: 

```bash
'{"id": "P99", "estudiante_id": "NO-EXISTE", "ejemplar_id": "NO-EXISTE", "fecha_prestamo": "2026-05-17T00:00:00.000Z"}' | Out-File -FilePath body2.json -Encoding utf8
```

Petición enviada: 

```bash
curl.exe -i -X POST http://localhost:3001/prestamos -H "Content-Type: application/json" -d "@body2.json"
```

Responde en tu bitácora:

1. ¿Qué código HTTP devuelve cada versión?

Version 1: 404 Not Found
Version 2: 404 Not Found

2. ¿Qué información contiene el cuerpo de la respuesta en cada caso?

Version 1: {"error":"Libro no encontrado"}
Version 2: {"error":"Estudiante no encontrado"}

3. ¿Cuál respuesta es más útil para un cliente que consume la API?

Ambas devuelven JSON con un mensaje claro en este caso, pero v2 es más consistente porque todos los errores pasan por el mismo middleware centralizado, garantizando siempre el mismo formato. En v1 si ocurre un error inesperado, devuelve HTML con el stack trace como viste antes — eso no es útil para un cliente que consume la API.

4. ¿Qué pasa en v1 si `ejemplarId` llega como string en lugar de número? ¿Y en v2?

Version 1: para esta version como no tenemos la entidad ejemplarId, se pone bookid como numero en lugar de string. 
Codigo HTTP: 201 Created
Cuerpo: {"id":1,"bookId":1,"borrower":"Ana","loanDate":"2026-05-17T18:49:11.781Z","returned":false,"returnDate":null}
Acepta ambos casos sin validaciones.

Version 2: En este caso, ejemplar Id, ya estaba predeterminado como string, por tanto se probará el contrario, que pasa si llega como número. 
Codigo HTTP: 400 Bad Request
Cuerpo: {"error":"Campo requerido: ejemplar_id"}
No pasa la validacion ya que "assertRequiredString" verifica estrictamente que sea string. 

### Ejercicio 2.2 — Comparar errores de dominio

Provoca el mismo error de negocio en ambas versiones: intenta prestar un ejemplar que ya está prestado.

Pasos sugeridos:
1. Crea un préstamo con el ejemplar 1
2. Intenta crear otro préstamo con el mismo ejemplar 1

Registra y compara:

| Aspecto | v1 | v2 |
|---|---|---|
| Código HTTP | 201 Created |409 Conflict |
| Campo `error` en la respuesta |Ninguno — no hay error, acepta ambos préstamos | {"error":"Ejemplar no disponible"} |
| Mensaje legible |No aplica — no detecta el problema |Sí, indica exactamente que el ejemplar ya está prestado |
| Información adicional (detalles) |Solo devuelve el préstamo creado, sin contexto |El código 409 indica conflicto de negocio, no error del servidor |
| ¿Expone información interna del servidor? |No en este caso, pero ante errores inesperados devuelve HTML con stack trace |No — el middleware centralizado siempre devuelve JSON limpio |

---

## Bloque 3 — Análisis de los tests de v2

### Ejercicio 3.1 — Lectura de un test unitario

Abre el archivo `proyecto-v2/tests/unit/CrearPrestamo.test.ts` y responde:

En esta API diseñada con Clean Architecture, diseñado con ia no cuenta con tests unitarios por ende no hay nada como "CrearPrestamo.test.ts" en el proyecto-v2, sin embargo, se puede encontrar un test de integración que prueba la creación de un préstamo y verifica la RN1, el cual se encuentra en "proyecto-v2/tests/integration/CrearPrestamo.test.ts", específicamente el test "test_RN1_estudiante_pregrado_no_puede_tener_4_prestamos_activos".

1. ¿Qué técnica de aislamiento se usa? (mocks, stubs, fakes, spies)
- Se usa In-Memory Store (almacenamiento fake). Los tests usan la app completa (rutas, servicios, validaciones reales), pero con una base de datos en memoria (`store.reset()` en línea 6). NO hay mocks de repositorios ni jest.fn(). Es una técnica de aislamiento por sustitución del almacenamiento, no por aislamiento unitario.
2. ¿Se levanta algún servidor HTTP para ejecutar este test? ¿Por qué importa esto?
- Sí, se levanta la app Express completa (línea 2: `import { app }`). Supertest simula requests HTTP reales contra la app sin levantar un servidor en puerto. Importa porque: prueba el flujo real (routes → servicios → store), es más realista que unitarios, pero es más lento que tests unitarios puros. Cualquier cambio en las rutas o formato de respuestas se detecta inmediatamente.
3. Identifica en qué línea(s) del archivo se prueba la **RN3** (préstamos vencidos pendientes) y la **RN4** (solicitudes pendientes).
- **RN3**: Líneas 74-95, test `test_RN3_estudiante_con_prestamo_vencido_no_puede_crear_nuevo_prestamo`. Crea un préstamo con fecha 2026-01-01 (vencido) y verifica que el 2do préstamo en 2026-05-12 devuelve 409 con error "prestamo_vencidos_o_multas_pendientes".
- **RN4**: Líneas 97-145, test `test_RN4_renovacion_bloqueada_por_solicitudes_pendientes`. Crea un préstamo, luego otra estudiante crea una solicitud sobre él, y verifica que renovar devuelve 409 con error "renovacion_no_permitida_solicitudes_pendientes".
4. ¿Cuánto tiempo tarda en ejecutarse esta suite de tests? Corre `npm test` para verificarlo.
- **1.997 segundos (1997 ms)** para toda la suite (5 tests). Todos los tests pasaron. Ver línea final de npm test: "Time: 1.997 s".


---

## Bloque 4 — Escritura de tests


### Ejercicio 4.1 — Un test que v1 no puede tener con la misma velocidad

En `proyecto-v2`, escribe un test unitario para `CrearPrestamo` que verifique que un estudiante de **posgrado** puede tener hasta 5 préstamos simultáneos pero falla al intentar el sexto.

Plantilla de inicio:

```typescript
it("test_RN1_estudiante_posgrado_no_puede_tener_5_prestamos_activos", async () => {
    await request(app).post("/libros").send({
      id: "L1",
      titulo: "Libro",
      autor: "Autor",
      ubicacion_sala: "Sala A",
      tipo: "normal"
    });

    await request(app).post("/estudiantes").send({
      id: "E1",
      progAcademico: "Ing Sistemas",
      semestre: 4,
      tipo: "posgrado"
    });

    for (let i = 1; i <= 6; i += 1) {
      await request(app).post("/ejemplares").send({ id: `EJ${i}`, idLibro: "L1" });
    }

    for (let i = 1; i <= 5; i += 1) {
      const response = await request(app).post("/prestamos").send({
        id: `P${i}`,
        estudiante_id: "E1",
        ejemplar_id: `EJ${i}`,
        fecha_prestamo: "2026-05-12T10:00:00.000Z"
      });
      expect(response.status).toBe(201);
    }

    const sixth = await request(app).post("/prestamos").send({
      id: "P6",
      estudiante_id: "E1",
      ejemplar_id: "EJ4",
      fecha_prestamo: "2026-05-12T10:00:00.000Z"
    });

    expect(sixth.status).toBe(409);
    expect(sixth.body.error).toBe("limite_prestamos_alcanzado");
  });
```

Una vez terminado, reflexiona: ¿por qué sería más lento o difícil escribir este test en v1?
Al no tener una arquitectura en capas ni validaciones formales, el código de v1 no tiene una función clara y aislada para la lógica de creación de préstamos. La lógica de negocio está mezclada con las rutas HTTP, por lo que para probar esta regla de negocio (RN1) habría que levantar el servidor y hacer peticiones HTTP reales, lo que es mucho más lento que un test unitario directo a la función del servicio en v2. Además, sin validaciones formales, sería difícil incluso detectar dónde implementar la restricción de 5 préstamos para posgrado, lo que haría el proceso aún más tedioso.

