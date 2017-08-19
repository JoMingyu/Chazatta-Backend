const router = require('express').Router();
const mysql = require('../Database/mysql');
const parser = require('../Support/parser');

router.route('/signin').post((req, res) => {
    if (req.body.signin_type == 'naver') {
        let accessToken = req.body.access_token;
        parser.profile(accessToken, response => {
            mysql.query('SELECT * FROM account WHERE email=?', [response.email], (err, rows) => {
                if (rows.length > 0) {
                    res.sendStatus(201);
                    mysql.query('UPDATE account SET access_token=? WHERE email=?', [accessToken, response.email]);
                } else {
                    res.sendStatus(204);
                }
            });
        });
    } else {
        let email = req.body.email;
        let pw = req.body.pw;
        mysql.query('SELECT * FROM account WHERE email=? AND pw=?', [email, pw], (err, rows) => {
            if (rows.length > 0) {
                res.sendStatus(201);
            } else {
                res.sendStatus(204);
            }
        });
    }
});

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
                    phonePrivate,
                    age,
                    agePrivate,
                    belong,
                    belongPrivate,
                    0, 0
                ], (err, rows) => {
                    if (!err) {
                        res.sendStatus(201);
                    } else {
                        console.log(err);
                        res.sendStatus(204);
                    }
                }
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
                phonePrivate,
                age,
                agePrivate,
                belong,
                belongPrivate,
                0, 0
            ], (err, rows) => {
                if (!err) {
                    res.sendStatus(201);
                } else {
                    res.sendStatus(204);
                }
            }
        );
    }
});

module.exports = router;
