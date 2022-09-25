const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {}
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
      timestamps: false,
      indexes: [
        {
          name: 'name_idx',
          fields: ['name'],
        },
      ],
    }
  );
  return User;
};
