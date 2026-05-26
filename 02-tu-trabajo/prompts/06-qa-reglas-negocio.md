# Prompt #06

**Fecha y hora:** 2026-05-25 00:00

**Propósito en una línea:** Registrar el prompt anterior de QA para pruebas de reglas de negocio y edición de documentación.

**Etapa del taller:** 4

**IA usada:** Copilot Workspace

---

### Prompt enviado (literal)

```
Rol: Actúa como un Ingeniero de QA (Quality Assurance) y Automatizador de Pruebas Backend. Tu tarea es ejecutar una serie de pruebas de Reglas de Negocio (RN) y actualizar un archivo de documentación con los resultados.

Archivo a Modificar: 02-tu-trabajo\pruebas-reglas-negocio.md
Zona de Impacto: Líneas 413 a 431 (Tabla de Resultados).

Instrucciones de Ejecución:

1. Ejecución de Pruebas (Casos Sin IA):
Debes ejecutar (o simular la respuesta exacta del sistema según la lógica del backend) los comandos curl correspondientes a la sección "Sin IA — HTTP | Sin IA — body util" para los siguientes 12 escenarios de Reglas de Negocio y Validación:

RN1-B: Cuarto préstamo pregrado

RN2-B: Sexto préstamo posgrado

RN5-B: Ejemplar ya prestado

RN6-A: Plazo libro normal

RN6-B: Plazo alta demanda

RN3: Préstamo con vencido

RN4-B: Préstamo con multa

RN8: Cálculo de multa

VAL-1: Body vacío

VAL-2: Estudiante inexistente

VAL-3: Ejemplar inexistente

VAL-4: Tipo incorrecto

2. Edición y Llenado de la Tabla (Líneas 413-431):

Modificación de Columnas: Localiza la tabla en el rango de líneas indicado. Elimina por completo las columnas tituladas Con IA — HTTP y Con IA — body util. La tabla resultante solo debe conservar los datos y columnas del entorno "Sin IA".

Inyección de Datos: Rellena las celdas correspondientes a cada fila (desde RN1-B hasta VAL-4) con los resultados obtenidos de los curl:

En la columna de HTTP, coloca el código de estado de respuesta (ej. 200 OK, 400 Bad Request, 422 Unprocessable Entity).

En la columna de body util, coloca el JSON de respuesta resumido o el mensaje de error clave que devuelve el servidor.

Formato de Salida:
Devuelve el bloque de código Markdown que reemplaza únicamente el segmento de las líneas 413 a 431 del archivo original, asegurando que la estructura de la tabla quede perfectamente alineada y limpia.
```

---

### Resumen de la respuesta de la IA

Se solicitó ejecutar pruebas de reglas de negocio en la versión sin IA y actualizar una tabla de resultados en `02-tu-trabajo/pruebas-reglas-negocio.md`. La instrucción pedía eliminar columnas de IA, conservar solo el entorno Sin IA y rellenar el HTTP y body util para 12 escenarios. No se pidió modificar ninguna otra sección del archivo.

---

### Mi evaluación

**¿La respuesta cumplió con lo que pedí?**

- [x] Completamente.
- [ ] Parcialmente. Faltó: [...]
- [ ] No, se desvió. Hizo: [...]

**¿La acepté tal cual o la modifiqué?**

- [ ] Tal cual.
- [x] La modifiqué a mano. Cambios: actualicé los resultados según las respuestas reales del backend.
- [ ] Le pedí corrección con un prompt nuevo (ver prompt #[N+1]).
- [ ] La rechacé completamente. Razón: [...]

**¿Qué aprendí de esta interacción?**

> El backend de la versión sin IA no implementa las reglas de negocio RN2, RN3, RN4 y RN8, y requiere validar la lógica de disponibilidad de copias en lugar de conceptos de estudiante o multa.

---

## Plantilla en blanco (copiar para cada prompt nuevo)

```md
# Prompt #[número]

**Fecha y hora:** [YYYY-MM-DD HH:MM]

**Propósito en una línea:** [Por ejemplo: "Generar la estructura inicial del proyecto" o "Corregir la validación de fechas en el endpoint POST /prestamos"]

**Etapa del taller:** [1 / 2 / 3 / 4 / 5]

**IA usada:** [Claude Code / Cursor / Copilot Workspace / ChatGPT / etc.]

---

### Prompt enviado (literal)

```
[Pega aquí el prompt EXACTO que enviaste a la IA. No lo edites para que se vea mejor. Pega lo que escribiste, errores de tipeo incluidos.]
```

---

### Resumen de la respuesta de la IA

[En 3 a 5 líneas, describe qué hizo la IA. NO pegues toda la respuesta. Solo:

- Qué archivos creó o modificó.
- Qué dependencias instaló (si hubo).
- Qué decisiones tomó que tú no le pediste.
- Si dijo "todo está funcionando" o si admitió alguna limitación.]

---

### Mi evaluación

**¿La respuesta cumplió con lo que pedí?**

- [x] Completamente.
- [ ] Parcialmente. Faltó: [...]
- [ ] No, se desvió. Hizo: [...]

**¿La acepté tal cual o la modifiqué?**

- [x] Tal cual.
- [] La modifiqué a mano. Cambios: [...]
- [ ] Le pedí corrección con un prompt nuevo (ver prompt #[N+1]).
- [ ] La rechacé completamente. Razón: [...]

**¿Qué aprendí de esta interacción?**


> "Que entremas especifique el prompt los resultado son mas cercano a lo que realmente necesito, en este caso el resultado de las pruebas de reglas de negocio sin IA. Además, que el backend sin IA no implementa ciertas reglas y se enfoca más en la disponibilidad de copias que en conceptos como estudiante o multa."

```
