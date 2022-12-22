module.exports = class DtoProduct {
    constructor(id, title, categoryId, imageUrl, price, imageData){
        this.id = id;
        this.title = title;
        this.categoryId = categoryId;
        this.imageUrl = imageUrl;
        this.price = price;
        this.imageData = imageData;
    }
};