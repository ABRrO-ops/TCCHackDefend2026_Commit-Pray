const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const verifyToken = require('../middleware/authMiddleware');
const { genererEmailInterne } = require('../utils/genererEmail');

// POST /api/inscription/demande (PUBLIQUE, pas de token)
router.post('/demande', async (req, res) => {
  try {
    const { nom_microfinance, ville, telephone, numero_agrement, nom_directeur, prenom_directeur, email_directeur, plan_choisi } = req.body;

    await pool.query(`
      INSERT INTO demandes_inscription
      (nom_microfinance, ville, telephone, numero_agrement, nom_directeur, prenom_directeur, email_directeur, plan_choisi, statut)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'en_attente')
    `, [nom_microfinance, ville, telephone, numero_agrement, nom_directeur, prenom_directeur, email_directeur, plan_choisi]);

    res.json({ message: 'Demande envoyée, en cours d\'examen' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/inscription/demandes (back-office, protégé)
router.get('/demandes', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM demandes_inscription WHERE statut = 'en_attente' ORDER BY created_at ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/inscription/valider/:id (back-office)
router.post('/valider/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const demande = await pool.query('SELECT * FROM demandes_inscription WHERE id = $1', [id]);
    if (demande.rows.length === 0) {
      return res.status(404).json({ error: 'Demande introuvable' });
    }
    const d = demande.rows[0];

    const domaineEmail = d.nom_microfinance.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '');

    const microfinance = await pool.query(`
      INSERT INTO microfinances (nom, ville, telephone, statut, plan, domaine_email)
      VALUES ($1, $2, $3, 'active', $4, $5)
      RETURNING id
    `, [d.nom_microfinance, d.ville, d.telephone, d.plan_choisi, domaineEmail]);

    const microfinanceId = microfinance.rows[0].id;

    const emailGenere = await genererEmailInterne(d.prenom_directeur, d.nom_directeur, domaineEmail);
    const motDePasseTemp = Math.random().toString(36).slice(-8);
    const hash = await bcrypt.hash(motDePasseTemp, 10);

    await pool.query(`
      INSERT INTO users (nom, prenom, email, mot_de_passe, role, microfinance_id)
      VALUES ($1, $2, $3, $4, 'admin', $5)
    `, [d.nom_directeur, d.prenom_directeur, emailGenere, hash, microfinanceId]);

    await pool.query(`UPDATE demandes_inscription SET statut = 'validee' WHERE id = $1`, [id]);

    res.json({
      message: 'Micro-finance activée',
      emailGenere,
      motDePasseTemp,
      emailContact: d.email_directeur
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/inscription/rejeter/:id
router.post('/rejeter/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`UPDATE demandes_inscription SET statut = 'rejetee' WHERE id = $1`, [id]);
    res.json({ message: 'Demande rejetée' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;