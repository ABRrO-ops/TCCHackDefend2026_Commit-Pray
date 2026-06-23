const pool = require('../db');
async function moisEstComplet(membreId) {
    const result = await pool.query(` 
SELECT date_cotisation, statut 
FROM cotisations 
WHERE membre_id = $1 
AND DATE_TRUNC('month', date_cotisation) = DATE_TRUNC('month', 
CURRENT_DATE) 
AND statut = 'valide' 
`, [membreId]);
    const joursValides = new Set(
        result.rows.map(r => new Date(r.date_cotisation).getDate())
    );
    const aujourdhui = new Date().getDate();
    for (let jour = 1; jour <= aujourdhui; jour++) {
        if (!joursValides.has(jour)) {
            return false;
        }
    }
    return true;
}
module.exports = { moisEstComplet };
