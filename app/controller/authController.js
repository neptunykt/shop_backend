const db = require('../models/index.js');
const config = require('../config/config.js');
const User = db.user;
const UserRole = db.user_role;
const Role = db.role;
// это операторы or или and 
const Op = db.Sequelize.Op;

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


exports.signup = (req, res) => {
	// Save User to Database
	const uuid = require('uuid');
	console.log("Процесс -> Регистрация");
	User.create({
		id: uuid.v4(),
		name: req.body.name,
		username: req.body.username,
		email: req.body.email,
		// шифруем пароль с солью - 8
		password: bcrypt.hashSync(req.body.password, 8)
	}).then(user => {
		Role.findOne({
			where: {
				name: req.body.role.toUpperCase()
			}
		}).then(role => {
			UserRole.create({
				id: uuid.v4(),
				roleId: role.id,
				userId: user.id
			}).then(() => {
				res.status(200).send({
					message: "Успешная регистрация. \nВойдите с учетными данными",
				});
			});
		}).catch(err => {
			console.log(err);
			res.status(500).send({
				message: "Ошибка -> " + err
			});
		});
	}).catch(err => {
		console.log(err);
		res.status(500).send({
			message: "Ошибка -> " + err
		});
	});
};

exports.signin = (req, res) => {
	console.log("Sign-In");

	User.findOne({
		where: {
			username: req.body.username,
		}
	})
		.then(user => {
			if (!user) {
				return res.status(404).send('Неправильный логин или пароль');
			}
			// проверям пароль
			const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
			if (!passwordIsValid) {
				return res.status(404).send('Неправильный логин или пароль');
			}
			let roleName = "";
			console.log('userId=', user.id);
			UserRole.findAll({
				where: {
					userId: user.id
				},
				// это просто join с таблицей Role через ManyToMany таблицу
				// по полям userId, roleId выборка идет по полям attributes
				include: [{
					model: Role,
					attributes: ['name'],
					required: true
				}]
			}).then(userRoles => {
				roleName = userRoles[0].role.name;
				// создаем токен
				const token = jwt.sign({
					id: user.id,
					roles: userRoles.map(usersRole => {
						return (usersRole.role);
					})
				}, config.secret, {
					expiresIn: 86400 // expires in 24 hours
				});

				res.status(200).send({
					auth: true,
					username: user.username,
					role: roleName,
					userId: user.id,
					accessToken: token
				});
			});

		}).catch(err => {
			res.status(500).send('Ошибка -> ' + err);
		});
};

exports.userContent = (req, res) => {
	User.findOne({
		where: {
			id: req.userId
		},
		attributes: ['name', 'username', 'email'],
		include: [{
			model: Role,
			attributes: ['id', 'name'],
			through: {
				attributes: ['userId', 'roleId'],
			}
		}]
	}).then(user => {
		res.status(200).json({
			"description": "Страница пользователя",
			"user": user
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Нет доступа к странице пользователя",
			"error": err
		});
	});
};

exports.adminBoard = (req, res) => {
	User.findOne({
		where: {
			id: req.userId
		},
		attributes: ['name', 'username', 'email'],
		include: [{
			model: Role,
			attributes: ['id', 'name'],
			through: {
				attributes: ['userId', 'roleId'],
			}
		}]
	}).then(user => {
		res.status(200).json({
			"description": "Страница администратора",
			"user": user
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Нет доступа к странице администратора",
			"error": err
		});
	});
};

exports.managementBoard = (req, res) => {
	User.findOne({
		where: {
			id: req.userId
		},
		attributes: ['name', 'username', 'email'],
		include: [{
			model: Role,
			attributes: ['id', 'name'],
			through: {
				attributes: ['userId', 'roleId'],
			}
		}]
	}).then(user => {
		res.status(200).json({
			"description": "Страница менеджера",
			"user": user
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Нет доступа к странице менеджера",
			"error": err
		});
	});
};