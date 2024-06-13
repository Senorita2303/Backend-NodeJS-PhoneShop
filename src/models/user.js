'use strict';
const { Model } = require('sequelize');
const { hashPassword } = require('../utils/bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.Cart, {
        foreignKey: 'userId',
        as: 'carts'
      });
      this.hasMany(models.Order, {
        foreignKey: 'userId',
        as: 'orders'
      });
      this.hasMany(models.Comment, {
        foreignKey: 'userId',
        as: 'comments'
      });
      this.hasMany(models.Review, {
        foreignKey: 'userId',
        as: 'reviews'
      });
      this.hasMany(models.Address, {
        foreignKey: 'userId',
        as: 'addresses'
      });
      this.hasMany(models.UserVoucher, {
        foreignKey: "userId",
        as: "userVouchers"
      });
    }
  }
  User.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    userName: {
      type: DataTypes.STRING,
      defaultValue: "username",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      min: 6,
    },
    avatarUrl: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isBlocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    refreshToken: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    verifiedDate: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    verificationToken: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    passwordToken: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    passwordTokenExpire: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
  }, {
    sequelize,
    modelName: 'User',
    timestamps: true,
  });
  return User;
};