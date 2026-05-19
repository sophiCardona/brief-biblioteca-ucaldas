const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Crear/conectar a la base de datos en la carpeta del proyecto
const dbPath = path.join(__dirname, '../../biblioteca.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar a la BD:', err.message);
    process.exit(1);
  }
  console.log('✓ Conectado a SQLite:', dbPath);
});

// Habilitar foreign keys
db.run('PRAGMA foreign_keys = ON');

module.exports = db;
