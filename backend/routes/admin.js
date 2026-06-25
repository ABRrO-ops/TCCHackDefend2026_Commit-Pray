// 1. IMPORTS ET INITIALISATION (Toujours tout en haut)
const express = require('express');
const router = express.Router();
const pool = require('../db');
const verifyToken = require('../middleware/authMiddleware');
const createCsvWriter = require('csv-writer').createObjectCsvStringifier;

// 2. MIDDLEWARES
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès refusé - Admin uniquement' });
  }
  next();
};

// 3. ROUTES
// GET /api/admin/export/cotisations?debut=2026-06-01&fin=2026-06-30 
router.get('/export/cotisations', verifyToken, isAdmin, async (req, res) => {
  try {
    const { debut, fin } = req.query;

    const result = await pool.query(` 
      SELECT u.nom, u.prenom, c.montant, c.statut, c.mode_paiement, c.date_cotisation, 
c.heure_validation 
      FROM cotisations c 
      JOIN membres m ON m.id = c.membre_id 
      JOIN users u ON u.id = m.user_id 
      WHERE c.date_cotisation BETWEEN $1 AND $2 
      ORDER BY c.date_cotisation 
    `, [debut, fin]);

    const csvWriter = createCsvWriter({
      header: [
        { id: 'nom', title: 'Nom' },
        { id: 'prenom', title: 'Prénom' },
        { id: 'montant', title: 'Montant' },
        { id: 'statut', title: 'Statut' },
        { id: 'mode_paiement', title: 'Mode de paiement' },
        { id: 'date_cotisation', title: 'Date' },
      ]
    });

    const csvHeader = csvWriter.getHeaderString();
    const csvBody = csvWriter.stringifyRecords(result.rows);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=export_cotisations.csv');
    res.send(csvHeader + csvBody);

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

// 4. EXPORT (Tout en bas)
module.exports = router;
