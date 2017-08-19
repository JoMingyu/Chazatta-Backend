const request = require('request');

module.exports = {
    profile: (token, callback) => {
        let options = {
            url: 'https://openapi.naver.com/v1/nid/me',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };

        request.get(options, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                let obj = JSON.parse(body);
                let bodys = {
                    'name': obj.response.name,
                    'email': obj.response.email,
                    'sex': obj.response.gender
                };
                callback(bodys);
            } else {
                if (response != null) {
                    console.log('error = ' + response.statusCode);
                    callback(response.statusCode);
                }
            }
        });
    }
}
