const readline = require("readline");
const { execSync } = require("child_process");

const BASE_URL = "http://localhost:3001";
const OLLAMA_URL = "http://localhost:11434/api/chat";
const MODELO = "qwen2.5-coder"; 

const SYSTEM_PROMPT = `
Eres un asistente de QA especializado en probar una API REST de biblioteca universitaria.

BASE URL del servidor: ${BASE_URL}

REGLAS DE NEGOCIO QUE DEBES CONOCER:
RN1. Un estudiante de pregrado no puede tener más de 3 préstamos activos. Si lo intenta: 409 Conflict.
RN2. Un estudiante de posgrado no puede tener más de 5 préstamos activos. Si lo intenta: 409 Conflict.
RN3. Si un estudiante tiene un préstamo vencido sin devolver, no puede solicitar nuevos préstamos: 409 Conflict.
RN4. Si un estudiante tiene multas pendientes sin pagar, no puede solicitar préstamos: 409 Conflict.
RN5. Un ejemplar que ya está prestado no puede prestarse de nuevo hasta que sea devuelto: 409 Conflict.
RN6. El plazo de préstamo depende del tipo de libro: 15 días para libros normales, 3 días para libros de alta demanda.
RN7. La renovación de un préstamo se deniega si otro estudiante está esperando el mismo libro: 409 Conflict.
RN8. La multa por devolución tardía es de 2000 pesos por día de retraso por cada libro.
RN9. La renovación extiende el préstamo por el mismo plazo original: 15 días o 3 días según el tipo de libro. 
RN10. La multa se calcula automáticamente al momento de registrar la devolución, comparando la fecha real con la fecha límite pactada.
RN11. Un estudiante con multas pendientes no puede renovar préstamos: 409 Conflict.
RN12. Un estudiante con un préstamo vencido sin devolver no puede renovar préstamos: 409 Conflict.
RN13. Un estudiante no puede renovar un libro que no ha pedido prestado: 404 Not Found.
RN14. Un libro prestado no puede prestarse hasta que sea devuelto, incluso si el préstamo está vencido: 409 Conflict.
RN15. Un estudiante no puede tener más de 2 préstamos activos del mismo libro: 409 Conflict.

ENDPOINTS CONOCIDOS:
- GET    /libros                              Catálogo de libros
- POST   /libros                              Crear libro
- GET    /libros/:id                          Detalles de libro
- DELETE /libros/:id                          Eliminar libro
- POST   /ejemplares                          Crear ejemplar
- GET    /ejemplares/libro/:id_libro          Listar ejemplares
- GET    /estudiantes                         Listar estudiantes
- POST   /estudiantes                         Crear estudiante
- PUT    /estudiantes/:id                     Actualizar estudiante
- GET    /estudiantes/:id                     Detalles de estudiante
- DELETE /estudiantes/:id                     Eliminar estudiante
- POST   /prestamos                           Crear préstamo
- GET    /prestamos                           Listar préstamos activos
- GET    /prestamos/:id                       Detalles de préstamo
- GET    /prestamos/estudiante/:id_estudiante Listar préstamos de un estudiante
- PUT    /prestamos/:id                       Actualizar préstamo
- DELETE /prestamos/:id                       Eliminar préstamo
- POST   /devoluciones                        Registrar devolución
- GET    /devoluciones                        Listar devoluciones
- GET    /devoluciones/:id                    Detalles de devolución
- POST   /solicitudes                         Crear Solicitud
- GET    /solicitudes                       Listar Solicitudes

EJEMPLO DE COMANDO CURL PARA CREAR LAS ENTIDADES DE PRUEBA BASE:
# Crear libro
curl -X POST http://localhost:3001/libros -H "Content-Type: application/json" -d '{"id":"L001","titulo":"Algoritmos","autor":"Knuth","ubicacion_sala":"Sala A","tipo":"normal"}'
# Crear libro de alta demanda
curl -X POST http://localhost:3001/libros -H "Content-Type: application/json" -d '{"id":"L002","titulo":"Estructuras de Datos","autor":"Weiss","ubicacion_sala":"Sala B","tipo":"alta demanda"}'
# Crear estudiante de pregrado
curl -X POST http://localhost:3001/estudiantes -H "Content-Type: application/json" -d '{"id":"EST001","progAcademico":"Ingeniería","semestre":3,"tipo":"pregrado"}'

# Crear estudiante de posgrado
curl -X POST http://localhost:3001/estudiantes -H "Content-Type: application/json" -d '{"id":"EST002","progAcademico":"Maestría","semestre":1,"tipo":"posgrado"}'

# Crear ejemplar
curl -X POST http://localhost:3001/ejemplares -H "Content-Type: application/json" -d '{"id":"EJ001","idLibro":"L001"}'

# Listar todos los ejemplares (NUEVO ENDPOINT)
curl -X GET http://localhost:3001/ejemplares -H "Content-Type: application/json"

# Crear préstamo
curl -X POST http://localhost:3001/prestamos -H "Content-Type: application/json" -d '{"id":"PRES001","estudiante_id":"EST001","ejemplar_id":"EJ001","fecha_prestamo":"2026-05-20T00:00:00.000Z"}'

# Registrar devolución
curl -X POST http://localhost:3001/devoluciones -H "Content-Type: application/json" -d '{"id":"DEV001","prestamo_id":"PRES001","fecha_devolucion":"2026-06-01T00:00:00.000Z"}'

# Crear solicitud
curl -X POST http://localhost:3001/solicitudes -H "Content-Type: application/json" -d '{"estudiante_id":"EST001","prestamo_id":"PRES002"}'


INSTRUCCIONES DE COMPORTAMIENTO:
- Cuando el usuario pida probar una regla, genera el comando curl exacto para hacerlo.
- Primero genera los datos de prueba necesarios (crear estudiante, crear libro, etc.).
- Explica brevemente qué debe pasar y por qué código HTTP esperas.
- Si el usuario te pregunta por un error, analiza el código HTTP y el body de la respuesta.
- Si el usuario te pide ejecutar el curl, responde con el comando y di "EJECUTAR:" antes del comando para que el sistema lo detecte.
- Sé conciso. No repitas información que el usuario ya sabe.
`.trim();

const historial = [{ role: "system", content: SYSTEM_PROMPT }];

async function preguntarAlModelo(mensajeUsuario) {
  historial.push({ role: "user", content: mensajeUsuario });

  const respuesta = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODELO,
      messages: historial,
      stream: false,
    }),
  });

  if (!respuesta.ok) {
    throw new Error(`Ollama respondió ${respuesta.status}. ¿Está corriendo? Ejecuta: ollama serve`);
  }

  const datos = await respuesta.json();
  const contenido = datos.message.content;
  historial.push({ role: "assistant", content: contenido });
  return contenido;
}

function ejecutarCurl(respuestaModelo) {
  const lineas = respuestaModelo.split("\n");
  for (const linea of lineas) {
    if (linea.trim().startsWith("EJECUTAR:")) {
      const comando = linea.replace("EJECUTAR:", "").trim();
      console.log(`\n[EJECUTANDO]: ${comando}\n`);
      try {
        const resultado = execSync(comando, { encoding: "utf-8", timeout: 10000 });
        console.log("[RESULTADO]:\n" + resultado);
      } catch (err) {
        console.log("[RESULTADO]:\n" + (err.stdout || err.message));
      }
      return true;
    }
  }
  return false;
}

async function iniciar() {
  console.log("=== Chatbot de Pruebas — Biblioteca UCaldas ===");
  console.log(`Modelo: ${MODELO}`);
  console.log(`Servidor: ${BASE_URL}`);
  console.log('Escribe tu pregunta. Ejemplos:');
  console.log('  "prueba que un pregrado no pueda tener 4 préstamos"');
  console.log('  "ejecuta la prueba RN6 para el plazo de alta demanda"');
  console.log('  "crea datos de prueba para RN1"');
  console.log('Escribe "salir" para terminar.\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const preguntar = () => {
    rl.question("Tú: ", async (entrada) => {
      if (entrada.toLowerCase() === "salir") {
        console.log("Hasta luego.");
        rl.close();
        return;
      }

      if (!entrada.trim()) {
        preguntar();
        return;
      }

      try {
        const respuesta = await preguntarAlModelo(entrada);
        console.log(`\nChatbot: ${respuesta}\n`);
        ejecutarCurl(respuesta);
      } catch (err) {
        console.error(`Error: ${err.message}`);
      }

      preguntar();
    });
  };

  preguntar();
}

iniciar();