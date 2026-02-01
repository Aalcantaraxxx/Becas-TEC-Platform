// backend/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Definimos la ruta POST
router.post('/check-user', authController.registroSilencioso);

module.exports = router;