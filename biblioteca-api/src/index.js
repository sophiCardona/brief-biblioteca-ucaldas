const express = require('express');
const BookModel = require('./models/bookModel');
const LoanModel = require('./models/loanModel');
const { initSchema } = require('./db/schema');

const app = express();
app.use(express.json());

// ==================== ENDPOINTS DE LIBROS ====================

// Listar todos los libros
app.get('/books', async (req, res) => {
  try {
    const books = await BookModel.getAllBooks();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener libros', details: err.message });
  }
});

// Obtener libro por ID
app.get('/books/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const book = await BookModel.getBookById(id);
    if (!book) return res.status(404).json({ error: 'Libro no encontrado' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener libro', details: err.message });
  }
});

// Crear nuevo libro (endpoint adicional para administración)
app.post('/books', async (req, res) => {
  try {
    const { title, author, totalCopies } = req.body;
    if (!title || !author) {
      return res.status(400).json({ error: 'Falta title o author' });
    }
    const bookId = await BookModel.createBook(title, author, totalCopies || 1);
    const book = await BookModel.getBookById(bookId);
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear libro', details: err.message });
  }
});

// ==================== ENDPOINTS DE PRÉSTAMOS ====================

// Listar todos los préstamos
app.get('/loans', async (req, res) => {
  try {
    const loans = await LoanModel.getAllLoans();
    res.json(loans);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener préstamos', details: err.message });
  }
});

// Listar préstamos activos
app.get('/loans/active', async (req, res) => {
  try {
    const loans = await LoanModel.getActiveLoans();
    res.json(loans);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener préstamos activos', details: err.message });
  }
});

// Crear nuevo préstamo
app.post('/loans', async (req, res) => {
  try {
    const { bookId, borrower } = req.body;

    // Validaciones
    if (!bookId || !borrower) {
      return res.status(400).json({ error: 'Falta bookId o borrower' });
    }

    // Verificar que el libro existe
    const book = await BookModel.getBookById(Number(bookId));
    if (!book) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }

    // Verificar que hay copias disponibles
    if (book.availableCopies <= 0) {
      return res.status(400).json({ error: 'No hay copias disponibles' });
    }

    // Crear préstamo
    const loanId = await LoanModel.createLoan(book.id, borrower);
    
    // Decrementar copias disponibles
    await BookModel.decrementCopies(book.id);

    // Retornar el préstamo creado
    const loan = await LoanModel.getLoanById(loanId);
    res.status(201).json(loan);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear préstamo', details: err.message });
  }
});

// Devolver libro
app.post('/returns/:loanId', async (req, res) => {
  try {
    const loanId = Number(req.params.loanId);
    
    // Obtener préstamo
    const loan = await LoanModel.getLoanById(loanId);
    if (!loan) {
      return res.status(404).json({ error: 'Préstamo no encontrado' });
    }

    // Verificar que no fue devuelto ya
    if (loan.returned) {
      return res.status(400).json({ error: 'Préstamo ya fue devuelto' });
    }

    // Marcar como devuelto
    await LoanModel.markAsReturned(loanId);
    
    // Incrementar copias disponibles
    await BookModel.incrementCopies(loan.bookId);

    // Retornar préstamo actualizado
    const updatedLoan = await LoanModel.getLoanById(loanId);
    res.json(updatedLoan);
  } catch (err) {
    res.status(500).json({ error: 'Error al devolver préstamo', details: err.message });
  }
});

// ==================== INICIALIZACIÓN ====================

const PORT = process.env.PORT || 3000;

// Inicializar BD y luego iniciar servidor
initSchema()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\n✓ Biblioteca API escuchando en puerto ${PORT}`);
      console.log(`✓ Endpoints disponibles:`);
      console.log(`  GET    /books`);
      console.log(`  GET    /books/:id`);
      console.log(`  POST   /books`);
      console.log(`  GET    /loans`);
      console.log(`  GET    /loans/active`);
      console.log(`  POST   /loans`);
      console.log(`  POST   /returns/:loanId\n`);
    });
  })
  .catch(err => {
    console.error('Error inicializando BD:', err);
    process.exit(1);
  });
