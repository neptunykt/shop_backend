module.exports = function (sequelize, Sequelize) {
  const Shipping = sequelize.define('shipping', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false

    },
    name: {
      type: Sequelize.STRING
    },
    addressLine1: {
      type: Sequelize.STRING
    },
    addressLine2: {
      type: Sequelize.STRING
    },

    city: {
      type: Sequelize.STRING
    },
    datePlaced: {
      type: Sequelize.DATE
    }

  });

  return Shipping;
};