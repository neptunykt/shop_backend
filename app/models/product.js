module.exports = function (sequelize, Sequelize) {
  const Product = sequelize.define('product', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false
    },
    title: {
      type: Sequelize.STRING
    },
    imageUrl: {
      type: Sequelize.STRING
    },
    price: {
      type: Sequelize.DECIMAL
    },

  });

  return Product;
};