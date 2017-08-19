const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', require('./Route/account'));

app.listen(8190, () => {
    console.log('Server is listening on 8190');
});