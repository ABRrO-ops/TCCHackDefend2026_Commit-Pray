const express = require('express');
const router = express.Router();
const pool = require('../db'); // ton fichier de connexion PostgreSQL
const verifyToken = require('../middleware/authMiddleware');
const { getEngagementMoisActuel, creerEngagementMois } = require('../utils/getEngagementMois');
const { moisEstComplet } = require('../utils/verifierMoisComplet'); // PARTIE 5

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

// GET /api/membres/mon-engagement
router.get('/mon-engagement', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const membreRes = await pool.query('SELECT id FROM membres WHERE user_id = $1', [userId]);
    if (membreRes.rows.length === 0) {
      return res.status(404).json({ error: 'Profil membre introuvable' });
    }
    const membreId = membreRes.rows[0].id;
    const montant = await getEngagementMoisActuel(membreId);
    res.json({ engagementExiste: montant !== null, montant: montant });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/membres/cotiser
router.post('/cotiser', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { mode_paiement, montant_choisi } = req.body;
    const membreRes = await pool.query('SELECT id FROM membres WHERE user_id = $1', [userId]);
    if (membreRes.rows.length === 0) {
      return res.status(404).json({ error: 'Profil membre introuvable' });
    }
    const membreId = membreRes.rows[0].id;
    const dejaFait = await pool.query(`
      SELECT id FROM cotisations
      WHERE membre_id = $1 AND date_cotisation = CURRENT_DATE
    `, [membreId]);
    if (dejaFait.rows.length > 0) {
      return res.status(400).json({ error: 'Vous avez déjà cotisé aujourd\'hui' });
    }
    let montant = await getEngagementMoisActuel(membreId);
    if (montant === null) {
      if (!montant_choisi || montant_choisi <= 0) {
        return res.status(400).json({ error: 'Vous devez choisir un montant pour ce mois', besoinMontant: true });
      }
      await creerEngagementMois(membreId, montant_choisi);
      montant = montant_choisi;
    }
    await pool.query(`
      INSERT INTO cotisations (membre_id, montant, date_cotisation, statut, initiee_par, mode_paiement)
      VALUES ($1, $2, CURRENT_DATE, 'attente', 'membre', $3)
    `, [membreId, montant, mode_paiement]);
    res.json({ message: 'Cotisation envoyée, en attente de validation par votre collecteur', montant });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/membres/peut-retirer
router.get('/peut-retirer', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const membreRes = await pool.query('SELECT id, solde FROM membres WHERE user_id = $1', [userId]);
    if (membreRes.rows.length === 0) {
      return res.status(404).json({ error: 'Profil membre introuvable' });
    }
    const membreId = membreRes.rows[0].id;
    const solde = membreRes.rows[0].solde;
    const complet = await moisEstComplet(membreId);
    res.json({ peutRetirer: complet, solde });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/membres/demande-retrait
router.post('/demande-retrait', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { montant, mode_paiement } = req.body;
    const membreRes = await pool.query('SELECT id, solde FROM membres WHERE user_id = $1', [userId]);
    if (membreRes.rows.length === 0) {
      return res.status(404).json({ error: 'Profil membre introuvable' });
    }
    const membreId = membreRes.rows[0].id;
    const solde = membreRes.rows[0].solde;
    const complet = await moisEstComplet(membreId);
    if (!complet) {
      return res.status(403).json({ error: 'Vous devez compléter toutes vos cotisations de ce mois avant de pouvoir retirer' });
    }
    if (montant > solde) {
      return res.status(400).json({ error: 'Montant supérieur à votre solde disponible' });
    }
    await pool.query(`
      INSERT INTO demandes_retrait (membre_id, montant, mode_paiement, statut)
      VALUES ($1, $2, $3, 'en_attente')
    `, [membreId, montant, mode_paiement]);
    res.json({ message: 'Demande de retrait envoyée, en attente de validation' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/membres/mes-retraits
router.get('/mes-retraits', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const membreRes = await pool.query('SELECT id FROM membres WHERE user_id = $1', [userId]);
    if (membreRes.rows.length === 0) {
      return res.status(404).json({ error: 'Profil membre introuvable' });
    }
    const membreId = membreRes.rows[0].id;
    const result = await pool.query(`
      SELECT id, montant, mode_paiement, statut, motif_rejet, created_at, traite_le
      FROM demandes_retrait
      WHERE membre_id = $1
      ORDER BY created_at DESC
    `, [membreId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;