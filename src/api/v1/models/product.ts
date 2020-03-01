import { Model, DataTypes } from "sequelize";
import database from "../../../config/database";

export default class Product extends Model {
    public id: number;
    public name: string;
    public category: string;
    public price: number;
    public description: number;
}

Product.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: new DataTypes.STRING(128),
        allowNull: false
      },
      category: {
        type: new DataTypes.STRING(128),
        allowNull: false
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      description: {
        type: new DataTypes.TEXT,
        allowNull: false
      }
    },
    {
      tableName: "products",
      sequelize: database
    }
  );
  

