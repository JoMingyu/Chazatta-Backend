const router = require('express').Router();
const mysql = require('../Database/mysql');

router.route('/user').post((req, res) => {
    let email = req.body.email;

    mysql.query('SELECT * FROM account WHERE email=?', [email], (err, rows) => {
        let user = rows[0];
        let response = {
            name: user.name,
            sex: user.sex,
            position: user.position,
            score: user.score
        };
        if (!user.age_private) {
            response.age = user.age;
        }
        if (!user.belong_private) {
            response.belong = user.belong;
        }

        res.json(response);
    });
});

router.route('/score').post((req, res) => {
    let target = req.body.target;
    let score = parseFloat(req.body.score);

    mysql.query('SELECT score, score_sponsor_count FROM account WHERE email=?', [target], (err, rows) => {
        let curScore = parseFloat(rows[0].score);
        let curSponsor = parseInt(rows[0].score_sponsor_count);

        let newScore = (curScore * curSponsor + score) / (curSponsor + 1);

        mysql.query('UPDATE account SET score=?, score_sponsor_count=? WHERE email=?', [newScore, curSponsor + 1, target], (err, rows) => {
            if (!err) {
                res.sendStatus(200);
            } else {
                res.sendStatus(204);
            }
        });
    });
});

router.route('/mypage').post((req, res) => {
    let client = req.body.email;
    console.log(client); //name, position, phone, age, belong, phone_private, age_private, belong_private
    mysql.query('SELECT * FROM account WHERE email=?', client, (err, rows) => {
        console.log(rows);
        res.status(200).send(rows[0]);
        res.end();
    });


});

module.exports = router;