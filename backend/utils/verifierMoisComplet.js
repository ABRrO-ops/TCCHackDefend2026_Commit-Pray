const pool = require('../db');

// Vérifie si le membre a cotisé tous les jours ouvrés requis ce mois-ci
// (logique simple ici : on vérifie qu'il a au moins une cotisation validée par jour
// pendant le mois en cours, comparé au nombre de jours écoulés)
async function moisEstComplet(membreId) {
  const result = await pool.query(`
    SELECT COUNT(*) AS nb_cotisations
    FROM cotisations
    WHERE membre_id = $1
      AND statut = 'valide'
      AND EXTRACT(MONTH FROM date_cotisation) = EXTRACT(MONTH FROM CURRENT_DATE)
      AND EXTRACT(YEAR FROM date_cotisation) = EXTRACT(YEAR FROM CURRENT_DATE)
  `, [membreId]);

  const nbCotisations = parseInt(result.rows[0].nb_cotisations, 10);
  const jourDuMois = new Date().getDate();

  // Le mois est considéré "complet" si le membre a cotisé chaque jour écoulé du mois
  return nbCotisations >= jourDuMois;
}

module.exports = { moisEstComplet };