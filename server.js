// cors нужен для middleware
const cors = require('cors');
const express = require('express');
const path = require('path');
const uuid = require('uuid');
// express нужен для создания Rest apis
const app = express();
// body-parser нужен для парсинга запросов и создания объекта req.body
const bodyParser = require('body-parser');
app.use(bodyParser.json());
// для работы со статическими файлами (чтобы отображать картинки)
// создаем виртуальную папку static, которая указывает на public
const staticFolder = '/static';
app.use(staticFolder, express.static(path.join(__dirname,'/app/public')));
//это для межайтового обмена
app.use(cors());
const bcrypt = require('bcryptjs');

// здесь в db попадет объект, 
// то что помечено module.exports при включении файла 
const db = require('./app/models/index.js');
const Role = db.role;
const User = db.user;
const Category = db.category;
const Product = db.product;
const ShoppingCart = db.shopping_cart;
const ShoppingCartItem = db.shopping_cart_item;
const UserRole = db.user_role;
const Shipping = db.shipping;
const Order = db.order;
// устанавливаем связи в моделях, то есть в shippings будет fk userId
User.hasMany(Shipping, {foreignKey: 'userId'});
Product.belongsTo(Category, { foreignKey: 'categoryId' });
Product.hasMany(Order, {foreignKey: 'productId'});
Order.belongsTo(Product, {foreignKey: 'productId'});
// -------------------------------------------------------
Shipping.hasMany(Order, {foreignKey: 'shippingId'});
// это для include
Order.belongsTo(Shipping, {foreignKey: 'shippingId'});
//--------------------------------------------------------
// Разница между hasMany и belongTo
// пример здесь fk ProductId будет у ShoppingCartItem 
// Product.hasMany(ShoppingCartItem);
// пример здесь fk ShoppingCartItemId будет у Product
// Product.belongsTo(ShoppingCartItem);

// through - промежуточная таблица (многие ко многим)
Product.belongsToMany(ShoppingCart, { foreignKey: 'productId', through: 'shopping_cart_item' });
ShoppingCart.belongsToMany(Product, { foreignKey: 'shoppingCartId', through: 'shopping_cart_item' });
// это для include (без этого инклудить не будет)
ShoppingCartItem.belongsTo(Product);
ShoppingCartItem.belongsTo(ShoppingCart);
// здесь создаем связи между user и новой таблицей user_role
Role.belongsToMany(User, { foreignKey: 'roleId', through: 'user_role' })
User.belongsToMany(Role, { foreignKey: 'userId', through: 'user_role' });
// это для include (без этого инклудить не будет)
UserRole.belongsTo(Role);
UserRole.belongsTo(User);



// force: true will drop the table if it already exists
db.sequelize.sync({
	force: true
})
	.then(() => {
		console.log('Удаление и синхронизация  { принудительно: истина }');
		initial();
	});
const server = app.listen(8085, function () {

	const host = server.address().address;
	const port = server.address().port;

	console.log("App listening at http://%s:%s", host, port);
});

const adminRole = uuid.v4();
const userRole = uuid.v4();
const pmRole = uuid.v4();
const breadCategory = uuid.v4();
const fruitsCategory = uuid.v4();
const dairyCategory = uuid.v4();
const seasoningsCategory = uuid.v4();
const vegetablesCategory = uuid.v4();

// это типа миграции в нашем DotNet Core
function initial() {
	Role.create({
		id: userRole,
		name: "USER"
	});

	Role.create({
		id: adminRole,
		name: "ADMIN"
	});

	Role.create({
		id: pmRole,
		name: "PM"
	});

	Category.create({
		id: breadCategory,
		name: 'bread',
		value: 'Хлеб',
		imageUrl: `${staticFolder}/uploads/categories/bread.png`
	});
	Category.create({
		id: fruitsCategory,
		name: 'fruits',
		value: 'Фрукты',	
		imageUrl: `${staticFolder}/uploads/categories/fruits.png`
	});
	Category.create({
		id: dairyCategory,
		name: 'dairy',
		value: 'Выпечка',	
		imageUrl: `${staticFolder}/uploads/categories/dairy.png`
	});
	Category.create({
		id: seasoningsCategory,
		name: 'seasonings',
		value: 'Приправы и специи',	
		imageUrl: `${staticFolder}/uploads/categories/seasonings.png`
	});
	Category.create({
		id: vegetablesCategory,
		name: 'vegetables',
		value: 'Овощи',	
		imageUrl: `${staticFolder}/uploads/categories/vegetables.png`
	});
	User.create({
		id: uuid.v4(),
		name: 'peter',
		username: 'peter',
		email: 'peter_ykt@mail.ru',
		password: bcrypt.hashSync('peter', 8)
	}).then(user => {
		Role.findOne({
			where: {
				id: adminRole
			}
		})
			.then(role => {
				UserRole.create({
					id: uuid.v4(),
					userId: user.id,
					roleId: role.id
				});
			});
	});
	Product.create({
		id: uuid.v4(),
		title: 'Шпинат',
		categoryId: vegetablesCategory,	
		imageUrl: `${staticFolder}/uploads/products/spinach.jpg`,
		price: 35
	});
	Product.create({
		id: uuid.v4(),
		title: 'Шафран',
		categoryId: seasoningsCategory,	
		imageUrl: `${staticFolder}/uploads/products/shafran.png`,
		price: 76
	});
	Product.create({
		id: uuid.v4(),
		title: 'Помидор',
		categoryId: vegetablesCategory,
		imageUrl: `${staticFolder}/uploads/products/vegetables.jpg`,
		price: 24
	});
	Product.create({
		id: uuid.v4(),
		title: 'Яблоки',
		categoryId: fruitsCategory,
		imageUrl: `${staticFolder}/uploads/products/apple.jpg`,
		price: 120
	});
	Product.create({
		id: uuid.v4(),
		title: 'Персики',
		categoryId: fruitsCategory,	
		imageUrl: `${staticFolder}/uploads/products/peach.jpg`,
		price: 135
	});
	Product.create({
		id: uuid.v4(),
		title: 'Виноград',
		categoryId: fruitsCategory,	
		imageUrl: `${staticFolder}/uploads/products/vine.jpg`,
		price: 210
	});
	Product.create({
		id: uuid.v4(),
		title: 'Авокадо',
		categoryId: fruitsCategory,	
		imageUrl: `${staticFolder}/uploads/products/avocado.jpg`,
		price: 350
	});

	Product.create({
		id: uuid.v4(),
		title: 'Клубника',
		categoryId: fruitsCategory,	
		imageUrl: `${staticFolder}/uploads/products/strawberry.jpg`,
		price: 420
	});
	Product.create({
		id: uuid.v4(),
		title: 'Салат',
		categoryId: vegetablesCategory,	
		imageUrl: `${staticFolder}/uploads/products/lettuce.jpg`,
		price: 55
	});
	Product.create({
		id: uuid.v4(),
		title: 'Бублики',
		categoryId: dairyCategory,	
		imageUrl: `${staticFolder}/uploads/products/bagel.jpg`,
		price: 74
	});
	Product.create({
		id: uuid.v4(),
		title: 'Багетный хлеб',
		categoryId: breadCategory,	
		imageUrl: `${staticFolder}/uploads/products/bread.jpg`,
		price: 100
	});
	Product.create({
		id: uuid.v4(),
		title: 'Цветная капуста',
		categoryId: vegetablesCategory,	
		imageUrl: `${staticFolder}/uploads/products/cauliflower.jpg`,
		price: 46
	});
	Product.create({
		id: uuid.v4(),
		title: 'Круглая куркума',
		categoryId: seasoningsCategory,	
		imageUrl: `${staticFolder}/uploads/products/turmeric.jpg`,
		price: 133
	});
	Product.create({
		id: uuid.v4(),
		title: 'Зерна кориандра',
		categoryId: seasoningsCategory,	
		imageUrl: `${staticFolder}/uploads/products/coriander.png`,
		price: 287
	});
	Product.create({
		id: uuid.v4(),
		title: 'Круосаны',
		categoryId: dairyCategory,	
		imageUrl: `${staticFolder}/uploads/products/croissants.jpg`,
		price: 380
	});
	Product.create({
		id: uuid.v4(),
		title: 'Батон нарезной',
		categoryId: breadCategory,	
		imageUrl: `${staticFolder}/uploads/products/sliced_loaf.jpg`,
		price: 120
	});
	Product.create({
		id: uuid.v4(),
		title: 'Мирлитоны руанские',
		categoryId: dairyCategory,	
		imageUrl: `${staticFolder}/uploads/products/mirlitones.jpg`,
		price: 220
	});
	Product.create({
		id: uuid.v4(),
		title: 'Розетки французские',
		categoryId: dairyCategory,	
		imageUrl: `${staticFolder}/uploads/products/socket_french.jpg`,
		price: 230
	});

	useRoutes();
}

function useRoutes() {
	console.log("Use routes...")
	// передаем app в router.js
	require('./app/router/router.js')(app);
}