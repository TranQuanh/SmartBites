const express = require('express');
const cors = require('cors'); // Import the cors package
const app = express();
const port = 3000;
const database = require('./config/database');
const routesApi = require('./api/routes/index.route');

database.connect();

app.use(cors()); // Enable CORS for all routes
app.use(express.json());
routesApi(app);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});