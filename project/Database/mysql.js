const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'chazatta'
});
connection.connect();

setInterval(() => {
    connection.query('SELECT 1');
}, 1000 * 3600);

module.exports = connection;
