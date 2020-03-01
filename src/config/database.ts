import { Sequelize, Op} from 'sequelize'
import config from '.';

// Sequelize configuration
let database = config[process.env.ENV].db

const sequelize = new Sequelize(database.database, database.user, database.password, {
    host: database.host,
    dialect: database.dialect,
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
    
export default sequelize;
