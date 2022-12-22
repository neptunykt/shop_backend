const db = require('../models/index.js');
const config=require('../config/config.js');
const ROLEs = config.ROLEs; 
console.log(ROLEs);
const User = db.user;
const Role = db.role;
 
let checkDuplicateUserNameOrEmail = (req, res, next) => {
	// -> Check Username is already in use

	if(req.body.username === '' || req.body.email === '' || req.body.password == '') {
		res.status(400).send({message:'Логин или Email или Пароль пустые'});
	}
	User.findOne({
		where: {
			username: req.body.username
		} 
	}).then(user => {
		if(user){
			res.status(400).send({message: 'Имя пользователя уже существует'});
			return;
		}
		
		// -> Check Email is already in use
		User.findOne({ 
			where: {
				email: req.body.email
			} 
		}).then(user => {
			if(user){
				res.status(400).send({messsage:'Ошибка: Email уже используется!'});
				return;
			}
				
			next();
		});
	});
};
 
let checkRolesExisted = (req, res, next) => {	

		if(!ROLEs.includes(req.body.role.toUpperCase())){
			res.status(400).send({message:'Ошибка: не существует роли = ' + req.body.role});
			return;
		}

	next();
};
 
const signUpVerify = {};
signUpVerify.checkDuplicateUserNameOrEmail = checkDuplicateUserNameOrEmail;
signUpVerify.checkRolesExisted = checkRolesExisted;
 
module.exports = signUpVerify;