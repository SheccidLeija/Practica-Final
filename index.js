require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sql = require('mssql');
const path = require('path');
const app = express();

// Middleware
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*'
}));
app.use(express.json());
app.use(express.static('public'));

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

// Ruta principal que sirve el HTML
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sapitos - Backend</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                background: #f0f0f0;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
            }
            .container {
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                max-width: 600px;
                width: 100%;
            }
            h1 {
                color: #333;
                margin-bottom: 20px;
            }
            .status {
                padding: 15px;
                background: #e8f5e9;
                border-radius: 5px;
                margin-bottom: 20px;
            }
            .endpoints {
                background: #f5f5f5;
                padding: 15px;
                border-radius: 5px;
            }
            .endpoint {
                margin-bottom: 10px;
            }
            .success {
                color: #2e7d32;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Backend de Sapitos</h1>
            <div class="status">
                <h2 class="success">✅ Servidor Activo</h2>
                <p>El servidor está funcionando correctamente.</p>
            </div>
            <div class="endpoints">
                <h3>Endpoints disponibles:</h3>
                <div class="endpoint">
                    <strong>GET /</strong> - Página principal
                </div>
                <div class="endpoint">
                    <strong>GET /api</strong> - Información de la API
                </div>
                <div class="endpoint">
                    <strong>GET /test-db</strong> - Prueba de conexión a la base de datos
                </div>
            </div>
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

// Puerto dinámico para Azure o 3000 para desarrollo local
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
}); 