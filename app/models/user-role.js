module.exports = function (sequelize, Sequelize) {
	const UserRole = sequelize.define('user_role', {
		id: {
			type: Sequelize.UUID,
			primaryKey: true,
			allowNull: false
		}
	});

	return UserRole;
};