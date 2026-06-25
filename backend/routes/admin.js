const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../db');
const verifyToken = require('../middleware/authMiddleware');
const { genererEmailInterne } = require('../utils/genererEmail');

// Middleware de vérification du rôle Admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès refusé - Admin uniquement' });
  }
  next();
};

// POST /api/admin/collecteurs 
router.post('/collecteurs', verifyToken, isAdmin, async (req, res) => {
  try {
    const { nom, prenom } = req.body;
    const adminId = req.user.id;
    const adminInfo = await pool.query('SELECT microfinance_id FROM users WHERE id = $1', [adminId]);
    const microfinanceId = adminInfo.rows[0].microfinance_id;
    const mf = await pool.query('SELECT domaine_email FROM microfinances WHERE id = $1', [microfinanceId]);
    const domaineEmail = mf.rows[0].domaine_email;
    const email = await genererEmailInterne(prenom, nom, domaineEmail);
    const motDePasseTemp = Math.random().toString(36).slice(-8);
    const hash = await bcrypt.hash(motDePasseTemp, 10);
    await pool.query(` 
      INSERT INTO users (nom, prenom, email, mot_de_passe, role, microfinance_id) 
      VALUES ($1, $2, $3, $4, 'collecteur', $5) 
    `, [nom, prenom, email, hash, microfinanceId]);
    res.json({ message: 'Collecteur créé', email, motDePasseTemp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// POST /api/admin/membres 
router.post('/membres', verifyToken, isAdmin, async (req, res) => {
  try {
    const { nom, prenom, collecteur_id } = req.body;
    const adminId = req.user.id;
    const adminInfo = await pool.query('SELECT microfinance_id FROM users WHERE id = $1', [adminId]);
    const microfinanceId = adminInfo.rows[0].microfinance_id;
    const mf = await pool.query('SELECT domaine_email FROM microfinances WHERE id = $1', [microfinanceId]);
    const domaineEmail = mf.rows[0].domaine_email;
    const email = await genererEmailInterne(prenom, nom, domaineEmail);
    const motDePasseTemp = Math.random().toString(36).slice(-8);
    const hash = await bcrypt.hash(motDePasseTemp, 10);
    const newUser = await pool.query(` 
      INSERT INTO users (nom, prenom, email, mot_de_passe, role, microfinance_id) 
      VALUES ($1, $2, $3, $4, 'membre', $5) 
      RETURNING id 
    `, [nom, prenom, email, hash, microfinanceId]);
    await pool.query(` 
      INSERT INTO membres (user_id, solde, collecteur_id) 
      VALUES ($1, 0, $2) 
    `, [newUser.rows[0].id, collecteur_id]);
    res.json({ message: 'Membre créé', email, motDePasseTemp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET /api/admin/stats
router.get('/stats', verifyToken, isAdmin, async (req, res) => {
  try {
    const totalMembres = await pool.query('SELECT COUNT(*) FROM membres');
    const cotisationsAujourdhui = await pool.query(`
      SELECT COUNT(*) FROM cotisations 
      WHERE DATE(date_cotisation) = CURRENT_DATE AND statut = 'valide'
    `);
    const totalCollecte = await pool.query(`
      SELECT COALESCE(SUM(montant), 0) as total 
      FROM cotisations 
      WHERE DATE(date_cotisation) = CURRENT_DATE AND statut = 'valide'
    `);

    res.json({
      totalMembres: parseInt(totalMembres.rows[0].count),
      cotisationsAujourdhui: parseInt(cotisationsAujourdhui.rows[0].count),
      totalCollecte: parseFloat(totalCollecte.rows[0].total)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET /api/admin/cotisations/today
router.get('/cotisations/today', verifyToken, isAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.nom, u.prenom, c.montant, c.statut, c.heure_validation
      FROM cotisations c
      JOIN membres m ON m.id = c.membre_id
      JOIN users u ON u.id = m.user_id
      WHERE DATE(c.date_cotisation) = CURRENT_DATE
      ORDER BY c.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
