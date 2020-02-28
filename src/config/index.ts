import dotenv from 'dotenv';

dotenv.config({ path: './src/config/config.env' });

const config = {
    server: {
      port: process.env.PORT
    },
    env: process.env.ENV || 'development',
    development: {
      db: {
        host: process.env.DB_HOST_DEV,
        user: process.env.DB_USER_DEV,
        password: process.env.DB_PASSWORD_DEV,
        database: process.env.DB_NAME_DEV,
        dialect: process.env.DB_DIALECT_DEV
      }
    }, 
    production: {
      db: {
        host: process.env.DB_HOST_PROD,
        user: process.env.DB_USER_PROD,
        password: process.env.DB_PASSWORD_PROD,
        database: process.env.DB_NAME_PROD,
        dialect: process.env.DB_DIALECT_PROD
      }
    }
  };
  
export default config;