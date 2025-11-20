'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsToMany(models.Product, {through: "UserProduct"})
      User.hasOne(models.Profile)
    }
  }
  User.init({
    username:{ 
      type : DataTypes.STRING,
      allowNull : false,
      validate:{
        notNull:{
          args: true,
          msg : "Username is required!"
        },
        notEmpty:{
          args: true,
          msg : "Username is required!"
        }
      }
    },
    email: {
      type : DataTypes.STRING,
      allowNull: false,
      unique: {
        msg : "Email has already used. Choose another email"
      },
      validate:{
        notNull:{
          args: true,
          msg : "Email is required!"
        },
        notEmpty:{
          args: true,
          msg : "Email is required!"
        },
        isEmail:{
          args : true,
          msg : "Please input email correctly!"
        }
      }
    },
    password:{ 
      type : DataTypes.STRING,
      allowNull : false,
      validate:{
        notNull:{
          args: true,
          msg : "Password is required!"
        },
        notEmpty:{
          args: true,
          msg : "Password is required!"
        },
        len: {
          args: [8,16],
          msg: "Password character Min 8 and Max 16! "
        }
      }
    },
    role: { 
      type : DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate(user => {
    console.log(user, "<------- INI DALAM HOOK");
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(user.password, salt)
    
    user.password = hash
    user.role = "Member"

  })

  return User;
};