require('dotenv').config();
const mysql = require('mysql2');

console.log("🚀 Iniciando prueba de conexión...");
console.log(`📡 Host: ${process.env.DB_HOST}`);

// Configuración explícita para MySQL 8 en Easypanel
const connection = mysql.createConnection({
    host: process.env.DB_HOST, // Asegúrate que sea la IP: 95.217.0.13
    port: process.env.DB_PORT, // 3377
    user: process.env.DB_USER, // admin
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    
    // ESTAS DOS LÍNEAS SON OBLIGATORIAS:
    ssl: {
        rejectUnauthorized: false // Aceptamos el certificado self-signed del servidor
    },
    // Esto es para que MySQL no pida la contraseña encriptada vieja
    // Si mysql2 está bien instalado, NO debería dar error en esta línea.
    allowPublicKeyRetrieval: true 
});

connection.connect((err) => {
    if (err) {
        console.error('❌ ERROR FATAL:', err.code);
        console.error('Mensaje:', err.message);
        return;
    }
    console.log('✅ ¡CONEXIÓN EXITOSA! (El handshake funcionó)');
    connection.end();
});