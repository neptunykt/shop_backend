const {
    where
} = require('sequelize');
const db = require('../models/index.js');
const {
    getPagination,
    getPagingData
} = require('../common/utils.js');

const Shipping = db.shipping;
const Order = db.order;
exports.getOrdersByUser = (req, res) => {
    let result = {};
    console.log("Получение заказов с пагинацией");
    const {
        page,
        size,
        userId
    } = req.query;
    const {
        limit,
        offset
    } = getPagination(page, size);
    // это запрос с пагинацией
    Shipping.findAll({
            where: {
                userId
            },
            order: [
                ['datePlaced', 'ASC']
            ],
            limit,
            offset
        })
        .then(d => {
            Shipping.count({
                where: {
                    userId
                }
            }).then(cnt => {
                let data = {};
                data.rows = d;
                data.count = cnt;
                result = getPagingData(data, page, limit);
                res.send(result);
            });
           
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Ошибка получения продуктов"
            });
        });
      
};

exports.getOrders = (req, res) => {
    console.log("Получение заказов для администратора с пагинацией");
    let result = {};
    const {
        page,
        size
    } = req.query;
    const {
        limit,
        offset
    } = getPagination(page, size);
    // это запрос с пагинацией
    Shipping.findAll({
            order: [
                ['datePlaced', 'ASC']
            ],
            limit,
            offset
        })
        .then(d => {
            Shipping.count({}).then(cnt => {
                let data = {};
                data.rows = d;
                data.count = cnt;
                result = getPagingData(data, page, limit);  
                res.send(result);        
            });

        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Ошибка получения продуктов"
            });
        });
     
};

exports.updateOrders = (req, res) => {
    console.log("Обновление заказов");
    const shippingId = req.shippingId;
    let orders = req.orders;
    Order.findAll({
        where: {
            shippingId
        }
    }).then(savedOrders => {
        const found = savedOrders.map(m => m.Id).some(r => orders.includes(r.Id));
    });

};