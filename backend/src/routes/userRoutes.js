const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const jwt = require('jsonwebtoken');

// Middleware simple para verificar token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send('Token requerido');
    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).send('Token inválido');
    }
};

// OBTENER PERFIL COMPLETO (Dashboard)
router.get('/me', verifyToken, async (req, res) => {
    try {
        // 1. Datos básicos
        const [users] = await pool.query('SELECT id, first_name, last_name, email, phone, created_at FROM users WHERE id = ?', [req.user.id]);
        const user = users[0];

        // 2. Estadísticas de Donación (Suma real)
        const [stats] = await pool.query(
            "SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total FROM donations WHERE user_id = ? AND status = 'paid'", 
            [req.user.id]
        );

        // 3. Datos Fiscales (Si existen)
        const [fiscal] = await pool.query(
            `SELECT fp.*, a.street, a.ext_num, a.int_num, a.zip_code, a.colonia, s.name as state_name 
             FROM fiscal_profiles fp 
             LEFT JOIN addresses a ON fp.address_id = a.id
             LEFT JOIN states s ON a.state_id = s.id
             WHERE fp.user_id = ? LIMIT 1`,
            [req.user.id]
        );

        // 4. Historial Reciente
        const [history] = await pool.query(
            "SELECT uuid, amount, status, created_at FROM donations WHERE user_id = ? ORDER BY created_at DESC LIMIT 5",
            [req.user.id]
        );

        res.json({
            user: {
                ...user,
                initials: (user.first_name[0] + user.last_name[0]).toUpperCase(),
                joined: new Date(user.created_at).toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })
            },
            stats: {
                totalDonated: parseFloat(stats[0].total),
                donationsCount: stats[0].count
            },
            fiscal: fiscal[0] || null,
            history
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error obteniendo perfil' });
    }
});

module.exports = router;