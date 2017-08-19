const router = require('express').Router();
const mysql = require('../../Database/mysql');

router.route('/idea/comment').post((req, res) => {
    // 댓글 입력 부분 
    let idx = parseInt(req.body.idx);
    let email = req.body.email;
    let content = req.body.content;
    mysql.query('INSERT INTO idea_comment(idea_idx, owner, content, date) VALUES(?, ?, ?, NOW())', [idx, email, content], (err, rows) => {
        if (!err) {
            res.sendStatus(201);
        } else {
            res.sendStatus(204);
        }
    });
});

router.route('/idea/like').post((req, res) => {
    // 좋아요 + 기능
    let idx = req.body.idx;
    mysql.query('SELECT * FROM idea WHERE idx=?', idx, (err, rows) => { // 해당되는 게시물의 좋아요 수를 가져오기 위해 
        mysql.query('UPDATE idea SET like_count=? WHERE idx=?', [++rows[0].like_count, idx], (err, result) => { // 가져온 좋아요 수에서 증가 후 update
            if(!err) {
                res.sendStatus(200);
            } else {
                res.sendStatus(204);
            }
        });
    });

}).delete((req, res) => {
    // 좋아요 취소
    let idx = req.body.idx;
    mysql.query('SELECT * FROM idea WHERE idx=?', idx, (err, rows) => {
        mysql.query('UPDATE idea SET like_count=? WHERE idx=?', [--rows[0].like_count, idx], (err, result) => {
            if(!err) {
                res.sendStatus(200);
            } else {
                res.sendStatus(204);
            }
        });
    });
});

router.route('/idea/comment/list').get((req, res) => {
    let idx = req.query.idx;
    let cut = parseInt(req.query.cut);
    let page = parseInt(req.query.page);
    let arr = new Array();
    mysql.query('SELECT like_count FROM idea WHERE idx=?', idx, (err, find) => {
        let like_count = find[0].like_count;
        mysql.query('SELECT * FROM idea_comment WHERE idea_idx=?', idx, (err, rows) => {
            let ob = [];
            for (let i = 0; i < rows.length; i++) {
                mysql.query('SELECT * FROM account WHERE email=?', rows[i].owner, (err, result) => {
                    ob = {
                        'resu': rows[i]
                    };
                    ob.resu.name = result[0].name;
                    arr.push(ob);

                    if (i + 1 == rows.length) {
                        let result = { 'result': arr, 'like_count': like_count, 'commentCount': rows.length }
                        res.send(result);
                    }
                });
            }
        })
    });
});

module.exports = router;