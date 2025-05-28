require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const sql = require('mssql');
const app = express();

// Middleware
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*'
}));
app.use(express.json());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, 'public')));

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

// Todas las rutas no manejadas servirán el index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Puerto dinámico para Azure o 3000 para desarrollo local
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
}); 