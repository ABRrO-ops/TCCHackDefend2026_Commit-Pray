const pool = require('../db');
async function genererEmailInterne(prenom, nom, domaineEmail) {
    let base = `${prenom.toLowerCase()}.${nom.toLowerCase()}`;
    let email = `${base}@${domaineEmail}.cotipay.tg`;
    let compteur = 1;
    while (true) {
        const result = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) break;
        compteur++;
        email = `${base}${compteur}@${domaineEmail}.cotipay.tg`;
    }
    return email;
}
module.exports = { genererEmailInterne };