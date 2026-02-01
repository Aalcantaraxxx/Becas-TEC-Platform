const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise'); // 👈 Necesario para el Pool
require('dotenv').config();

// 1. CONFIGURACIÓN SEQUELIZE (Para Modelos futuros)
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST, 
        port: process.env.DB_PORT, 
        dialect: 'mysql',
        logging: false,
        dialectOptions: {
            ssl: {
                require: true, 
                rejectUnauthorized: false 
            }
        },
        define: { timestamps: false },
        pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
    }
);

// 2. CONFIGURACIÓN POOL NATIVO (Para server.js y consultas directas)
// Esto es lo que necesita el código del checkout para funcionar
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false // Clave para tu conexión remota
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const connectDB = async () => {
    try {
        // Probamos ambas conexiones
        await sequelize.authenticate();
        // Probamos el pool con una consulta simple
        await pool.query('SELECT 1');
        console.log('✅ Base de Datos Conectada (Sequelize + Pool) 🚀');
    } catch (error) {
        console.error('❌ Error de Conexión:', error.message);
    }
};

// 👇 EXPORTAMOS AMBOS: 'pool' para server.js y 'sequelize' para modelos
module.exports = { sequelize, connectDB, pool };