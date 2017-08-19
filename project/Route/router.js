const router = require('express').Router();
const logic = require('./logic');

router.route('/profile').get((req, res) => {
    let token = req.query.token;
    let options = {
        url: 'https://openapi.naver.com/v1/nid/me',
        headers: { 'Authorization': token }
    };

    request.get(options, (error, response, body) => {

        if (!error && response.statusCode == 200) {
            let bodys = {
                'name': response.name,
                'email': response.email,
                'sex': response.gender
            };
            res.status(200).send(JSON.stringify(bodys));
            res.end();

        } else {
            console.log('error');
            if (response != null) {
                res.status(response.statusCode).end();
                console.log('error = ' + response.statusCode);
            }
        }
    });

});

module.exports = router;