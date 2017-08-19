const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', require('./Route/account'));
app.use('/', require('./Route/user'));
app.use('/', require('./Route/idea/idea'));
app.use('/', require('./Route/idea/iteractions'));
app.use('/', require('./Route/idea/team'));

app.listen(8190, () => {
    console.log('Server is listening on 8190');
});
