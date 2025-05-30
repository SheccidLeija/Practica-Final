require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const sql = require('mssql');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const auth = require('./middleware/auth');

const app = express();

// Middleware
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*'
}));
app.use(express.json());

// Servir archivos estáticos desde el directorio raíz
app.use(express.static(path.join(__dirname)));

// Configuración de la base de datos
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: true
    }
};

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Ruta principal
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Sapitos App</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background-color: #f0f2f5;
                }
                .container {
                    background: white;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    text-align: center;
                }
                h1 {
                    color: #1a73e8;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>¡Bienvenido a Sapitos!</h1>
                <p>La aplicación está funcionando correctamente.</p>
            </div>
        </body>
        </html>
    `);
});

// Ruta de API
app.get('/api', (req, res) => {
    res.json({ 
        message: 'Backend de Sapitos funcionando correctamente!',
        status: 'active',
        version: '1.0.0'
    });
});

// Ruta para probar la conexión a la base de datos
app.get('/test-db', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const result = await sql.query('SELECT 1 as test');
        res.json({ message: 'Conexión a la base de datos exitosa', data: result.recordset });
    } catch (err) {
        res.status(500).json({ message: 'Error conectando a la base de datos', error: err.message });
    } finally {
        sql.close();
    }
});

// Rutas API aquí
app.get('/api/test', (req, res) => {
    res.json({ message: 'API funcionando correctamente' });
});

// Routes
app.use('/api/auth', authRoutes);

// Protected route example
app.get('/api/protected', auth, (req, res) => {
  res.json({ message: 'This is a protected route', userId: req.userId });
});

// Todas las demás rutas sirven index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Puerto dinámico para Azure o 3000 para desarrollo local
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 