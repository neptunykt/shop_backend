module.exports = function (sequelize, Sequelize) {

    const User = sequelize.define('user', {
        id: {
			type: Sequelize.UUID,
			primaryKey: true,
			allowNull: false
		},

        name: {
            type: Sequelize.STRING
        },
        username: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        }

    });

    return User;

};