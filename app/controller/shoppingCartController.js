const db = require('../models/index.js');
const { getPagination, getPagingData } = require('../common/utils.js');
const { getImageAsBase64 } = require('./helpers/index.js');
const uuid = require('uuid');
const ShoppingCart = db.shopping_cart;
const ShoppingCartItem = db.shopping_cart_item;
const Op = db.Sequelize.Op;
const Product = db.product;
// модуль работы с путями
const path = require("path");
// модуль sequelize
const Sequelize = require("sequelize");

// если задана переменная NODE_ENV, а она задана в .env
const env = process.env.NODE_ENV || "development";
//подняться на уровень выше из текущей директории и взять ключ 'development'
const config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
// console.log(config);
const sequelize = new Sequelize(config.database, config.username, config.password, config);

exports.create = (req, res) => {
    console.log("Создание корзины");
    ShoppingCart.create({
        id: uuid.v4(),
        dateCreated: new Date()

    })
        .then(function (cart) {
            res.send(cart);
        })
        .catch(err => {
            res.send({
                message: "Ошибка -> " + err
            });
        });
};

exports.addOne = (req, res) => {

    const shoppingCartId = req.body.shoppingCartId;
    const productId = req.body.productId;
    console.log("Добавление одного айтема в корзину");
    // сперва найдем корзину с айдишкой и с товаром
    // может только добавляем уже имеющийся товар
    ShoppingCartItem.findOne({
        where: {
            productId,
            shoppingCartId
        }

    })
        // если нашли, то обновляем число в корзине
        .then(shoppingCartItem => {
            if (shoppingCartItem) {
                ShoppingCartItem.update({
                    items: sequelize.literal('items +1')
                }, {
                    where: {
                        productId: req.body.productId,
                        shoppingCartId: req.body.shoppingCartId
                    },
                }).then(() => {
                    this.countShoppingCartItems(shoppingCartId, res);});
            } else {
                ShoppingCartItem.create({
                    id: uuid.v4(),
                    items: 1,
                    shoppingCartId,
                    productId
                }).then(()=>{
                        this.countShoppingCartItems(shoppingCartId, res);});

            }

        })

        .catch(err => {
            console.log(err);
            // res.send({message:"Ошибка -> " + err});

        });



};

exports.getOrCreateShoppingCartId = (req, res) => {
    console.log("Создание или возврат существующей корзины");
    const shoppingCartId = req.query.shoppingCartId;
    ShoppingCart.findOne({
        where: {
            id: shoppingCartId
        }
    }).then(cart => {
        if (!cart) {
            this.create(req, res);
        } else {
            res.send(cart);
        }
    }).catch(err => {
        res.send({
            message: "Ошибка -> " + err
        });
    });

};

exports.removeOne = (req, res) => {

    console.log("Удаление одного айтема из корзины");
    // сперва найдем корзину с айдишкой и с товаром
    const productId = req.body.productId;
    const shoppingCartId = req.body.shoppingCartId;

    ShoppingCartItem.findOne({
        where: {
            productId,
            shoppingCartId,
            items: {
                // если больше 0
                [Op.gt]: 0
            }
        }
    })       // если нашли, то удаляем в корзине
        .then((itemShop) => {

            ShoppingCartItem.update({
                items: sequelize.literal('items - 1')
            }, {
                where: {
                    productId,
                    shoppingCartId
                },
            }).
                // удаляем все нулевые количества в корзине
                then((item) => {
                    if (item) {
                        ShoppingCartItem.destroy({
                            where: {
                                items: 0,
                                shoppingCartId
                            }
                        }).then(() => {
                            this.countShoppingCartItems(shoppingCartId, res);
                        }
                        );
                    } else {
                        this.countShoppingCartItems(shoppingCartId, res);
                    }
                }
                );

        })
        .catch(err => {
            console.log(err);
            // res.send({message:"Ошибка -> " + err});

        });



};

exports.removeInsertByProduct = (req, res) => {
    const uuid = require('uuid');
    const shoppingCartId = req.query.shoppingCartId;
    const productId = req.query.productId;
    const items = req.query.items;
    ShoppingCartItem.destroy({
        where: {
            shoppingCartId,
            productId
        }
    })
        .then(_ => {
            if (items != 0) {
                ShoppingCartItem.create({
                    id: uuid.v4(),
                    dateCreated: new Date(),
                    shoppingCartId,
                    productId,
                    items
                })
                    .then(_ => {
                        res.status(200).send({ result: "Данные успешно добавлены" });
                    }
                    );
            }
            else {
                res.status(200).send({ result: "Данные успешно удалены" });
            }

        });
};

exports.getShoppingCartCounter = (req, res) => {
    console.log("Возврат подсчета общего числа товаров и итоговой суммы товара");
    const shoppingCartId = req.query.shoppingCartId;
    this.countShoppingCartItems(shoppingCartId, res);
};

exports.get = (req, res) => {
    console.log("Получение корзины");
    const shoppingCartId = req.query.shoppingCartId;
    ShoppingCartItem.findAll({
        where: {
            shoppingCartId
        },
        //это join
        include: [{
            model: Product,
            //для inner join
            required: true
        }]
    }).then(items => {
        let response = {};
        response.items = items;
        let itemsSum = 0;
        let totalPrice = 0;
        items.forEach(item => {
            itemsSum += item.items;
            totalPrice += item.items * item.product.price;
        });
        response.items = items.map(item=>{
            let entity = {};
            entity.items = item.items;
            entity.totalPrice = item.items * item.product.price;
            entity.id = item.id;
            entity.product = item.product;
            return entity;
        });
        response.itemsSum = itemsSum;
        response.totalPrice = totalPrice;
        res.send(response);

    })

        .catch(err => {
            console.log(err);
            // res.send({message:"Ошибка -> " + err});

        });


};

exports.clearShoppingCart = (req, res) => {
    console.log('Очистка корзины');
    ShoppingCartItem.destroy({
        where: {
            shoppingCartId: req.body.shoppingCartId
        },

    }).then(
        res.send({
            "message": "Good"
        })
    )
        .catch(err => {
            console.log(err);
            // res.send({message:"Ошибка -> " + err});

        });
};

exports.getShoppingCart = (req, res) => {
    const { page, size, shoppingCartId } = req.query;

    const { limit, offset } = getPagination(page, size);

    // это запрос с пагинацией
    ShoppingCartItem.findAndCountAll({
        where: { shoppingCartId },
        include: [{
            model: db.product,
            // для inner join
            required: true
        }
        ],
        order: [
            ['productId', 'ASC']
        ],
        limit, offset
    })
        .then(data => {
            ShoppingCartItem.findAll({
                where: {
                    shoppingCartId
                },
                include: [{
                    model: db.product,
                    // для inner join
                    required: true
                }]
            }).then(shoppingCartItems => {
                let itemsSum = 0;
                let totalPrice = 0;
                let itemsPageSum = 0;
                let totalPagePrice = 0;
                shoppingCartItems.forEach(item => {
                    itemsSum += item.items;
                    totalPrice += item.items * item.product.price;
                });
                let response = getPagingData(data, page, limit);
                let products = [];
                response.items.map(item => {
                        products.push({ 
                            product: item.product,
                            items: item.items
                        });
                    itemsPageSum += item.items;
                    totalPagePrice += item.items*item.product.price;
                });
                response.items = products;
                response.itemsSum = itemsSum;
                response.totalPrice = totalPrice;
                response.itemsPageSum = itemsPageSum;
                response.totalPagePrice = totalPagePrice;
                res.send(response);
        
            });

        }
        )
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ошибка получения продуктов"
            });
        });
};



exports.countShoppingCartItems = (shoppingCartId, res)=>{
    ShoppingCartItem.findAll({
        where: {
            shoppingCartId
        },
        include: [{
            model: db.product,
            // для inner join
            required: true
        }]
    }).then(shoppingCartItems => {
        let itemsSum = 0;
        let totalPrice = 0;
        let totalRecordCount = 0;
        totalRecordCount = shoppingCartItems.length;
        shoppingCartItems.forEach(item => {
            itemsSum += item.items;
            totalPrice += item.items * item.product.price;
        });
        res.send({itemsSum, totalPrice, totalRecordCount});
}
).catch(err => {
    console.log(err);
    // res.send({message:"Ошибка -> " + err});

});};