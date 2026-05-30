# Curls Individuales - API Biblioteca

## LIBROS

### Crear un libro (normal)
```bash
curl -X POST http://localhost:3001/libros \
  -H "Content-Type: application/json" \
  -d '{"id":"L001","titulo":"Algoritmos Computacionales","autor":"Donald Knuth","ubicacion_sala":"Sala A","tipo":"normal"}'
```

### Crear un libro (alta demanda)
```bash
curl -X POST http://localhost:3001/libros \
  -H "Content-Type: application/json" \
  -d '{"id":"L002","titulo":"Estructuras de Datos","autor":"Mark Allen Weiss","ubicacion_sala":"Sala B","tipo":"alta_demanda"}'
```

### Listar todos los libros
```bash
curl -X GET http://localhost:3001/libros \
  -H "Content-Type: application/json"
```

### Obtener un libro por ID
```bash
curl -X GET http://localhost:3001/libros/L001 \
  -H "Content-Type: application/json"
```

### Eliminar un libro
```bash
curl -X DELETE http://localhost:3001/libros/L001 \
  -H "Content-Type: application/json"
```

---

## ESTUDIANTES

### Crear un estudiante pregrado
```bash
curl -X POST http://localhost:3001/estudiantes \
  -H "Content-Type: application/json" \
  -d '{"id":"EST001","progAcademico":"Ingeniería en Sistemas","semestre":3,"tipo":"pregrado"}'
```

### Crear un estudiante posgrado
```bash
curl -X POST http://localhost:3001/estudiantes \
  -H "Content-Type: application/json" \
  -d '{"id":"EST002","progAcademico":"Maestría en Ciencias","semestre":1,"tipo":"posgrado"}'
```

### Listar todos los estudiantes
```bash
curl -X GET http://localhost:3001/estudiantes \
  -H "Content-Type: application/json"
```

### Obtener un estudiante por ID
```bash
curl -X GET http://localhost:3001/estudiantes/EST001 \
  -H "Content-Type: application/json"
```

### Actualizar un estudiante
```bash
curl -X PUT http://localhost:3001/estudiantes/EST001 \
  -H "Content-Type: application/json" \
  -d '{"semestre":4,"progAcademico":"Ingeniería en Sistemas"}'
```

### Eliminar un estudiante
```bash
curl -X DELETE http://localhost:3001/estudiantes/EST001 \
  -H "Content-Type: application/json"
```

---

## EJEMPLARES

### Crear un ejemplar
```bash
curl -X POST http://localhost:3001/ejemplares \
  -H "Content-Type: application/json" \
  -d '{"id":"EJ001","idLibro":"L001"}'
```

### Listar todos los ejemplares (NUEVO ENDPOINT)
```bash
curl -X GET http://localhost:3001/ejemplares \
  -H "Content-Type: application/json"
```

### Listar ejemplares de un libro
```bash
curl -X GET http://localhost:3001/ejemplares/libro/L001 \
  -H "Content-Type: application/json"
```

---

## PRÉSTAMOS

### Crear un préstamo (libro normal - 15 días)
```bash
curl -X POST http://localhost:3001/prestamos \
  -H "Content-Type: application/json" \
  -d '{"id":"PRES001","estudiante_id":"EST001","ejemplar_id":"EJ001","fecha_prestamo":"2026-05-20T00:00:00.000Z"}'
```

### Crear un préstamo (alta demanda - 3 días)
```bash
curl -X POST http://localhost:3001/prestamos \
  -H "Content-Type: application/json" \
  -d '{"id":"PRES002","estudiante_id":"EST002","ejemplar_id":"EJ002","fecha_prestamo":"2026-05-25T00:00:00.000Z"}'
```

### Listar todos los préstamos
```bash
curl -X GET http://localhost:3001/prestamos \
  -H "Content-Type: application/json"
```

### Obtener un préstamo por ID
```bash
curl -X GET http://localhost:3001/prestamos/PRES001 \
  -H "Content-Type: application/json"
```

### Listar préstamos de un estudiante
```bash
curl -X GET http://localhost:3001/prestamos/estudiante/EST001 \
  -H "Content-Type: application/json"
```

### Renovar un préstamo
```bash
curl -X PUT http://localhost:3001/prestamos/PRES001 \
  -H "Content-Type: application/json" \
  -d '{"fecha_devolucion_nueva":"2026-06-15T00:00:00.000Z"}'
```

### Eliminar un préstamo
```bash
curl -X DELETE http://localhost:3001/prestamos/PRES001 \
  -H "Content-Type: application/json"
```

---

## DEVOLUCIONES

### Registrar una devolución
```bash
curl -X POST http://localhost:3001/devoluciones \
  -H "Content-Type: application/json" \
  -d '{"id":"DEV001","prestamo_id":"PRES001","fecha_devolucion":"2026-06-01T00:00:00.000Z"}'
```

### Obtener una devolución
```bash
curl -X GET http://localhost:3001/devoluciones/DEV001 \
  -H "Content-Type: application/json"
```

---

## SOLICITUDES

### Crear una solicitud (un estudiante solicita un préstamo de otro)
```bash
curl -X POST http://localhost:3001/solicitudes \
  -H "Content-Type: application/json" \
  -d '{"estudiante_id":"EST001","prestamo_id":"PRES002"}'
```

### Listar todas las solicitudes
```bash
curl -X GET http://localhost:3001/solicitudes \
  -H "Content-Type: application/json"
```

---

## HEALTH CHECK

### Verificar que la API está funcionando
```bash
curl -X GET http://localhost:3001/health \
  -H "Content-Type: application/json"
```

---

## NOTAS IMPORTANTES

1. **Fechas**: Usar formato ISO 8601: `YYYY-MM-DDTHH:mm:ss.000Z`
2. **Tipo de libro**: `normal` (15 días) o `alta_demanda` (3 días)
3. **Tipo de estudiante**: `pregrado` (máx 3 préstamos) o `posgrado` (máx 5 préstamos)
4. **Estado de préstamo**: `activo`, `vencido`, `devuelto`
5. **Límites de préstamos**:
   - Estudiantes pregrado: máximo 3 préstamos activos
   - Estudiantes posgrado: máximo 5 préstamos activos
6. **Validaciones**:
   - No se pueden hacer préstamos si hay préstamos vencidos o multas pendientes
   - Un ejemplar no puede estar prestado dos veces simultáneamente
   - No se puede renovar un préstamo si hay solicitudes de otros estudiantes pendientes
