# Routes API CotiPay 
## Membre 
- GET /api/membres/mon-compte 
- GET /api/membres/mon-engagement 
- POST /api/membres/cotiser 
- GET /api/membres/peut-retirer 
- POST /api/membres/demande-retrait 
- GET /api/membres/mes-retraits 
## Admin - GET /api/admin/stats 
- GET /api/admin/cotisations/today 
- POST /api/admin/collecteurs 
- POST /api/admin/membres 
- POST /api/admin/retraits/valider/:id 
- POST /api/admin/retraits/rejeter/:id 
- GET /api/admin/retraits/en-attente 
- GET /api/admin/export/cotisations?debut=...&fin=... 
## Inscription 
- POST /api/inscription/demande (publique) 
- GET /api/inscription/demandes 
- POST /api/inscription/valider/:id 
- POST /api/inscription/rejeter/:id 