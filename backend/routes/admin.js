const express = require('express');
const router = express.Router();
const pool = require('../db');
const verifyToken = require('../middleware/authMiddleware');

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