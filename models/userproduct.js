'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserProduct extends Model {
    
    get date(){
      const date = (this.createdAt)
      return date.toLocaleString("en-CA", {
        timeZone: "Asia/Jakarta", 
        hour12: false
      }).split(',').join(' Time :')
    }

    static associate(models) {
      // define association here
    }
  }
  UserProduct.init({
    userId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    itemProduct: DataTypes.STRING,
    itemQuantity: DataTypes.INTEGER,
    itemPrice: DataTypes.INTEGER,
    totalPrice: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserProduct',
  });
  return UserProduct;
};