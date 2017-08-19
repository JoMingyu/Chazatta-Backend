const express = require('express');
const app = express();
const router = require('./Route/router');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', router);

app.listen(3000, () => {
    console.log('Server is listening on 3000');
});