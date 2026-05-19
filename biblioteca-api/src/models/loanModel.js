const db = require('../db/connection');

class LoanModel {
  // Obtener todos los préstamos
  static getAllLoans() {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT 
          l.id, l.bookId, l.borrower, l.loanDate, l.returnDate, l.returned,
          b.title, b.author
        FROM loans l
        JOIN books b ON l.bookId = b.id
        ORDER BY l.id DESC`,
        (err, rows) => {
          if (err) reject(err);
          else {
            // Transformar para mantener compatibilidad con API anterior
            const formatted = rows.map(row => ({
              id: row.id,
              bookId: row.bookId,
              borrower: row.borrower,
              loanDate: row.loanDate,
              returnDate: row.returnDate,
              returned: Boolean(row.returned),
              book: {
                id: row.bookId,
                title: row.title,
                author: row.author
              }
            }));
            resolve(formatted);
          }
        }
      );
    });
  }

  // Obtener préstamos activos (no devueltos)
  static getActiveLoans() {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT 
          l.id, l.bookId, l.borrower, l.loanDate, l.returnDate, l.returned,
          b.title, b.author
        FROM loans l
        JOIN books b ON l.bookId = b.id
        WHERE l.returned = 0
        ORDER BY l.id DESC`,
        (err, rows) => {
          if (err) reject(err);
          else {
            const formatted = rows.map(row => ({
              id: row.id,
              bookId: row.bookId,
              borrower: row.borrower,
              loanDate: row.loanDate,
              returnDate: row.returnDate,
              returned: Boolean(row.returned),
              book: {
                id: row.bookId,
                title: row.title,
                author: row.author
              }
            }));
            resolve(formatted);
          }
        }
      );
    });
  }

  // Obtener préstamo por ID
  static getLoanById(id) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT 
          l.id, l.bookId, l.borrower, l.loanDate, l.returnDate, l.returned,
          b.title, b.author
        FROM loans l
        JOIN books b ON l.bookId = b.id
        WHERE l.id = ?`,
        [id],
        (err, row) => {
          if (err) reject(err);
          else {
            if (row) {
              resolve({
                id: row.id,
                bookId: row.bookId,
                borrower: row.borrower,
                loanDate: row.loanDate,
                returnDate: row.returnDate,
                returned: Boolean(row.returned),
                book: {
                  id: row.bookId,
                  title: row.title,
                  author: row.author
                }
              });
            } else {
              resolve(null);
            }
          }
        }
      );
    });
  }

  // Crear nuevo préstamo
  static createLoan(bookId, borrower) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO loans (bookId, borrower, loanDate, returned) 
         VALUES (?, ?, datetime('now'), 0)`,
        [bookId, borrower],
        function (err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  // Marcar préstamo como devuelto
  static markAsReturned(loanId) {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE loans 
         SET returned = 1, returnDate = datetime('now') 
         WHERE id = ?`,
        [loanId],
        (err) => {
          if (err) reject(err);
          else resolve(true);
        }
      );
    });
  }

  // Verificar si un libro está disponible (no tiene préstamos activos)
  static isBookAvailable(bookId) {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT COUNT(*) as activeLoans FROM loans WHERE bookId = ? AND returned = 0',
        [bookId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row.activeLoans === 0);
        }
      );
    });
  }
}

module.exports = LoanModel;
