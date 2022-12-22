const mysql = require('mysql2/promise');
const path = require("path");
const env = process.env.NODE_ENV || "development";
// подняться на уровень выше из текущей директории и взять ключ 'development'
const config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
console.log(config);

mysql.createConnection({
    host: config.host,
    port: config.port,
    user : config.username,
    password : config.password,
}).then( connection => {
    connection.query(`CREATE DATABASE IF NOT EXISTS ${config.database};`).then((res) => {
        console.info("Database create or successfully checked");
        process.exit(0);
    });
});