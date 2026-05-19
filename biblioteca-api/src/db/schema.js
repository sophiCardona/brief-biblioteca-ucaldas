const db = require('./connection');

const initSchema = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Tabla de libros
      db.run(
        `CREATE TABLE IF NOT EXISTS books (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          author TEXT NOT NULL,
          totalCopies INTEGER NOT NULL DEFAULT 1,
          availableCopies INTEGER NOT NULL DEFAULT 1,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        (err) => {
          if (err) reject(err);
          console.log('✓ Tabla "books" creada/verificada');
        }
      );

      // Tabla de préstamos
      db.run(
        `CREATE TABLE IF NOT EXISTS loans (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          bookId INTEGER NOT NULL,
          borrower TEXT NOT NULL,
          loanDate DATETIME DEFAULT CURRENT_TIMESTAMP,
          returnDate DATETIME,
          returned BOOLEAN DEFAULT 0,
          FOREIGN KEY(bookId) REFERENCES books(id)
        )`,
        (err) => {
          if (err) reject(err);
          console.log('✓ Tabla "loans" creada/verificada');
        }
      );

      // Insertar datos de prueba si la tabla está vacía
      db.get('SELECT COUNT(*) as count FROM books', (err, row) => {
        if (err) {
          reject(err);
        } else if (row.count === 0) {
          const seedData = [
            ['Estructuras de Datos', 'Juan Pérez', 3, 3],
            ['Algoritmos', 'María Gómez', 2, 2],
            ['Bases de Datos', 'Ana Ruiz', 1, 1]
          ];

          let inserted = 0;
          seedData.forEach((book) => {
            db.run(
              'INSERT INTO books (title, author, totalCopies, availableCopies) VALUES (?, ?, ?, ?)',
              book,
              (err) => {
                if (err) reject(err);
                inserted++;
                if (inserted === seedData.length) {
                  console.log('✓ Datos iniciales insertados');
                  resolve();
                }
              }
            );
          });
        } else {
          console.log(`✓ Base de datos ya tiene ${row.count} libros`);
          resolve();
        }
      });
    });
  });
};

module.exports = { initSchema };
