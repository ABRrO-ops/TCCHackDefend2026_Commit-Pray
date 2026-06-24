require('dotenv').config(); // ✅ DOIT ÊTRE EN HAUT

console.log("TEST ENV:", process.env.TEST);

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const cotisationsRoutes = require('./routes/cotisations');
const adminRoutes = require('./routes/admin');
const membresRoutes = require('./routes/membres');

const app = express();

// ✅ Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/membres', membresRoutes);
app.use('/api/cotisations', cotisationsRoutes);
app.use('/api/admin', adminRoutes);

// ✅ Test route
app.get('/', (req, res) => {
  res.send('CotiPay API fonctionne ✅');
});

// ✅ Serveur
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
