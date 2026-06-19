const express = require('express');
const router = express.Router();
const pool = require('../db');
const verifyToken = require('../middleware/authMiddleware');

// GET /api/cotisations/mes-membres
router.get('/mes-membres', verifyToken, async (req, res) => {
  try {
    const collecteurId = req.user.id;

    const result = await pool.query(`
      SELECT m.id, m.nom, m.prenom, m.solde,
        CASE WHEN c.id IS NOT NULL THEN true ELSE false END AS cotise_aujourd_hui
      FROM membres m
      LEFT JOIN cotisations c 
        ON c.membre_id = m.id 
        AND DATE(c.date_cotisation) = CURRENT_DATE
      WHERE m.collecteur_id = $1
    `, [collecteurId]);

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// POST /api/cotisations/valider/:membreId
router.post('/valider/:membreId', verifyToken, async (req, res) => {
  try {
    const { membreId } = req.params;

    // Créer la cotisation
    await pool.query(`
      INSERT INTO cotisations (membre_id, montant, date_cotisation, statut)
      VALUES ($1, (SELECT montant_cotisation FROM membres WHERE id = $1), NOW(), 'validé')
    `, [membreId]);

    // Mettre à jour le solde
    await pool.query(`
      UPDATE membres 
      SET solde = solde + montant_cotisation 
      WHERE id = $1
    `, [membreId]);

    res.json({ message: 'Cotisation validée avec succès ✅' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;