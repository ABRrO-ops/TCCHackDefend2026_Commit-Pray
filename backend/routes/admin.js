const express = require('express');
const router = express.Router();
const pool = require('../db');
const verifyToken = require('../middleware/authMiddleware');

// Middleware vérification rôle admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès refusé - Admin uniquement' });
  }
  next();
};

// GET /api/admin/stats
router.get('/stats', verifyToken, isAdmin, async (req, res) => {
  try {
    const totalMembres = await pool.query('SELECT COUNT(*) FROM membres');
    
    const cotisationsAujourdhui = await pool.query(`
      SELECT COUNT(*) FROM cotisations 
      WHERE DATE(date_cotisation) = CURRENT_DATE
    `);

    const totalCollecteAujourdhui = await pool.query(`
      SELECT COALESCE(SUM(montant), 0) as total 
      FROM cotisations 
      WHERE DATE(date_cotisation) = CURRENT_DATE
    `);

    res.json({
      total_membres: totalMembres.rows[0].count,
      cotisations_aujourd_hui: cotisationsAujourdhui.rows[0].count,
      total_collecte_aujourd_hui: totalCollecteAujourdhui.rows[0].total
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
      SELECT m.nom, m.prenom, c.montant, c.statut, c.date_cotisation
      FROM cotisations c
      JOIN membres m ON m.id = c.membre_id
      WHERE DATE(c.date_cotisation) = CURRENT_DATE
      ORDER BY c.date_cotisation DESC
    `);

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;