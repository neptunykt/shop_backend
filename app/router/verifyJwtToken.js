const jwt = require('jsonwebtoken');
const config = require('../config/config.js');
const db = require('../models/index.js');
const Role = db.role;
const User = db.user;
const UserRole = db.user_role;

let verifyToken = (req, res, next) => {
	console.log('checkToken');
	let token = req.headers['x-access-token'];
	if (!token) {
		console.log('Нет токена');
		return res.status(403).send({
			auth: false,
			message: 'Нет токена.'
		});
	}

	jwt.verify(token, config.secret, (err, decoded) => {
		if (err) {
			return res.status(500).send({
				auth: false,
				message: 'Ошибка аутентификации. Ошибка -> ' + err
			});
		}
		console.log('Токен прошел проверку');
		req.userId = decoded.id;
		next();
	});
};
let isAdmin = (req, res, next) => {
	console.log('isAdmin');
	console.log(req.userId);
	UserRole.findAll({
			where: {
				userId: req.userId
			},
			include: [{
				model: Role,
				required: true
			}]
		})
		.then(usersRoles => {
			let passed = false;
			usersRoles.forEach(usersRole => {
				if (usersRole.role.name.toUpperCase() === "ADMIN") {
					passed = true;
				}
			});
			if(!passed){
			res.status(403).send("Нужна роль админа!");
			}
			else{
				next();
			}
		});
};


let isUser = (req, res, next) => {
	console.log('Проверка токена юзера');
	UserRole.findAll({
			where: {
				userId: req.userId
			},
			include: [{
				model: Role,
				required: true
			}]
		})
		.then(usersRoles => {
			let passed = false;
			usersRoles.forEach(usersRole => {
				if (usersRole.role.name.toUpperCase() === "USER") {
					passed = true;
				}
			});
			if(!passed){
			res.status(403).send("Нужна роль юзера!");
			}
			else{
				next();
			}
		});
};
let isUserOrAdmin = (req, res, next) => {
	console.log('Проверка токена юзера или админа');
	UserRole.findAll({
			where: {
				userId: req.userId
			},
			include: [{
				model: Role,
				required: true
			}]
		})
		.then(userRoles => {
			userRoles.forEach(userRole => {
				let passed = false;
				if (userRole.role.name.toUpperCase() === "USER" || userRole.role.name.toUpperCase() === "ADMIN") {
					passed = true;
				}
			if(!passed){
			res.status(403).send("Нужна роль юзера или админа!");
			}
			else{
				next();
			}
		});
	});
};


let isPmOrAdmin = (req, res, next) => {

	UserRole.findAll({
			where: {
				userId: req.userId
			},
			include: [{
				model: Role
			}]
		})
		.then(usersRoles => {
			usersRoles.forEach(usersRole => {
				if (usersRole.role.name.toUpperCase() === "PM" || usersRole.role.name.toUpperCase() === "ADMIN") {
					next();
				}
			});
			res.status(403).send("Нужна роль PM или админа!");
			return;
		});
};


const authJwt = {};
authJwt.verifyToken = verifyToken;
authJwt.isAdmin = isAdmin;
authJwt.isUser = isUser;
authJwt.isUserOrAdmin = isUserOrAdmin;
authJwt.isPmOrAdmin = isPmOrAdmin;

module.exports = authJwt;