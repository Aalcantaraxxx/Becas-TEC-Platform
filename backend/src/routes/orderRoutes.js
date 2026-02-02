const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/:uuid', async (req, res) => {
    try {
        // Buscar la donación por UUID
        const [rows] = await pool.query(
            `SELECT d.*, u.first_name, u.email 
             FROM donations d 
             JOIN users u ON d.user_id = u.id 
             WHERE d.uuid = ?`, 
            [req.params.uuid]
        );

        if (rows.length === 0) return res.status(404).json({ message: 'Orden no encontrada' });

        const donation = rows[0];

        // Reconstruir el objeto "order" que espera tu frontend
        // NOTA: Aquí deberías recuperar también los certificados (issued_certificates)
        // Estoy simplificando para que coincida con tu estructura básica
        const orderData = {
            order_id: donation.uuid,
            total_amount: parseFloat(donation.amount),
            created_at: donation.created_at,
            donor_info: {
                name: donation.first_name,
                email: donation.email
            },
            // Aquí simulo items, pero deberías hacer un JOIN con issued_certificates
            items: [{ name: "Donación", price: parseFloat(donation.amount) }] 
        };

        res.json(orderData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error servidor' });
    }
});

module.exports = router;