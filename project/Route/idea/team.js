const router = require('express').Router();
const mysql = require('../../Database/mysql');

router.route('/idea/team/applies').post((req, res) => {
    // 팀원 신청
    let idx = parseInt(req.body.idx);
    let email = req.body.email;

    mysql.query('SELECT applier FROM idea_team WHERE idea_idx=?', [idx], (err, rows) => {
        let applier = JSON.parse(rows[0].applier);
        for (let i = 0; i < applier.length; i++) {
            if (applier[i] == email) {
                // 중복 체크
                res.sendStatus(204);
                return;
            }
        }
        applier[applier.length] = email;
        mysql.query('UPDATE idea_team SET applier=? WHERE idea_idx=?', [JSON.stringify(applier), idx], (err, rows) => {
            if (!err) {
                res.sendStatus(201);
            } else {
                res.sendStatus(204);
            }
        });
    });
}).get((req, res) => {
    // 지 아이디어에 대한 팀원 신청 목록 조회
    let email = req.query.email;

    let response = new Array();
    mysql.query('SELECT idx, title FROM idea WHERE owner=?', [email], (err, rows) => {
        for (let i = 0; i < rows.length; i++) {
            let idx = rows[i].idx;
            mysql.query('SELECT applier FROM idea_team WHERE idea_idx=?', [idx], (err, applierRows) => {
                if (JSON.parse(applierRows[0].applier).length > 0) {
                    response.push({
                        idx: idx,
                        title: rows[i].title,
                        applier: applierRows[0].applier
                    });
                }
                if (i == rows.length - 1) {
                    res.send(response);
                }
            });
        }
    });
});

router.route('/idea/team/accept').post((req, res) => {
    // 신청 수락
    let idx = parseInt(req.body.idx);
    let email = req.body.email;

    mysql.query('SELECT applier, team FROM idea_team WHERE idea_idx=?', [idx], (err, rows) => {
        let appliers = JSON.parse(rows[0].applier);
        let team = JSON.parse(rows[0].team);
        for (let i = 0; i < appliers.length; i++) {
            if (appliers[i] == email) {
                team.push(email);
                appliers.splice(i, 1);
                mysql.query('UPDATE idea_team SET team=?, applier=? WHERE idea_idx=?', [JSON.stringify(team), JSON.stringify(appliers), idx], (err, rows) => {
                    if (!err) {
                        res.sendStatus(200);
                    } else {
                        res.sendStatus(204);
                    }
                });
            }
        }
    });
}).delete((req, res) => {
    // 거절
});

module.exports = router;
