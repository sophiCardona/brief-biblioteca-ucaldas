
# Registro de Prompts — Prompt #3

**Fecha y hora:** 1205-2026 22:12

**Propósito en una línea:** Correcion error que dejó el promt anterior de la creacion de ala version 2 del proyecto 

**Etapa del taller:** 2
**IA usada:** GitHub Copilot (Claude Haiku 4.5)

---

### Prompt enviado (literal)

que ocurre con el error que hay en el documento tsconfig.json


---

### Resumen de la respuesta de la IA

Corregido en `biblioteca-api-clean/tsconfig.json`: dejé `moduleResolution` en `Node` y agregué `ignoreDeprecations: "5.0"` para eliminar la advertencia de TypeScript sobre la resolución de módulos obsoleta.

Validación hecha: `npm run build` quedó exitoso y la compilación genera `dist` sin errores.
---

### Mi evaluación

**¿La respuesta cumplió con lo que pedí?**

- [x] Completamente.

**¿La acepté tal cual o la modifiqué?**


- [X] Tal cual.

**¿Qué aprendí de esta interacción?**

A pesar de que el promt tenia especificaciones concretas y no deberia dejar errores, tuvo dificultades con la version de Node.
Asi que de igual manera hay que hacer correciones y revisiones en cada momento de lo que realizamos con estas herramientas. 

