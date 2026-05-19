const express = require('express');
const app = express();
app.use(express.json());

const books = [
  { id: 1, title: 'Estructuras de Datos', author: 'Juan Pérez', totalCopies: 3, availableCopies: 3 },
  { id: 2, title: 'Algoritmos', author: 'María Gómez', totalCopies: 2, availableCopies: 2 },
  { id: 3, title: 'Bases de Datos', author: 'Ana Ruiz', totalCopies: 1, availableCopies: 1 }
];

let loans = [];
let nextLoanId = 1;

// Listar libros
app.get('/books', (req, res) => {
  res.json(books);
});

// Obtener libro por id
app.get('/books/:id', (req, res) => {
  const id = Number(req.params.id);
  const book = books.find(b => b.id === id);
  if (!book) return res.status(404).json({ error: 'Libro no encontrado' });
  res.json(book);
});

// Crear préstamo
app.post('/loans', (req, res) => {
  const { bookId, borrower } = req.body;
  if (!bookId || !borrower) return res.status(400).json({ error: 'Falta bookId o borrower' });
  const book = books.find(b => b.id === Number(bookId));
  if (!book) return res.status(404).json({ error: 'Libro no encontrado' });
  if (book.availableCopies <= 0) return res.status(400).json({ error: 'No hay copias disponibles' });
  // no se cumple la primer restriccion simmplemente crea el prestamo, no se valida si el usuario ya tiene prestamos.
  const loan = {
    id: nextLoanId++,
    bookId: book.id,
    borrower,
    loanDate: new Date().toISOString(),
    returned: false,
    returnDate: null
  };
  loans.push(loan);
  book.availableCopies -= 1;
  res.status(201).json(loan);
});

// Devolver libro
app.post('/returns/:loanId', (req, res) => {
  const loanId = Number(req.params.loanId);
  const loan = loans.find(l => l.id === loanId);
  if (!loan) return res.status(404).json({ error: 'Préstamo no encontrado' });
  if (loan.returned) return res.status(400).json({ error: 'Préstamo ya fue devuelto' });

  loan.returned = true;
  loan.returnDate = new Date().toISOString();
  const book = books.find(b => b.id === loan.bookId);
  if (book) book.availableCopies += 1;
  res.json(loan);
});

// Listar préstamos vigentes
app.get('/loans/active', (req, res) => {
  const active = loans.filter(l => !l.returned).map(l => ({
    ...l,
    book: books.find(b => b.id === l.bookId) || null
  }));
  res.json(active);
});

// Listar todos los préstamos
app.get('/loans', (req, res) => {
  const all = loans.map(l => ({
    ...l,
    book: books.find(b => b.id === l.bookId) || null
  }));
  res.json(all);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Biblioteca API escuchando en puerto ${PORT}`));
