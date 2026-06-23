const express = require('express');
const router = express.Router();
const pool = require('../db');
const verifyToken = require('../middleware/authMiddleware');

// GET /api/cotisations/mes-membres
router.get('/mes-membres', verifyToken, async (req, res) => {
  try {
    const collecteurId = req.user.id;

    const result = await pool.query(`
      SELECT m.id, u.nom, u.prenom, m.montant_cotisation, m.solde,
        c.statut, c.heure_validation, c.initiee_par
      FROM membres m
      JOIN users u ON m.user_id = u.id
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

    const cotisationEnAttente = await pool.query(`
      SELECT id FROM cotisations
      WHERE membre_id = $1 AND date_cotisation = CURRENT_DATE AND statut = 'attente'
    `, [membreId]);

    if (cotisationEnAttente.rows.length === 0) {
      await pool.query(`
        INSERT INTO cotisations (membre_id, montant, date_cotisation, statut, initiee_par, heure_validation)
        VALUES ($1, (SELECT montant_cotisation FROM membres WHERE id = $1), CURRENT_DATE, 'valide', 'collecteur', NOW())
      `, [membreId]);
    } else {
      await pool.query(`
        UPDATE cotisations SET statut = 'valide', heure_validation = NOW()
        WHERE id = $1
      `, [cotisationEnAttente.rows[0].id]);
    }

    await pool.query(`
      UPDATE membres SET solde = solde + montant_cotisation WHERE id = $1
    `, [membreId]);

    res.json({ message: 'Cotisation validée avec succès ✅' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;