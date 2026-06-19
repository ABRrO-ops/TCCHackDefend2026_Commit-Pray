const express = require('express');
const router = express.Router();
const pool = require('../db'); // ton fichier de connexion PostgreSQL
const { verifyToken } = require('../middleware/auth'); // PARTIE 5

// GET /api/membres/mon-compte
router.get('/mon-compte', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id; // récupéré du token JWT par verifyToken
        const role = req.user.role;

        // Sécurité : que les membres peuvent voir leur compte
        if (role !== 'membre') {
            return res.status(403).json({ error: 'Accès réservé aux membres' });
        }

        // 1. Récupérer solde + infos membre
        const membreQuery = `
            SELECT m.id, m.solde, m.montant_cotisation, u.nom, u.prenom
            FROM membres m
            JOIN users u ON m.user_id = u.id
            WHERE m.user_id = $1
        `;
        const membreRes = await pool.query(membreQuery, [userId]);

        if (membreRes.rows.length === 0) {
            return res.status(404).json({ error: 'Profil membre introuvable' });
        }

        // 2. Récupérer 30 dernières cotisations
        const cotisQuery = `
            SELECT id, montant, statut, date_cotisation, heure_validation, created_at
            FROM cotisations
            WHERE membre_id = $1
            ORDER BY created_at DESC
            LIMIT 30
        `;
        const cotisRes = await pool.query(cotisQuery, [membreRes.rows[0].id]);

        res.json({
            membre: membreRes.rows[0],
            cotisations: cotisRes.rows
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router;