const router = require('express').Router();
const mysql = require('../Database/mysql');
const parser = require('../Support/parser');

router.route('/signup').post((req, res) => {
    let accessToken = req.body.access_token;
    let registrationId = req.body.registration_id;
    let position = req.body.position;
    let phone = req.body.phone;
    let phonePrivate = req.body.phone_private == 'true';
    let age = parseInt(req.body.age);
    let agePrivate = req.body.age_private == 'true';
    let belong = req.body.belong;
    let belongPrivate = req.body.belong_private == 'true';

    parser.profile(accessToken, response => {
        mysql.query('INSERT INTO account VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [accessToken,
            registrationId,
            response.email,
            response.name,
            response.sex,
            position,
            phone,
            phonePrivate,
            age,
            agePrivate,
            belong,
            belongPrivate, 0, 0]
        );
    });

    res.sendStatus(201);
});


module.exports = router;