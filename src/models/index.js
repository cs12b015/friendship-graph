const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const seeders = require('../seeders');

const basename = path.basename(__filename);
const db = {};

const sequelize = new Sequelize({ dialect: 'sqlite', storage: ':memory:', logging: false });

// eslint-disable-next-line
fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
  })
  .forEach((file) => {
    // eslint-disable-next-line
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

db.run = (query) =>
  new Promise((resolve, reject) =>
    sequelize
      .query(query, { type: Sequelize.QueryTypes.RAW })
      .then((results) => {
        resolve(results);
      })
      .catch((err) => {
        reject(err);
      })
  );

db.init = async (seederInit = true) => {
  await sequelize.sync({ force: true });
  if (seederInit) {
    await seeders.init(db);
  }
};

module.exports = db;
