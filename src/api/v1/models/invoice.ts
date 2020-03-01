import { Model, DataTypes } from "sequelize";
import database from "../../../config/database";
import User from '../models/user';
import Product from '../models/product';

export default class Invoice extends Model {
    public id: number;
    public user_id: number;
    public product_id: number;
}

Invoice.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      tableName: "invoices",
      sequelize: database
    }
);

Invoice.belongsTo(User, { targetKey: 'id', foreignKey: 'user_id', as: 'user' });
Invoice.belongsTo(Product, { targetKey: 'id', foreignKey: 'product_id', as: 'product' });
  

