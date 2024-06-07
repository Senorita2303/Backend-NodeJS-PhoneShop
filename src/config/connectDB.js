const { Sequelize } = require('sequelize');
import { env } from '~/config/environment';

const sequelize = new Sequelize(
    env.DB_DATABASE_NAME,
    env.DB_USERNAME,
    env.DB_PASSWORD,
    {
        host: env.DB_HOST,
        port: env.DB_PORT,
        dialect: env.DB_DIALECT,
        logging: false,
        dialectOptions:
            env.DB_SSL === 'true' ? {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            } : {}
        ,
        query: {
            "raw": true
        },
        timezone: "+07:00"
    });

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
module.exports = connectDB;