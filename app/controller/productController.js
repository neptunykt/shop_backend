const db = require('../models/index.js');
const { getPagination, getPagingData } = require('../common/utils.js');
const { getImageAsBase64 } = require('./helpers/index.js');
const  DtoProduct = require('./helpers/dto/dtoProduct');

const Op = db.Sequelize.Op;
const Product = db.product;

exports.create = (req, res) => {
    const uuid = require('uuid');
    console.log("Сохранение нового продукта");
    Product.create({
        id: uuid.v4(),
        title: req.body.title,
        categoryId: req.body.categoryId,
        imageUrl: req.body.imageUrl,
        price: req.body.price
    })
        .then(res.send({
            message: "Успешное создание продукта"
        }))
        .catch(err => {
            res.send({
                message: "Ошибка -> " + err
            });
        });
};

exports.update = (req, res) => {
    console.log("Обновление продукта");
    Product.update({
        title: req.body.title,
        categoryId: req.body.categoryId,
        imageUrl: req.body.imageUrl,
        price: req.body.price
    }, {
        where: {
            id: req.body.id
        }
    })
        .then(product =>
            res.status(200)
                .send({
                    message: "Данные успешно обновлены"
                }))
        .catch(err => res.status(500)
            .send({
                message: "Ошибка -> " + err
            }));
};


exports.delete = (req, res) => {
    Product.destroy({
        where: {
            id: req.body.productId
        }
    })
        .then(res.send({
            message: "Продукт был успешно удален"
        }))
        .catch(err => res.status(500)
            .send({
                message: "Ошибка -> " + err
            }));
};

exports.get = (req, res) => {
    console.log("Получение одного продукта");
    Product.findOne({
        where: {
            id: req.query.productId
        }
    })
        .then(product => {
            if (!product) {
                return res.status(404).send('Продукт не найден.');
            } else {     
                let dtoProduct = new DtoProduct(
                    product.id, 
                    product.title, 
                    product.categoryId,
                    product.imageUrl,
                    product.price,
                    getImageAsBase64(product.imageUrl));
                return res.status(200)
                    .send(dtoProduct);
            }
        })
        .catch(err => res.status(500).send({
            message:
                err.message || "Ошибка получения продуктов"
        }));

};
// получение с пагинацией
exports.getProducts = (req, res) => {
    const { page, size } = req.query;
    let condition = null;
    if (req.query.categoryId) {
       const categoryId = req.query.categoryId;
        condition = {
            categoryId
        };
    }
    const { limit, offset } = getPagination(page, size);
    // это запрос с пагинацией
    Product.findAndCountAll({ where: condition ?? null, limit, offset })
        .then(data => {
            const result = getPagingData(data, page, limit);    
            res.send({
                recordCount: result.recordCount,
                items: result.items,
                totalPages: result.totalPages,
                currentPage: result.currentPage
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ошибка получения продуктов"
            });
        });
};