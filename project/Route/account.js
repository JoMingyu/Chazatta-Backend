const router = require('express').Router();
const mysql = require('../Database/mysql');
const parser = require('../Support/parser');

router.route('/signup').post((req, res) => {
    let registrationId = req.body.registration_id;
    let position = req.body.position;
    let phone = req.body.phone;
    let phonePrivate = req.body.phone_private == 'true';
    let age = parseInt(req.body.age);
    let agePrivate = req.body.age_private == 'true';
    let belong = req.body.belong;
    let belongPrivate = req.body.belong_private == 'true';
    
    let accessToken = null;
    let email = null;
    let pw = null;
    let name = null;
    let sex = null;

    if (req.body.signup_type == 'naver') {
        accessToken = req.body.access_token;
        parser.profile(accessToken, response => {
            email = response.email;
            name = response.name;
            sex = response.sex;

            mysql.query('INSERT INTO account VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    email,
                    pw,
                    accessToken,
                    registrationId,
                    name,
                    sex,
                    position,
                    phone,
                    phone_private,
                    age,
                    age_private,
                    belong,
                    belong_private,
                    0, 0
                ]
            );
        });
    } else {
        email = req.body.email;
        pw = req.body.pw;
        name = req.body.name;
        sex = req.body.sex;

        mysql.query('INSERT INTO account VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                    email,
                    pw,
                    accessToken,
                    registrationId,
                    name,
                    sex,
                    position,
                    phone,
                    phone_private,
                    age,
                    age_private,
                    belong,
                    belong_private,
                    0, 0
            ]
        );
    }

    res.sendStatus(201);
});

module.exports = router;
