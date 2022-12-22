
const req = require('express/lib/request');
const db = require('../models/index.js');
const Shipping = db.shipping;
const Product = db.product;
const Order = db.order;


exports.save = (req, res) => {
  const uuid = require('uuid');
  // console.log(req.body);
  // сперва сохраняем объект shipping
  // с возвратом айдишки
  let shippingId='';
  Shipping.create({
    id: uuid.v4(),
    datePlaced: req.body.datePlaced,
    name: req.body.shipping.name,
    addressLine1: req.body.shipping.addressLine1,
    addressLine2: req.body.shipping.addressLine2,
    city: req.body.shipping.city,
    userId: req.body.userId
  }).then(shipping => {
    //теперь создаем order
    req.body.items.forEach(element => {
      Order.create({
        id: uuid.v4(),
        quantity: element.quantity,
        price: element.product.price,
        productId: element.product.id,
        shippingId: shipping.id
      });
    });
    shippingId = shipping.id;
  });
  res.send({
    orderId: shippingId
  });
};

exports.getAll = (req, res) => {

  Shipping.findAll({

    include: [{
      model: User,
      //для inner join
      required: true
    }]
  }).then(orders =>
    res.status(200)
      .send(orders))
    .catch(err => res.status(500)
      .send({
        message: "Ошибка -> " + err
      }));
};

exports.getAllForUser = (req, res) => {

  Shipping.findAll({

    include: [{
      model: User,
      // для inner join
      required: true
    }],
    where: {
      userId: req.body.idUser
    }

  }).then(orders =>
    res.status(200)
      .send(orders))
    .catch(err => res.status(500)
      .send({
        message: "Ошибка -> " + err
      }));
};

exports.get = (req, res) => {
  console.log("Получение одного заказа");
  const shippingId = req.query.shippingId;
  Order.findAll({
    include: [{
      model: Shipping,
      as: 'shipping',
      // для inner join
      required: true
    },
  {
    model: Product,
    as: 'product',
    required: true
  }
  ],
    where: {
      shippingId
    }
  })
    .then(shipping => {
      if (!shipping) {
        return res.status(404).send('Заказ не найден.');
      } else {
        return res.status(200)
          .send(shipping);
      }
    });
};


exports.delete = (req, res) => {
  console.log("Удаление одного заказа");
  const shippingId = req.query.shippingId;
  Order.destroy({
    where: {
      shippingId
    }
  })
    .then(_ => {
      Shipping.destroy({
        where: {
          id: shippingId
        }
      }).then(_ => {
        return res.status(204).send();
      });

    });
};
