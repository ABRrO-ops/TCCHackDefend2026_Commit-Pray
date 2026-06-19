require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const cotisationsRoutes = require('./routes/cotisations');
const adminRoutes = require('./routes/admin');
const membresRoutes = require('./routes/membres');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/membres', membresRoutes);
app.get('/', (req, res) => {
  res.send('CotiPay API fonctionne');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cotisations', cotisationsRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});