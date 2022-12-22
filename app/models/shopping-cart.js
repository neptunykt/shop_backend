module.exports = function(sequelize, Sequelize) {
    const ShoppingCart = sequelize.define('shopping_cart', {
	  id: {
        type: Sequelize.UUID,
        primaryKey: true,
		allowNull: false
        
	  },
	  dateCreated: {
		  type: Sequelize.DATE
      },
     

	});
	
	return ShoppingCart;
};