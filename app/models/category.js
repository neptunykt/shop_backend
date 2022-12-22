module.exports = function(sequelize, Sequelize) {
    const Category = sequelize.define('category', {
	  id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
	  },
	  name: {
		  type: Sequelize.STRING,
          allowNull: false
      },
      value:{
          type: Sequelize.STRING,
          allowNull: false
      },
      imageUrl: {
          type: Sequelize.STRING
      }
	});
	
	return Category;
};