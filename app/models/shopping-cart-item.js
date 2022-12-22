module.exports = function (sequelize, Sequelize) {
    const ShoppingCartItem = sequelize.define('shopping_cart_item', {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false
          },
        items: {
            type: Sequelize.INTEGER
        }


    });

    return ShoppingCartItem;
};