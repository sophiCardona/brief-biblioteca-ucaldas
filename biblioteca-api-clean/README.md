# Biblioteca API Clean

API REST para gestión de préstamos de libros de Biblioteca UCaldas, implementada con Node.js + Express + TypeScript estricto, con persistencia SQLite local y sin autenticación.

## Stack

- Node.js
- Express
- TypeScript (strict)
- Jest + Supertest
- Persistencia SQLite local

## Estructura

```text
biblioteca-api-clean/
├── src/
│   ├── core/
│   │   ├── entities.ts
│   │   ├── errors.ts
│   │   └── services/
│   │       └── libraryService.ts
│   ├── infrastructure/
│   │   └── sqlite/
│   │       └── store.ts
│   ├── interfaces/
│   │   └── http/
│   │       ├── app.ts
│   │       └── routes.ts
│   └── server.ts
├── tests/
│   └── integration/
│       └── api.test.ts
├── package.json
├── tsconfig.json
├── jest.config.ts
├── .env.example
└── .gitignore
```

## Instalacion

```bash
npm install
```

## Ejecucion

```bash
npm run dev
```

Compilar y correr build:

```bash
npm run build
npm start
```

## Tests

```bash
npm test
```

## Endpoints implementados

- `GET /libros`
- `GET /libros/:id`
- `POST /libros`
- `DELETE /libros/:id`
- `POST /ejemplares`
- `GET /ejemplares/libro/:id_libro`
- `POST /estudiantes`
- `GET /estudiantes`
- `GET /estudiantes/:id`
- `PUT /estudiantes/:id`
- `DELETE /estudiantes/:id`
- `POST /prestamos`
- `GET /prestamos`
- `GET /prestamos/:id`
- `GET /prestamos/estudiante/:id_estudiante`
- `PUT /prestamos/:id`
- `DELETE /prestamos/:id`
- `POST /devoluciones`
- `GET /devoluciones/:id`
- `POST /solicitudes`
- `GET /solicitudes`

## Reglas de negocio aplicadas

- RN1: Limite de prestamos activos por tipo de estudiante (pregrado 3, posgrado 5).
- RN2: Plazo de devolucion por tipo de libro (alta demanda 3 dias, normal 15 dias).
- RN3: Bloqueo de nuevos prestamos con prestamos vencidos o multas pendientes.
- RN4: Bloqueo de renovacion cuando existen solicitudes pendientes de otros estudiantes.

## Variables de entorno

Copiar `.env.example` a `.env` y ajustar si hace falta:

- `PORT=3000`
- `BIBLIOTECA_DB_PATH=./data/biblioteca.sqlite`
