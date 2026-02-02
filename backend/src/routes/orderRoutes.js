// backend/src/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { pool } = require('../config/db'); // Usamos el pool para consultas directas

router.get('/:uuid', async (req, res) => {
    const { uuid } = req.params;

    try {
        // 1. Buscamos la donación y los datos del donante
        // Hacemos JOIN con users para sacar nombre y correo
        const [donations] = await pool.query(
            `SELECT d.id, d.uuid, d.amount, d.created_at, d.status,
                    u.first_name, u.last_name, u.email
             FROM donations d
             JOIN users u ON d.user_id = u.id
             WHERE d.uuid = ?`, 
            [uuid]
        );

        if (donations.length === 0) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }

        const donation = donations[0];

        // 2. Buscamos los certificados asociados a esa donación (para llenar los "items")
        const [certificates] = await pool.query(
            `SELECT recipient_name, dedication 
             FROM issued_certificates 
             WHERE donation_id = ?`,
            [donation.id]
        );

        // 3. Reconstruimos el objeto EXACTO como lo espera tu Frontend (ThankYouPage)
        const orderData = {
            order_id: donation.uuid,
            total_amount: parseFloat(donation.amount),
            created_at: donation.created_at,
            status: donation.status,
            donor_info: {
                name: `${donation.first_name} ${donation.last_name}`,
                email: donation.email
            },
            // Mapeamos los certificados como items para que el PDF se genere bien
            items: certificates.length > 0 ? certificates.map(cert => ({
                name: cert.recipient_name,
                dedication: cert.dedication,
                price: parseFloat(donation.amount) / certificates.length // Precio prorrateado visual
            })) : [{ name: "Donación General", price: parseFloat(donation.amount) }]
        };

        res.json(orderData);

    } catch (error) {
        console.error("Error al recuperar orden:", error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;