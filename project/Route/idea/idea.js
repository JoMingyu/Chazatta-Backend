const router = require('express').Router();
const mysql = require('../../Database/mysql');
const fcm = require('../../Support/fcm');

// 하루에 한번 개발일이 종료인 프로젝트의 폰에 푸시알람 제공 기능
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

// 아이디어 추가 
router.route('/idea').post((req, res) => {
    let email = req.body.email;
    let title = req.body.title;
    let summary = req.body.summary;
    let platform = req.body.platform;
    let purpose = req.body.purpose;
    let detail = req.body.detail;
    let startDate = req.body.start_date;
    let endDate = req.body.end_date;
    let teamMaxCount = req.body.team_max_count;
    let teamDesire = req.body.team_desire_tags;

    mysql.query('INSERT INTO idea(owner, title, summary, date, platform, purpose, detail, develop_start_date, develop_end_date, team_max_count, team_desire_tags) VALUES(?, ?, ?, CURDATE(), ?, ?, ?, ?, ?, ?, ?)', [
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
    mysql.query('SELECT idx FROM idea ORDER BY idx DESC', (err, rows) => { // 게시물을 오름차순으로 정렬
        let newIdx = rows[0].idx;
        mysql.query('INSERT INTO idea_team VALUES(?, ?, ?)', [newIdx, '[]', `["${email}"]`], (err, rows) => {
            if (!err) {
                res.sendStatus(201);
            } else {
                res.sendStatus(204);
            }
        });
    });
}).get((req, res) => {
    // 아이디어 리스트 가져오기. (1) 플랫폼 필터링 (2) 좋아요순 정렬
    let platformToFilter = JSON.parse(req.query.platform);
    let cut = parseInt(req.query.cut);
    let page = parseInt(req.query.page);
    // ["", ""] page 입력 양식

    let filteredIdeas = new Array();
    mysql.query('SELECT * FROM idea ORDER BY like_count DESC', (err, rows) => {
        for (idx in rows) {
            let idea = rows[idx];

            let platformsOfIdea = JSON.parse(idea.platform);
            for (let i = 0; i < platformsOfIdea.length; i++) {
                for (let j = 0; j < platformToFilter.length; j++) {
                    if (platformsOfIdea[i] == platformToFilter[j]) { // 일치하는 플랫폼이 존재한다면 배열에 추가
                        mysql.query('SELECT * FROM account WHERE email=?', [idea.owner], (err, accountRows) => {
                            filteredIdeas.push({
                                idx: idea.idx,
                                name: accountRows.name,
                                title: idea.title,
                                summary: idea.summary,
                                date: idea.date,
                                platform: idea.platform,
                                start_date: idea.develop_start_date,
                                end_date: idea.develop_end_date,
                                team_max_count: idea.team_max_count,
                                team_current_count: idea.team_current_count,
                                team_desire_tags: idea.team_desire_tags,
                                like_count: idea.like_count
                            });

                            if (idx == rows.length - 1) {
                                let responseData = new Array();
                                for (let k = cut * page; k < cut * (page + 1); k++) { // 지정 page에서 cut의 수만큼 필터링해 제공해주는 기능
                                    if (filteredIdeas[i] !== undefined) {
                                        responseData.push(filteredIdeas[i]);
                                    }
                                }

                                if (!res.headersSent) {
                                    res.json({ ideas: responseData });
                                }
                            }
                        });
                    }
                }
            }
        }
        if(!res.headersSent) {
            res.sendStatus(204);
        }
    });
}).delete((req, res) => {
    let idx = req.query.idx;
    mysql.query('DELETE FROM idea WHERE idx=?', idx, (err, rows) => {
        res.sendStatus(200);
    })
});

router.route('/idea/detail').get((req, res) => {
    // 아이디어 세부 정보 
    let idx = req.query.idx;
    // 게시글 번호를 기준으로 데이터 가져온뒤 팀멤버또한 검색해 제공 
    mysql.query('SELECT * FROM idea WHERE idx=?', idx, (err, rows) => {
        mysql.query('SELECT * FROM idea_team WHERE idea_idx=?', idx, (err, result) => {
            res.json({
                'detail': rows[0],
                'team_member': result[0]
            });
        });
    });
});

router.route('/idea/complete').post((req, res) => {
    // 프로젝트 완료
});

module.exports = router;
