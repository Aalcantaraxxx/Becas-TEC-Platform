require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto'); // 👈 Necesario para generar UUIDs de orden
const { connectDB, pool } = require('./src/config/db.js'); // 👈 Importamos pool para consultas directas
const authRoutes = require('./src/routes/authRoutes.js');

// 👇 IMPORTAMOS EL SERVICIO DE CORREOS
const { sendDonorConfirmation, sendBeneficiaryNotification, sendInvoiceRequestNotification } = require('./src/services/emailService.js');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Conectar a Base de Datos
connectDB();

// 2. Middleware
app.use(cors());
app.use(express.json());

// 3. Rutas de Autenticación
app.use('/api/auth', authRoutes);

// 4. RUTA DE PROCESAMIENTO DE DONACIONES
app.post('/api/donations/process', async (req, res) => {
    // ⬇️ MODIFICACIÓN 1: Agregamos 'design' al destructuring para recibir la dedicatoria
    const { donor_email, donor_name, total_amount, items, fiscal_data, design } = req.body;

    // Limpieza básica de datos
    const email = donor_email.trim().toLowerCase();
    const amount = parseFloat(total_amount);

    try {
        // A) BUSCAR O CREAR USUARIO (Lógica Intacta)
        let [users] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
        let userId;

        if (users.length > 0) {
            userId = users[0].id;
        } else {
            // SI NO EXISTE: Lo creamos automáticamente
            const [newUser] = await pool.query(
                "INSERT INTO users (email, first_name, last_name, role_id, password_hash, phone) VALUES (?, ?, '', 2, 'hash_temporal_seguro', '0000000000')",
                [email, donor_name]
            );
            userId = newUser.insertId;
        }

        // B) VERIFICAR LÍMITE MENSUAL ($250,000) (Lógica Intacta)
        const date = new Date();
        const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().slice(0, 19).replace('T', ' ');

        const [rows] = await pool.query(
            `SELECT SUM(amount) as total 
             FROM donations 
             WHERE user_id = ? 
             AND created_at >= ? 
             AND status = 'paid'`,
            [userId, firstDayOfMonth]
        );

        const currentMonthlyTotal = parseFloat(rows[0].total || 0);
        const newTotal = currentMonthlyTotal + amount;

        // Validación de tope mensual
        if (newTotal > 250000) {
            return res.status(400).json({
                error: true,
                message: `⚠️ Límite Excedido: Has donado $${currentMonthlyTotal.toLocaleString()} este mes. Solo puedes donar $${(250000 - currentMonthlyTotal).toLocaleString()} más.`
            });
        }

        // C) REGISTRAR LA DONACIÓN EN DB (Lógica Intacta)
        const orderUuid = crypto.randomUUID(); 
        
        await pool.query(
            "INSERT INTO donations (uuid, user_id, cause_id, amount, status, payment_method, created_at) VALUES (?, ?, 1, ?, 'paid', 'Stripe CC', NOW())",
            [orderUuid, userId, amount]
        );

        console.log(`✅ Donación registrada con éxito. Order ID: ${orderUuid}`);

        // --- D) DISPARAR CORREOS (Lógica Mejorada) ---
        
        // 1. Correo al Donante (Confirmación) - Se mantiene igual
        sendDonorConfirmation(email, donor_name, amount, orderUuid);

        // ⬇️ MODIFICACIÓN 2: Extraemos la dedicatoria para enviarla al beneficiario
        const dedicationMessage = design?.dedication || "Gracias por tu esfuerzo y dedicación.";

        // 2. Correos a los Beneficiarios (Recorremos la lista)
        if (items && Array.isArray(items)) {
            items.forEach(item => {
                if (item.email && item.name) {
                    // Pasamos la dedicatoria real a la función
                    sendBeneficiaryNotification(item.email, item.name, donor_name, dedicationMessage);
                }
            });
        }

        // 3. Aviso de CFDI (Si el usuario pidió factura)
        if (fiscal_data) {
            // ⬇️ MODIFICACIÓN 3: Pasamos monto y ID para llenar la factura simulada
            sendInvoiceRequestNotification(email, fiscal_data, amount, orderUuid);
        }
        // ----------------------------------------------------

        // ¡Éxito! Respondemos al Frontend
        return res.json({ success: true, order_id: orderUuid });

    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ error: true, message: "Error interno procesando la donación" });
    }
});

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ message: "API Backend de Gratitud Tec funcionando al 100% 🚀" });
});

// 5. Arrancar servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});