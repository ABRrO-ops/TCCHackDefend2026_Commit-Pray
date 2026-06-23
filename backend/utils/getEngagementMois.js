const pool = require('../db');
// Retourne le montant journalier du mois en cours pour un membre, ou null s'il n'a pas 
async function getEngagementMoisActuel(membreId) {
    const result = await pool.query(` 
SELECT montant_journalier FROM engagements_mensuels 
WHERE membre_id = $1 
AND mois = EXTRACT(MONTH FROM CURRENT_DATE) 
AND annee = EXTRACT(YEAR FROM CURRENT_DATE) 
`, [membreId]);
    return result.rows.length > 0 ? result.rows[0].montant_journalier : null;
}
// Crée l'engagement du mois si pas encore fait (1ère cotisation du mois) 
async function creerEngagementMois(membreId, montant) {
    await pool.query(` 
INSERT INTO engagements_mensuels (membre_id, mois, annee, montant_journalier) 
VALUES ($1, EXTRACT(MONTH FROM CURRENT_DATE), EXTRACT(YEAR FROM 
CURRENT_DATE), $2) 
`, [membreId, montant]);
}
module.exports = { getEngagementMoisActuel, creerEngagementMois };
