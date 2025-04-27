const express = require('express');
const app = express();
const port = 3000;
const database = require('./config/database');
const routesApi= require('./api/routes/index.route');

database.connect();

app.use(express.json());
routesApi(app);
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});