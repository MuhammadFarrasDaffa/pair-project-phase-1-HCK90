'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    
    static findProduct(id){
      return Product.findByPk(id)
    }

    static associate(models) {
      Product.belongsTo(models.Category)
      Product.belongsToMany(models.User, {through: "UserProduct"})
    }
  }
  Product.init({
    name: {
      type :DataTypes.STRING,
      allowNull : false,
      validate:{
        notNull: {
          args : true,
          msg : "Product name is required!"
        },
        notEmpty: {
          args : true,
          msg : "Product name is required!"
        }
      }
    },
    description: {
      type :DataTypes.STRING,
      allowNull : false,
      validate:{
        notNull: {
          args : true,
          msg : "Product description is required!"
        },
        notEmpty: {
          args : true,
          msg : "Product description is required!"
        }
      }
    },
    price: {
      type :DataTypes.INTEGER,
      allowNull : false,
      validate:{
        notNull: {
          args : true,
          msg : "Product price is required!"
        },
        notEmpty: {
          args : true,
          msg : "Product price is required!"
        },
        min: {
          args : 1000,
          msg : "Minimal price product is Rp 1000"
        }
      }
    },
    stock: {
      type :DataTypes.INTEGER,
      allowNull : false,
      validate:{
        notNull: {
          args : true,
          msg : "Product stock is required!"
        },
        notEmpty: {
          args : true,
          msg : "Product stock is required!"
        },
        min: {
          args : 1,
          msg : "Minimal stock must be 1"
        }
      }
    },
    productPicture: {
      type :DataTypes.STRING,
      allowNull : false,
      validate:{
        notNull: {
          args : true,
          msg : "Picture of product is required!"
        },
        notEmpty: {
          args : true,
          msg : "Picture of product is required!"
        }
      }
    },
    CategoryId: {
      type :DataTypes.INTEGER,
      allowNull : false,
      validate:{
        notNull: {
          args : true,
          msg : "Product Category is required!"
        },
        notEmpty: {
          args : true,
          msg : "Product Category is required!"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};