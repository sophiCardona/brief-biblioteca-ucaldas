# /02-tu-trabajo/prompts/tabla-comparativa.md

## Prompt #5

**Fecha y hora:** 2026-05-24 21:49

**Propósito en una línea:** Formatear el bloque final de resultados de pruebas de reglas de negocio y dejarlo listo para guardar como Markdown.

**Etapa del taller:** 4

**IA usada:** Copilot

---

### Prompt enviado (literal)

```text
Rol: Actúa como un Ingeniero de QA (Quality Assurance) y Automatizador de Pruebas Backend. Tu tarea es ejecutar una serie de pruebas de Reglas de Negocio (RN) y actualizar un archivo de documentación con los resultados.

Archivo a Modificar: 02-tu-trabajo\pruebas-reglas-negocio.md
Zona de Impacto: Líneas 432 a 450 (Tabla de Resultados).

Instrucciones de Ejecución:

1. Ejecución de Pruebas (Casos Con IA):
Debes ejecutar (o simular la respuesta exacta del sistema según la lógica del backend) los comandos curl correspondientes a la sección "Con IA — HTTP | Con IA — body util" para los siguientes 12 escenarios de Reglas de Negocio y Validación:

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

2. Edición y Llenado de la Tabla (Líneas 432-450):

Modificación de Columnas: Localiza la tabla en el rango de líneas indicado. Elimina por completo las columnas tituladas Sin IA — HTTP y Sin IA — body util. La tabla resultante solo debe conservar los datos y columnas del entorno "Con IA".

Inyección de Datos: Rellena las celdas correspondientes a cada fila (desde RN1-B hasta VAL-4) con los resultados obtenidos de los curl:

En la columna de HTTP, coloca el código de estado de respuesta (ej. 200 OK, 400 Bad Request, 422 Unprocessable Entity).

En la columna de body util, coloca el JSON de respuesta resumido o el mensaje de error clave que devuelve el servidor.

Formato de Salida:
Devuelve el bloque de código Markdown que reemplaza únicamente el segmento de las líneas 432 a 450 del archivo original, asegurando que la estructura de la tabla quede perfectamente alineada y limpia.

Resumen de la respuesta de la IA

La IA leyó la sección de la tabla comparativa y el backend limpio del proyecto para recuperar los códigos HTTP y los cuerpos de respuesta.
Editó 02-tu-trabajo/pruebas-reglas-negocio.md y reemplazó la tabla por una versión enfocada solo en “Con IA”.
También validó el archivo después del cambio y no encontró errores de Markdown.

Mi evaluación
¿La respuesta cumplió con lo que pedí?

 X Completamente.
   Parcialmente. Faltó: [...]
   No, se desvió. Hizo: [...]

¿La acepté tal cual o la modifiqué?

 X Tal cual.
   La modifiqué a mano. Cambios: [...]
   Le pedí corrección con un prompt nuevo (ver prompt #[N+1]).
   La rechacé completamente. Razón: [...]

¿Qué aprendí de esta interacción?

La tabla debía quedar alineada con el comportamiento real del backend limpio y no con valores genéricos; además, las validaciones fallan primero por campos requeridos antes de llegar a búsquedas de existencia.