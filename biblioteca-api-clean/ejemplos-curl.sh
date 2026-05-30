#!/bin/bash

# Script de prueba para API de Gestión de Biblioteca
# Ejecutar: bash ejemplos-curl.sh

BASE_URL="http://localhost:3001"

echo "=========================================="
echo "API de Gestión de Biblioteca - Curls Ejemplo"
echo "=========================================="
echo ""

# ==========================================
# 1. CREAR LIBROS
# ==========================================
echo "1. CREAR LIBROS"
echo "---"

curl -X POST "$BASE_URL/libros" \
  -H "Content-Type: application/json" \
  -d '{"id":"L001","titulo":"Algoritmos Computacionales","autor":"Donald Knuth","ubicacion_sala":"Sala A","tipo":"normal"}' \
  | jq .

echo ""

curl -X POST "$BASE_URL/libros" \
  -H "Content-Type: application/json" \
  -d '{"id":"L002","titulo":"Estructuras de Datos","autor":"Mark Allen Weiss","ubicacion_sala":"Sala B","tipo":"alta_demanda"}' \
  | jq .

echo ""

curl -X POST "$BASE_URL/libros" \
  -H "Content-Type: application/json" \
  -d '{"id":"L003","titulo":"Python Avanzado","autor":"Luciano Ramalho","ubicacion_sala":"Sala C","tipo":"normal"}' \
  | jq .

echo ""

# ==========================================
# 2. LISTAR LIBROS
# ==========================================
echo "2. LISTAR TODOS LOS LIBROS"
echo "---"

curl -X GET "$BASE_URL/libros" \
  -H "Content-Type: application/json" \
  | jq .

echo ""

# ==========================================
# 3. CREAR ESTUDIANTES
# ==========================================
echo "3. CREAR ESTUDIANTES"
echo "---"

curl -X POST "$BASE_URL/estudiantes" \
  -H "Content-Type: application/json" \
  -d '{"id":"EST001","progAcademico":"Ingeniería en Sistemas","semestre":3,"tipo":"pregrado"}' \
  | jq .

echo ""

curl -X POST "$BASE_URL/estudiantes" \
  -H "Content-Type: application/json" \
  -d '{"id":"EST002","progAcademico":"Maestría en Ciencias Computacionales","semestre":1,"tipo":"posgrado"}' \
  | jq .

echo ""

curl -X POST "$BASE_URL/estudiantes" \
  -H "Content-Type: application/json" \
  -d '{"id":"EST003","progAcademico":"Ingeniería Civil","semestre":5,"tipo":"pregrado"}' \
  | jq .

echo ""

# ==========================================
# 4. LISTAR ESTUDIANTES
# ==========================================
echo "4. LISTAR TODOS LOS ESTUDIANTES"
echo "---"

curl -X GET "$BASE_URL/estudiantes" \
  -H "Content-Type: application/json" \
  | jq .

echo ""

# ==========================================
# 5. CREAR EJEMPLARES
# ==========================================
echo "5. CREAR EJEMPLARES"
echo "---"

curl -X POST "$BASE_URL/ejemplares" \
  -H "Content-Type: application/json" \
  -d '{"id":"EJ001","idLibro":"L001"}' \
  | jq .

echo ""

curl -X POST "$BASE_URL/ejemplares" \
  -H "Content-Type: application/json" \
  -d '{"id":"EJ002","idLibro":"L001"}' \
  | jq .

echo ""

curl -X POST "$BASE_URL/ejemplares" \
  -H "Content-Type: application/json" \
  -d '{"id":"EJ003","idLibro":"L002"}' \
  | jq .

echo ""

curl -X POST "$BASE_URL/ejemplares" \
  -H "Content-Type: application/json" \
  -d '{"id":"EJ004","idLibro":"L003"}' \
  | jq .

echo ""

# ==========================================
# 6. LISTAR TODOS LOS EJEMPLARES
# ==========================================
echo "6. LISTAR TODOS LOS EJEMPLARES"
echo "---"

curl -X GET "$BASE_URL/ejemplares" \
  -H "Content-Type: application/json" \
  | jq .

echo ""

# ==========================================
# 7. LISTAR EJEMPLARES POR LIBRO
# ==========================================
echo "7. LISTAR EJEMPLARES DEL LIBRO L001"
echo "---"

curl -X GET "$BASE_URL/ejemplares/libro/L001" \
  -H "Content-Type: application/json" \
  | jq .

echo ""

# ==========================================
# 8. CREAR PRÉSTAMOS
# ==========================================
echo "8. CREAR PRÉSTAMOS"
echo "---"

curl -X POST "$BASE_URL/prestamos" \
  -H "Content-Type: application/json" \
  -d '{"id":"PRES001","estudiante_id":"EST001","ejemplar_id":"EJ001","fecha_prestamo":"2026-05-20T00:00:00.000Z"}' \
  | jq .

echo ""

curl -X POST "$BASE_URL/prestamos" \
  -H "Content-Type: application/json" \
  -d '{"id":"PRES002","estudiante_id":"EST002","ejemplar_id":"EJ003","fecha_prestamo":"2026-05-25T00:00:00.000Z"}' \
  | jq .

echo ""

curl -X POST "$BASE_URL/prestamos" \
  -H "Content-Type: application/json" \
  -d '{"id":"PRES003","estudiante_id":"EST003","ejemplar_id":"EJ004","fecha_prestamo":"2026-05-18T00:00:00.000Z"}' \
  | jq .

echo ""

# ==========================================
# 9. LISTAR TODOS LOS PRÉSTAMOS
# ==========================================
echo "9. LISTAR TODOS LOS PRÉSTAMOS"
echo "---"

curl -X GET "$BASE_URL/prestamos" \
  -H "Content-Type: application/json" \
  | jq .

echo ""

# ==========================================
# 10. OBTENER PRÉSTAMO POR ID
# ==========================================
echo "10. OBTENER PRÉSTAMO PRES001"
echo "---"

curl -X GET "$BASE_URL/prestamos/PRES001" \
  -H "Content-Type: application/json" \
  | jq .

echo ""

# ==========================================
# 11. LISTAR PRÉSTAMOS POR ESTUDIANTE
# ==========================================
echo "11. LISTAR PRÉSTAMOS DEL ESTUDIANTE EST001"
echo "---"

curl -X GET "$BASE_URL/prestamos/estudiante/EST001" \
  -H "Content-Type: application/json" \
  | jq .

echo ""

# ==========================================
# 12. CREAR SOLICITUDES
# ==========================================
echo "12. CREAR SOLICITUDES"
echo "---"

curl -X POST "$BASE_URL/solicitudes" \
  -H "Content-Type: application/json" \
  -d '{"estudiante_id":"EST001","prestamo_id":"PRES002"}' \
  | jq .

echo ""

curl -X POST "$BASE_URL/solicitudes" \
  -H "Content-Type: application/json" \
  -d '{"estudiante_id":"EST003","prestamo_id":"PRES001"}' \
  | jq .

echo ""

# ==========================================
# 13. LISTAR SOLICITUDES
# ==========================================
echo "13. LISTAR TODAS LAS SOLICITUDES"
echo "---"

curl -X GET "$BASE_URL/solicitudes" \
  -H "Content-Type: application/json" \
  | jq .

echo ""

# ==========================================
# 14. REGISTRAR DEVOLUCIONES
# ==========================================
echo "14. REGISTRAR DEVOLUCIONES"
echo "---"

curl -X POST "$BASE_URL/devoluciones" \
  -H "Content-Type: application/json" \
  -d '{"id":"DEV001","prestamo_id":"PRES001","fecha_devolucion":"2026-06-01T00:00:00.000Z"}' \
  | jq .

echo ""

curl -X POST "$BASE_URL/devoluciones" \
  -H "Content-Type: application/json" \
  -d '{"id":"DEV002","prestamo_id":"PRES003","fecha_devolucion":"2026-06-02T00:00:00.000Z"}' \
  | jq .

echo ""

# ==========================================
# 15. OBTENER DEVOLUCIÓN
# ==========================================
echo "15. OBTENER DEVOLUCIÓN DEV001"
echo "---"

curl -X GET "$BASE_URL/devoluciones/DEV001" \
  -H "Content-Type: application/json" \
  | jq .

echo ""

# ==========================================
# 16. RENOVAR PRÉSTAMO
# ==========================================
echo "16. RENOVAR PRÉSTAMO PRES002"
echo "---"

curl -X PUT "$BASE_URL/prestamos/PRES002" \
  -H "Content-Type: application/json" \
  -d '{"fecha_devolucion_nueva":"2026-06-15T00:00:00.000Z"}' \
  | jq .

echo ""

# ==========================================
# 17. HEALTH CHECK
# ==========================================
echo "17. HEALTH CHECK"
echo "---"

curl -X GET "$BASE_URL/health" \
  -H "Content-Type: application/json" \
  | jq .

echo ""

echo "=========================================="
echo "Pruebas completadas"
echo "=========================================="
