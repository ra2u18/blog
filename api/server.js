// Load environment variables
require('dotenv').config({ path: './.env' });

// Local imports
const app = require('./app');
const { getConnectionString } = require('./utils/connectionString');

// Global Imports
const mongoose = require('mongoose');

// Start Server Application function
const startServer = async () => {
  try {
    await mongoose
      .connect(getConnectionString(), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((res) => {
        console.log(`Connected to DB ${process.env.DB}`);
      });

    app.listen(process.env.PORT, () => {
      console.log(`Server started on port ${process.env.PORT}!`);
    });
  } catch (err) {
    console.log(`[START SERVER --ERROR--] ${err.message}`);
  }
};

startServer();
