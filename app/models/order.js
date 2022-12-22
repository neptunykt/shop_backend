module.exports = function (sequelize, Sequelize) {
  const Order = sequelize.define('order', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false
    },
    quantity: {
      type: Sequelize.INTEGER
    },
  price: {
      type: Sequelize.DECIMAL
    },
  });

  return Order;
};