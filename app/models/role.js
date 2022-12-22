module.exports = function (sequelize, Sequelize) {
	const Role = sequelize.define('role', {
		id: {
			type: Sequelize.UUID,
			primaryKey: true,
			allowNull: false
		},
		name: {
			type: Sequelize.STRING
		}
	});

	return Role;
};