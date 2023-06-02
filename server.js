const express = require('express');
const app = express();
const mssql = require('mssql');
const path = require('path');
require('dotenv').config();

// Enable CORS headers
app.use((req, res, next) => {
   res.setHeader('Cache-Control', 'no-cache');
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
   next();
});

const config = {
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   server: process.env.DB_SERVER,
   database: process.env.DB_DATABASE,
   options: {
      encrypt: true,      
      trustServerCertificate: false // Change to true if you're using a self-signed certificate
   }
};

// Serve static files from the build folder
app.use(express.static(path.join(__dirname, 'build')));

// Endpoint to fetch data from the database
app.get('/api/data', async (req, res) => {
   try {
      await mssql.connect(config);
      const result = await mssql.query('SELECT ProcessName, ProcessId, MaxIdleTime, MachineName, ProcessTitle, UserName, CreatedDate FROM Autodesk_Health');
      res.json(result.recordset);
   } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
   } finally {
      mssql.close();
   }
});

// All other routes
app.get('*', (req, res) => {
   res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
const port = process.env.PORT || 3000; // Use the environment variable PORT if available, otherwise use port 3000
app.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});
