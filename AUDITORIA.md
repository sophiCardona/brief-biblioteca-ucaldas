# Reporte de Auditoría - Biblioteca UCaldas

## Fecha
19 de mayo de 2026

## Contexto
El proyecto actual es una API REST para el Sistema de Préstamo de Libros de la Biblioteca de la Universidad de Caldas. La implementación actual gestiona préstamos de libros en memoria con endpoints básicos para libros y préstamos. Se requiere auditar la integración de dos nuevos endpoints que aún no han sido implementados pero deben quedar documentados y proyectados para su desarrollo futuro.

## Endpoints Pendientes

### POST /estudiantes
**Descripción:** Endpoint para registrar nuevos estudiantes en el sistema con clasificación por tipo de programa académico.

**Campos requeridos:**
- `id`: Identificador único del estudiante (String)
- `nombre`: Nombre completo del estudiante (String)
- `programa`: Programa académico (String)
- `semestre`: Semestre actual (Number)
- `tipo`: Tipo de estudiante - "pregrado" o "posgrado" (String)

**Body de ejemplo:**
```json
{
  "id": "EST-PRE-01",
  "nombre": "Ana Lopez",
  "programa": "Ingenieria de Sistemas",
  "semestre": 5,
  "tipo": "pregrado"
}
```

### POST /libros
**Descripción:** Endpoint para registrar nuevos libros en el sistema con indicador de alta demanda.

**Campos requeridos:**
- `id`: Identificador único del libro (String o Number)
- `titulo`: Título del libro (String)
- `autor`: Autor del libro (String)
- `isbn`: ISBN del libro (String)
- `altaDemanda`: Booleano que indica si es un libro de alta demanda (Boolean)

**Body de ejemplo:**
```json
{
  "id": 1,
  "titulo": "Introducción a los Algoritmos",
  "autor": "Thomas H. Cormen",
  "isbn": "978-0262033848",
  "altaDemanda": true
}
```

## Pruebas de Validación

### Prueba para POST /estudiantes

```bash
curl -X POST http://localhost:3000/api/estudiantes \
  -H "Content-Type: application/json" \
  -d '{
    "id": "EST-PRE-01",
    "nombre": "Ana Lopez",
    "programa": "Ingenieria de Sistemas",
    "semestre": 5,
    "tipo": "pregrado"
  }'
```

**Caso de prueba - Estudiante de posgrado:**
```bash
curl -X POST http://localhost:3000/api/estudiantes \
  -H "Content-Type: application/json" \
  -d '{
    "id": "EST-POS-01",
    "nombre": "Carlos Martinez",
    "programa": "Maestría en Ciencias de la Computación",
    "semestre": 2,
    "tipo": "posgrado"
  }'
```

### Prueba para POST /libros

```bash
curl -X POST http://localhost:3000/api/libros \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "titulo": "Introducción a los Algoritmos",
    "autor": "Thomas H. Cormen",
    "isbn": "978-0262033848",
    "altaDemanda": true
  }'
```

**Caso de prueba - Libro sin alta demanda:**
```bash
curl -X POST http://localhost:3000/api/libros \
  -H "Content-Type: application/json" \
  -d '{
    "id": 2,
    "titulo": "Historia del Arte Moderno",
    "autor": "Ernst Gombrich",
    "isbn": "978-0714832470",
    "altaDemanda": false
  }'
```

## Observaciones de Auditoría
- Los endpoints pendientes requieren implementación en el código del servidor
- Se debe validar que el campo `tipo` en estudiantes solo acepte valores "pregrado" o "posgrado"
- Se debe implementar lógica de negocio para el campo `altaDemanda` en libros (ej: límites de préstamo diferentes)
- Los endpoints actuales usan rutas relativas (`/books`, `/loans`) mientras que los nuevos proponen usar `/api/estudiantes` y `/api/libros` - se debe estandarizar la convención de rutas
