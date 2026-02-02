const express = require('express');
const router = express.Router();
const { pool } = require('../config/db'); // Usamos el pool para queries complejas
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_gratitud_tec_2026';

// Middleware para verificar el Token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'Token requerido' });

    try {
        const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;
        const decoded = jwt.verify(cleanToken, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token inválido' });
    }
};

// --- GET: DATOS DEL DASHBOARD (/me) ---
router.get('/me', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Datos Personales
        const [users] = await pool.query(
            "SELECT id, first_name, last_name, email, phone, created_at FROM users WHERE id = ?", 
            [userId]
        );
        
        if (users.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
        const user = users[0];

        // 2. Estadísticas (Total Donado y Cantidad de Becas/Donaciones)
        // Solo contamos las que tienen status 'paid'
        const [stats] = await pool.query(
            "SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total FROM donations WHERE user_id = ? AND status = 'paid'",
            [userId]
        );

        // 3. Datos Fiscales (Si ya guardó alguno)
        // Hacemos JOIN con addresses y states para traer la dirección completa
        const [fiscal] = await pool.query(`
            SELECT fp.rfc, fp.razon_social, fp.regime_code, fp.cfdi_usage_code,
                   a.street, a.ext_num, a.int_num, a.colonia, a.zip_code, a.city,
                   s.name as state_name
            FROM fiscal_profiles fp
            LEFT JOIN addresses a ON fp.address_id = a.id
            LEFT JOIN states s ON a.state_id = s.id
            WHERE fp.user_id = ? LIMIT 1
        `, [userId]);

        // 4. Historial de Donaciones (Últimas 10)
        const [history] = await pool.query(
            "SELECT uuid, amount, status, created_at FROM donations WHERE user_id = ? ORDER BY created_at DESC LIMIT 10",
            [userId]
        );

        // Armamos la respuesta JSON final
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
            fiscal: fiscal[0] || null, // Enviamos null si no tiene datos fiscales aún
            history: history
        });

    } catch (error) {
        console.error("Error obteniendo perfil:", error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

module.exports = router;