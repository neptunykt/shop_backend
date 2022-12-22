"use strict";

// модуль работы с файлами fs - file system
const fs = require("fs");
// модуль работы с путями
const path = require("path");
// модуль sequelize
const Sequelize = require("sequelize");
// если задана переменная NODE_ENV, а она задана в .env
const env = process.env.NODE_ENV || "development";
// подняться на уровень выше из текущей директории и взять ключ 'development'
const config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
// console.log(config);
const sequelize = new Sequelize(config.database, config.username, config.password, config);
let db = {};

// читать синхронно текущую папку
fs.readdirSync(__dirname)
    // отфильтровать файлы в папке model не равные index.js
    .filter(function (file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    // для каждого отфильтрованного файла 
    .forEach(function (file) {
        // создать модель на основе данных
        let model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });
// Перебор ключей объекта db
console.log('start associate');
Object.keys(db).forEach(function (modelName) {
    if ("associate" in db[modelName]) {
        console.log('associated in: ' + modelName);
        db[modelName].associate(db);
    }
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;