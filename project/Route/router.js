const router = require('express').Router();
const logic = require('./logic');

router.route('/profile').get(logic.profile);

module.exports = router;