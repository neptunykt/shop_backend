const verifySignUp = require('./verifySignUp');
const authJwt = require('./verifyJwtToken');
module.exports = function (app) {
	const authController = require('../controller/authController.js');
	const categoryController = require('../controller/categoryController.js');
	const productController = require('../controller/productController.js');
	const shoppingCartController = require('../controller/shoppingCartController.js');
	const shippingController = require('../controller/shippingController.js');
	const orderController = require('../controller/orderController.js');
	const imageController = require('../controller/imageController.js');
	// middleware для проверки дубликатов
	app.post('/api/auth/signup', [verifySignUp.checkDuplicateUserNameOrEmail,
		verifySignUp.checkRolesExisted
	], authController.signup);

	app.post('/api/auth/signin', authController.signin);

	app.get('/api/category/categories', categoryController.getCategories);

	app.post('/api/product/create', [authJwt.verifyToken, authJwt.isAdmin], productController.create);

	app.post('/api/product/update', [authJwt.verifyToken, authJwt.isAdmin], productController.update);

	app.post('/api/product/delete', [authJwt.verifyToken, authJwt.isAdmin], productController.delete);

	app.get('/api/product/get', [authJwt.verifyToken, authJwt.isAdmin], productController.get);

	app.get('/api/product/products', productController.getProducts);

	// создаем айдишку для корзины
	app.post('/api/shopping-cart', shoppingCartController.create);
	// добавляем в корзину товары
	app.post('/api/shopping-cart/addOne', shoppingCartController.addOne);

	// удаляем из корзины товар
	app.post('/api/shopping-cart/removeOne', shoppingCartController.removeOne);

	// получаем все данные из корзины
	app.get('/api/shopping-cart/cart', shoppingCartController.get);

	// создаем или получаем корзину
	app.get('/api/shopping-cart/cart/getOrCreateShoppingCartId', shoppingCartController.getOrCreateShoppingCartId);

	// получаем общее кол-во товаров и общую сумму покупки

	app.get('/api/shopping-cart/cart/getShoppingCartCounter', shoppingCartController.getShoppingCartCounter);

	// получаем корзину с пагинацией
	app.get('/api/shopping-cart/cart/getShoppingCart', shoppingCartController.getShoppingCart);

	// добавляем удаляем по продукту в корзину

	app.get('/api/shopping-cart/cart/removeInsertByProduct', shoppingCartController.removeInsertByProduct);

	// чистим корзину
	app.delete('/api/shopping-cart/clearShoppingCart', shoppingCartController.clearShoppingCart);

	// сохраняем заказ с очисткой корзины для зареганного юзера или админа
	app.post('/api/shipping/save', [authJwt.verifyToken, authJwt.isUserOrAdmin], shippingController.save);

	// получаем всю таблицу заказов для админа
	app.get('/api/shippings/', [authJwt.verifyToken, authJwt.isAdmin], shippingController.getAll);

	// получаем таблицу заказов для юзера или админа
	app.post('/api/shippings/orders', [authJwt.verifyToken, authJwt.isUserOrAdmin], shippingController.getAllForUser);

	app.delete('/api/shipping', [authJwt.verifyToken, authJwt.isAdmin], shippingController.delete);

	// получаем информацию об одном заказе для юзера или админа
	app.get('/api/shipping/', [authJwt.verifyToken, authJwt.isUserOrAdmin], shippingController.get);

	// таблица заказов с пагинацией для юзера или админа
	app.get('/api/orders/getOrdersByUser', [authJwt.verifyToken, authJwt.isUserOrAdmin], orderController.getOrdersByUser);

	// таблица заказов с пагинацией для администратора
	app.get('/api/orders/admin/getOrders', [authJwt.verifyToken, authJwt.isAdmin], orderController.getOrders);

	app.post('/api/images/add', [authJwt.verifyToken], imageController.addImage);

	app.get('/api/images/download', imageController.downloadImage);

};