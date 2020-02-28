import Sequelize, { Op } from 'sequelize'
import config from '../../../config';
import fs from 'fs';
import path from 'path';
const basename  = path.basename(__filename);

// Sequelize configuration
let database = config[process.env.ENV].db

const sequelize = new Sequelize(database.database, database.user, database.password, {
    host: database.host,
    dialect: database.dialect,
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    define: {
        freezeTableName: true,
        timestamps: false,
    }
});

var db = {};

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Test sequelize connection with database
sequelize
    .authenticate()
    .then(() => {
        console.log("Connection has been established successfully.")
    })
    .catch(err => {
        console.log("Unable to connect to the database: ", err)
        process.exit()
    });
    
export default db;
