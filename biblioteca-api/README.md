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
```
