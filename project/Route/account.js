const router = require('express').Router();
const mysql = require('../Database/mysql');
const parser = require('../Support/parser');

router.route('/signup').post((req, res) => {
    let accessToken = req.body.access_token;
    let position = req.body.position;
    let phone = req.body.phone;
    let phonePrivate = req.body.phone_private == 'true';
    let age = parseInt(req.body.age);
    let agePrivate = req.body.age_private == 'true';
    let belong = req.body.belong;
    let belongPrivate = req.body.belong_private == 'true';
    parser.profile(accessToken, response => {
        mysql.query('INSERT INTO account VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [accessToken, response.name, response.email, response.sex, position, phone, phonePrivate, age, agePrivate, belong, belongPrivate, 0, 0], (err, rows) => {
            console.log(err);
        });
    });



    res.send('hello');
});


module.exports = router;