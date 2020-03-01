import { Model, DataTypes } from "sequelize";
import database from "../../../config/database";

export default class User extends Model {
    public id: number;
    public name: string;
    public email: string;
    public gender: string;
    public age: number;
}

User.init(
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
      email: {
        type: new DataTypes.STRING(128),
        allowNull: false
      },
      gender: {
        type: new DataTypes.STRING(128),
        allowNull: false
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      tableName: "users",
      sequelize: database
    }
  );
  

