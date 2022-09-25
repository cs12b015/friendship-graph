const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Friend extends Model {}
  Friend.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      friendId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Friend',
      timestamps: false,
      indexes: [
        {
          name: 'user_id_idx',
          fields: ['userId'],
        },
        {
          name: 'friend_id_idx',
          fields: ['friendId'],
        },
      ],
    }
  );
  return Friend;
};
