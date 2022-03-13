const mysql = require("mysql2");
const connection= mysql.creatConnection({
    host: "localhost",
    USER: 'root',
    PASSWORD: 'root',
    database: 'employees_db'
});

module.exports = connection;