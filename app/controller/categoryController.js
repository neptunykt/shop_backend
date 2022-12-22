const db = require('../models/index.js');
const Category = db.category;
const {
    getImageAsBase64
} = require('./helpers/index');
// это операторы or или and 

exports.getCategories = (req, res) => {
    Category.findAll({
            order: [
                ['value', 'ASC']
            ],
            attributes: [
                'id',
                'name',
                'value',
                'imageUrl'
            ]
        }).then(categories => {        
            res.status(200)
                .send(JSON.stringify(categories));
        })
        .catch(err => res.status(500)
            .send({
                message: "Ошибка -> " + err
            }));
};