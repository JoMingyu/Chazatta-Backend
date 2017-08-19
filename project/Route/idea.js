const router = require('express').Router();
const mysql = require('../Database/mysql');
const fcm = require('../Support/fcm');
const util = require('util');

setInterval(() => {
    const date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split(" ")[0];
    mysql.query('SELECT owner, title FROM idea WHERE develop_end_date=?', [date], (err, rows) => {
        for (idx in rows) {
            let row = rows[idx];
            mysql.query('SELECT registration_id FROM account WHERE email=?', [row.owner], (err, accountRows) => {
                let ideaTitle = row.title;
                let registrationId = accountRows[0].registration_id;
                fcm.fcm(registrationId, `'${ideaTitle}' 아이디어의 개발 종료일`, '프로젝트를 완료하고 팀원을 평가해주세요!');
            });
        }
    });
}, 1000 * 3600 * 24);

router.route('/idea').post((req, res) => {
    // 아이디어 추가
    let email = req.body.email;
    let title = req.body.title;
    let summary = req.body.summary;
    let platform = req.body.platform;
    let purpose = req.body.purpose;
    let detail = req.body.detail;
    let startDate = req.body.start_date;
    let endDate = req.body.end_date;
    let teamMaxCount = req.body.team_max_count;
    let teamDesire = req.body.team_desire;

    mysql.query('INSERT INTO idea(owner, title, summary, platform, purpose, detail, develop_start_date, develop_end_date, team_max_count, team_desire', [
        email,
        title,
        summary,
        platform,
        purpose,
        detail,
        startDate,
        endDate,
        teamMaxCount,
        teamDesire
    ]);
}).get((req, res) => {
    // 아이디어 리스트 가져오기. (1) 플랫폼 필터링 (2) 좋아요순 정렬
    let platformToFilter = JSON.parse(req.query.platform);
    let cut = parseInt(req.query.cut);
    let page = parseInt(req.query.page);
    // ["", ""]

    let filteredIdeas = new Array();
    let ideaCount = 0;

    mysql.query('SELECT * FROM idea ORDER BY like_count DESC', (err, rows) => {
        for (idx in rows) {
            let idea = rows[idx];

            let platformsOfIdea = JSON.parse(idea.platform);
            for (let i = 0; i < platformsOfIdea.length; i++) { // 반복문 속도 개선 필요함
                for (let j = 0; j < platformToFilter.length; j++) {
                    if (platformsOfIdea[i] == platformToFilter[j]) {
                        filteredIdeas[ideaCount++] = {
                            idx: idea.idx,
                            title: idea.title,
                            summary: idea.summary,
                            platform: idea.platform,
                            start_date: idea.develop_start_date,
                            end_date: idea.develop_end_date,
                            team_max_count: idea.team_max_count,
                            team_current_count: idea.team_current_count,
                            team_desire: idea.team_desire
                        };
                    }
                }
            }
        }

        let responseData = new Array();
        let dataCount = 0;
        for (let i = cut * page; i < cut * (page + 1); i++) {
            if (filteredIdeas[i] !== undefined) {
                responseData[dataCount++] = filteredIdeas[i];
            }
        }

        res.json(responseData);
    });
}).delete((req, res) => {
    let idx = req.query.idx;
    mysql.query('DELETE FROM idea WHERE idx=?', idx, (err, rows) => {
        res.status(200);
        res.end();
    })
});

router.route('/idea/detail').get((req, res) => {
    // 아이디어 세부 정보
    // 팀원 정보
    let idx = req.query.idx;
    mysql.query('SELECT * FROM idea WHERE idx=?', idx, (err, rows) => {
        res.status(200).send(JSON.stringify(rows));
        res.end();
    });
});

router.route('/idea/complete').post((req, res) => {
    // 프로젝트 완료
});

router.route('/idea/comment').post((req, res) => {
    // 댓글
    let idx = parseInt(req.body.idx);
    let email = req.body.email;
    let content = req.body.content;

    mysql.query('INSERT INTO idea_comment(idea_idx, owner, content) VALUES(?, ?, ?)', [idx, email, content], (err, rows) => {
        if(!err) {
            res.sendStatus(201);
        } else {
            res.sendStatus(204);
        }
    });
});

router.route('/idea/like').post((req, res) => {
    // 좋아요
    let idx = req.body.idx;
    mysql.query('SELECT * FROM idea WHERE idx=?', idx, (err, rows) => {

        mysql.query('UPDATE idea SET like_count=? WHERE idx=?', [++rows[0].like_count, idx], (err, result) => {

            res.status(200).send(JSON.stringify(rows[0].like_count));
            res.end();
        });
    });

}).delete((req, res) => {

});

router.route('/idea/team/applies').post((req, res) => {
    // 팀원 신청
    let idx = parseInt(req.body.idx);
}).get((req, res) => {
    // 지 아이디어에 대한 팀원 신청 목록 조회
});

router.route('/idea/team/accept').post((req, res) => {
    // 신청 수락
}).delete((req, res) => {
    // 거절
});;

module.exports = router;