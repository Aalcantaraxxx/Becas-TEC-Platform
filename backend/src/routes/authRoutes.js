const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Importamos tu modelo Sequelize

// Clave secreta para firmar tokens (En producción pon esto en .env)
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_gratitud_tec_2026';

// --- 1. REGISTRO (SIGNUP) ---
router.post('/register', async (req, res) => {
    const { firstName, lastName, email, phone, password } = req.body;

    try {
        // A) Verificar si ya existe el correo
        const existingUser = await User.findOne({ where: { email } });
        
        if (existingUser) {
            return res.status(400).json({ message: 'El correo ya está registrado.' });
        }

        // B) Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // C) Crear usuario en DB
        const newUser = await User.create({
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: phone,
            password_hash: passwordHash,
            role_id: 2 // 2 = Donante
        });

        // D) Generar Token
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email, role: newUser.role_id }, 
            JWT_SECRET, 
            { expiresIn: '7d' }
        );

        // E) Responder al Frontend
        res.status(201).json({
            token,
            user: {
                id: newUser.id,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                email: newUser.email,
                initials: (newUser.first_name[0] + newUser.last_name[0]).toUpperCase()
            }
        });

    } catch (error) {
        console.error("Error en Registro:", error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

// --- 2. INICIAR SESIÓN (LOGIN) ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // A) Buscar usuario
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Credenciales inválidas.' });
        }

        // B) Verificar contraseña
        // OJO: Si el usuario fue creado automáticamente por una donación, su password es 'hash_temporal_seguro'
        // Esto fallará el compare, lo cual es correcto (debe registrarse o recuperar contraseña)
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciales inválidas.' });
        }

        // C) Generar Token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role_id }, 
            JWT_SECRET, 
            { expiresIn: '7d' }
        );

        // D) Responder
        res.json({
            token,
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                initials: (user.first_name[0] + user.last_name[0]).toUpperCase()
            }
        });

    } catch (error) {
        console.error("Error en Login:", error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

module.exports = router;