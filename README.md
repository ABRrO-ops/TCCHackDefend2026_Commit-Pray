
# CotiPay 
> Plateforme de digitalisation des tontines et micro-finances au Togo

CotiPay remplace le carnet papier des tontines par une application web complète.
Les membres cotisent via mobile money, les collecteurs valident en 1 clic, et les
micro-finances suivent tout en temps réel depuis un dashboard. Plus de carnet perdu,
plus de litige, zéro frais supplémentaires pour le membre.

---

##  Problématique & Track

**Track : FinTech — Paiement mobile & inclusion financière**

Au Togo, des milliers de membres de micro-finances gèrent leurs cotisations
journalières via des carnets papier confiés à des collecteurs physiques.
CotiPay digitalise ce processus de bout en bout en remplaçant le carnet
par une plateforme web accessible depuis n'importe quel navigateur.

---

##  Prérequis

- Node.js v18+
- npm v9+
- PostgreSQL v17+
- Git
- Navigateur web moderne (Chrome, Firefox, Edge)

---

##  Installation

### 1. Cloner le projet
```bash
git clone https://github.com/ABRrO-ops/TCCHackDefend2026_Commit-Pray.git
cd TCCHackDefend2026_Commit-Pray
```

### 2. Configurer la base de données
```bash
psql -U postgres -h 127.0.0.1 -c "CREATE DATABASE cotipay;"
psql -U postgres -h 127.0.0.1 -d cotipay -f database/schema.sql
```

### 3. Configurer le backend
```bash
cd backend
npm install
cp .env.example .env
```
Ouvrir le fichier `.env` et remplir les variables :

```
PORT=5000
JWT_SECRET=cotipay_secret_2026
DB_USER=postgres
DB_HOST=127.0.0.1
DB_NAME=cotipay
DB_PASSWORD=votre_mot_de_passe_postgres
DB_PORT=5432

```

### 4. Configurer le frontend
```bash
cd ../frontend
npm install
```

---

##  Lancement

Ouvrir **2 terminaux** :

**Terminal 1 — Backend :**
```bash
cd backend
node server.js
```
→ Doit afficher : `Serveur démarré sur le port 5000` + `Connecté à PostgreSQL `

**Terminal 2 — Frontend :**
```bash
cd frontend
npm run dev
```
→ Ouvrir http://localhost:5173 dans le navigateur

---

##  Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@cotipay.tg | admin123 |
| Collecteur | agent@cotipay.tg | admin123 |
| Membre 1 | membre@cotipay.tg | admin123 |
| Membre 2 | kofi@cotipay.tg | admin123 |
| Membre 3 | adjoavi@cotipay.tg | admin123 |

---

##  Réinitialiser les données de test

Si les cotisations du jour ont déjà été validées, exécutez ces commandes
pour réinitialiser avant de tester :

```sql
-- Supprimer les cotisations du jour
DELETE FROM cotisations WHERE date_cotisation = CURRENT_DATE;

-- Remettre les soldes initiaux
UPDATE membres SET solde = 12000 WHERE id = 1;
UPDATE membres SET solde = 25000 WHERE id = 2;
UPDATE membres SET solde = 8000 WHERE id = 3;
```

Les boutons "Valider" réapparaîtront chez le collecteur.

---

##  Équipe — Commit & Pray

| Nom | Rôle |
|-----|------|
| BAWA Abdoul-Madjid | Chef de projet + Frontend React |
| ABE Romain |Base de données + Authentification | 
| DJONGON Amen Alice | Backend Node.js + API REST |
|  TCHAO Essodezame Ramia| UI/UX + Livrables |

---

##  Stack Technique

| Partie | Technologie |
|--------|------------|
| Frontend | React.js + Tailwind CSS |
| Backend | Node.js + Express.js |
| Base de données | PostgreSQL |
| Authentification | JWT |

---

*TCC Hack & Defend 2026 — #TCCHackDefend2026*

