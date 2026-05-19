const db = require('../db/connection');

class BookModel {
  // Obtener todos los libros
  static getAllBooks() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM books ORDER BY id ASC', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // Obtener libro por ID
  static getBookById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM books WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  // Crear nuevo libro
  static createBook(title, author, totalCopies = 1) {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO books (title, author, totalCopies, availableCopies) VALUES (?, ?, ?, ?)',
        [title, author, totalCopies, totalCopies],
        function (err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  // Actualizar copias disponibles
  static updateAvailableCopies(bookId, newAvailable) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE books SET availableCopies = ? WHERE id = ?',
        [newAvailable, bookId],
        (err) => {
          if (err) reject(err);
          else resolve(true);
        }
      );
    });
  }

  // Decrementar copias disponibles (cuando se presta)
  static decrementCopies(bookId) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE books SET availableCopies = availableCopies - 1 WHERE id = ?',
        [bookId],
        (err) => {
          if (err) reject(err);
          else resolve(true);
        }
      );
    });
  }

  // Incrementar copias disponibles (cuando se devuelve)
  static incrementCopies(bookId) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE books SET availableCopies = availableCopies + 1 WHERE id = ?',
        [bookId],
        (err) => {
          if (err) reject(err);
          else resolve(true);
        }
      );
    });
  }
}

module.exports = BookModel;
