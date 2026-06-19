
CREATE TABLE microfinances (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    ville VARCHAR(50) NOT NULL,
    telephone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'collecteur', 'membre')) NOT NULL,
    microfinance_id INTEGER REFERENCES microfinances(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE membres (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    montant_cotisation NUMERIC(10,2) DEFAULT 0,
    solde NUMERIC(10,2) DEFAULT 0,
    collecteur_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE cotisations (
    id SERIAL PRIMARY KEY,
    membre_id INTEGER REFERENCES membres(id) ON DELETE CASCADE,
    montant NUMERIC(10,2) NOT NULL,
    statut VARCHAR(20) CHECK (statut IN ('attente', 'valide')) DEFAULT 'attente',
    date_cotisation DATE DEFAULT CURRENT_DATE,
    heure_validation TIMESTAMP,
    collecteur_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);