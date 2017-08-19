const router = require('express').Router();
const mysql = require('../Database/mysql');

router.route('/score').post((req, res) => {
    let target = req.body.target;
    let score = parseFloat(req.body.score);

    mysql.query('SELECT score, score_sponsor_count FROM account WHERE access_token=?', [target], (err, rows) => {
        let curScore = parseFloat(rows[0].score);
        let curSponsor = parseInt(rows[0].score_sponsor_count);

        let newScore = (curScore * curSponsor + score) / (curSponsor + 1);

        mysql.query('UPDATE account SET score=?, score_sponsor_count=? WHERE access_token=?', [newScore, curSponsor + 1, target], (err, rows) => {
            if(!err) {
                res.sendStatus(200);
            } else {
                res.sendStatus(204);
            }
        });
    });
});

router.route('/mypage').post((req, res) => {
    let client = req.body.access_token;
});

module.exports = router;