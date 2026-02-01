const User = require('../models/User');

exports.registroSilencioso = async (req, res) => {
    try {
        const { email, nombre, apellido } = req.body;

        console.log("🔍 Procesando usuario:", email);

        // 1. Intento buscarlo primero (Camino feliz)
        let usuario = await User.findOne({ where: { email } });

        if (usuario) {
            console.log("✅ Usuario encontrado (ID):", usuario.id);
            return res.json({ 
                success: true, 
                isNew: false, 
                userId: usuario.id,
                message: "Usuario existente reconocido." 
            });
        }

        // 2. Si no existe, intento crearlo protegido contra "Race Conditions"
        try {
            usuario = await User.create({
                email,
                first_name: nombre || "Donante",
                last_name: apellido || "Anónimo",
                role_id: 2, // Donante
                password_hash: "$2a$12$simulado_temporal_hash_seguro", 
                phone: "0000000000"
            });

            console.log("🆕 Cuenta creada exitosamente (ID):", usuario.id);
            return res.json({ 
                success: true, 
                isNew: true, 
                userId: usuario.id,
                message: "Cuenta creada automáticamente." 
            });

        } catch (createError) {
            // 🚨 AQUÍ ESTÁ EL TRUCO DE SEGURIDAD 🚨
            // Si falla porque "ya existe" (UniqueConstraintError), no explotamos.
            // Simplemente lo buscamos de nuevo y lo devolvemos.
            if (createError.name === 'SequelizeUniqueConstraintError') {
                console.log("⚠️ Colisión detectada: El usuario se creó milisegundos antes. Recuperándolo...");
                usuario = await User.findOne({ where: { email } });
                
                return res.json({ 
                    success: true, 
                    isNew: false, 
                    userId: usuario.id,
                    message: "Usuario recuperado tras colisión." 
                });
            }

            // Si es otro error, entonces sí lo mostramos
            throw createError;
        }

    } catch (error) {
        console.error("❌ Error grave en registro:", error);
        res.status(500).json({ error: "Error interno del servidor", detalle: error.message });
    }
};