Registro de Prompts
## Prompt #2

**Fecha y hora:** 2026-05-12 21:58

**Propósito en una línea:** Generar estructura base y arquitectura limpia del proyecto API REST con Node.js + Express + TypeScript, datos en memoria y reglas de negocio completas.


**Etapa del taller:** 2

**IA usada:** GitHub Copilot (Claude Haiku 4.5)
---

### Prompt enviado (literal)

```
Contexto y Preparación:
Actúa como un Desarrollador Senior especializado en Node.js y TypeScript. Antes de generar cualquier línea de código, lee y analiza detenidamente el archivo de especificaciones ubicado en: plantilla-especificacion.md

Objetivo:
Desarrollar el proyecto completo basándote exclusivamente en las funcionalidades descritas en la plantilla, siguiendo estas restricciones técnicas estrictas:

🛠 Stack y Restricciones
Entorno: Node.js + Express.
Lenguaje: TypeScript (configuración estricta).
Persistencia: Únicamente datos en memoria (Variables/Arrays/Maps). Prohibido usar bases de datos (SQL o NoSQL).
Seguridad: Sin autenticación ni autorización para esta versión.
Interfaz: Solo API REST (Sin frontend).
Testing: Implementar pruebas unitarias/integración al final utilizando Jest.

📐 Reglas de Implementación
Arquitectura: Sigue fielmente la estructura de carpetas definida en la especificación. Si no se menciona ninguna, implementa una Arquitectura Limpia (Clean Architecture) o Arquitectura por Capas (src/core, src/infrastructure, src/interfaces).
Fidelidad: No inventes funcionalidades, rutas o campos que no estén explícitamente detallados.
Ambigüedad: Si encuentras algún punto contradictorio o poco claro en la plantilla, detente y pregunta antes de proceder con la implementación.
Entregables iniciales: Genera los archivos de configuración base: package.json, tsconfig.json, .gitignore, .env (ejemplo) y un README.md con instrucciones de instalación y uso.

```

---

### Resumen de la respuesta de la IA

> Creó estructura completa con capas: `src/core` (entities, services, errors), `src/infrastructure/memory` (store), `src/interfaces/http` (app, routes). 
> Implementó LibraryService con todas las reglas RN1-RN4 (límite de préstamos, plazo por tipo de libro, bloqueo por vencimiento, bloqueo de renovación). 
> Generó store en memoria con Maps para todas las entidades. > Configuró Express con manejo de errores centralizado. 
> Creó 5 tests de integración con Jest + Supertest que validan cada regla. 
> Instaló dependencias correctas (express, typescript, jest, supertest, ts-node-dev). 
> Declaró ambigüedades y pidió aclaraciones antes de implementar.

---

### Mi evaluación

**¿La respuesta cumplió con lo que pedí?**

- [X] Completamente.
- [ ] Parcialmente. Faltó: [...]
- [ ] No, se desvió. Hizo: [...]

**¿La acepté tal cual o la modifiqué?**

- [ ] Tal cual.
- [x] La modifique a mano. Cambios: Corregí import no usado (LoanState) en libraryService.ts que bloqueaba compilación TypeScript strict. 
- [X] Le pedí corrección con un prompt nuevo (ver prompt #3).
- [ ] La rechacé completamente. Razón: [...]

**¿Qué aprendí de esta interacción?**

>La precisión en el prompt inicial es crítica: al incluir restricciones explícitas (strict TypeScript, sin BD, sin invenciones), la IA generó código altamente alineado con especificación sin desviaciones.

