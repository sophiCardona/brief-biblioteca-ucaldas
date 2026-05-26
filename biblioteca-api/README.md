# Biblioteca API (datos en memoria)

API REST sencilla para gestionar préstamos de libros en memoria.

Instrucciones rápidas:

1. Abrir terminal en `biblioteca-api`

2. Instalar dependencias:

```bash
npm install
```

3. Ejecutar:

```bash
npm start
```

API endpoints principales:

- `GET /books` — listar libros
- `GET /books/:id` — obtener libro
- `POST /loans` — crear préstamo (body JSON: `{ "bookId": 1, "borrower": "Nombre" }`)
- `POST /returns/:loanId` — devolver préstamo
- `GET /loans/active` — listar préstamos vigentes
- `GET /loans` — listar todos los préstamos

## Endpoints Pendientes de Implementación

- `POST /api/estudiantes` — registrar estudiante (body JSON: `{ "id": "EST-PRE-01", "nombre": "Ana Lopez", "programa": "Ingenieria de Sistemas", "semestre": 5, "tipo": "pregrado" }`)
- `POST /api/libros` — registrar libro (body JSON: `{ "id": 1, "titulo": "Introducción a los Algoritmos", "autor": "Thomas H. Cormen", "isbn": "978-0262033848", "altaDemanda": true }`)

Ejemplos curl:

```bash
# Listar libros
curl http://localhost:3000/books

# Crear préstamo
curl -X POST http://localhost:3000/loans -H "Content-Type: application/json" -d '{"bookId":1,"borrower":"Pedro"}'

# Listar préstamos vigentes
curl http://localhost:3000/loans/active

# Devolver préstamo (reemplazar 1 por el id recibido)
curl -X POST http://localhost:3000/returns/1

# Registrar estudiante (endpoint pendiente)
curl -X POST http://localhost:3000/api/estudiantes -H "Content-Type: application/json" -d '{"id":"EST-PRE-01","nombre":"Ana Lopez","programa":"Ingenieria de Sistemas","semestre":5,"tipo":"pregrado"}'

# Registrar libro (endpoint pendiente)
curl -X POST http://localhost:3000/api/libros -H "Content-Type: application/json" -d '{"id":1,"titulo":"Introducción a los Algoritmos","autor":"Thomas H. Cormen","isbn":"978-0262033848","altaDemanda":true}'
```
