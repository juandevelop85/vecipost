'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
/**
 * @description Clase para la conexion con la BD, sigue el patron singleton para crear instancia unica
 * @author Juan Sebastian Vernaza
 * @date 2020-05-20
 * @class Postgres
 */
class Postgres {
  constructor() {
    this.isConnected = false;
    this.user = process.env.DB_USER_PG || '';
    this.password = process.env.DB_PASSWORD_PG || '';
    this.database = process.env.DATABASE || 'postgres';
    this.host = process.env.DB_HOST || 'localhost';
    this.port = Number(process.env.DB_PORT) || 0;
    this.db = {};
    this.MODELS_ROUTE = path.join(__dirname, '../models/');
    this.ca = fs.readFileSync(path.join(__dirname, '/ca-certificate.crt'));
    this.sequelize = new Sequelize.Sequelize(this.database, this.user, this.password, {
      host: this.host,
      port: this.port,
      dialect: 'postgres',
      logging: false, //console.log,
      dialectOptions: {
        options: {
          requestTimeout: 10000,
          //instanceName: null,
          //useUTC: false
          //encrypt: config.options.encrypt || false,
          ssl: {
            rejectUnauthorized: true,
            ca: [this.ca],
          },
        },
      },
      define: {},
      timezone: '-05:00',
      pool: {
        max: 87,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      define: {
        timestamps: true,
        underscored: true,
        freezeTableName: true,
        charset: 'utf8',
        dialectOptions: {
          collate: 'utf8_general_ci',
        },
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        createdBy: 'created_by',
      },
    });
    this.createModels();
  }

  static get instance() {
    //this._instance = new this()
    //return new this();
    return this._instance || (this._instance = new this());
  }

  createModels() {
    fs.readdirSync(this.MODELS_ROUTE)
      .filter((file) => {
        return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
      })
      .forEach((file) => {
        const model = require(path.join(this.MODELS_ROUTE, file))(this.sequelize, Sequelize.DataTypes);
        this.db[model.name] = model;
      });

    Object.keys(this.db).forEach((modelName) => {
      if (this.db[modelName].associate) {
        this.db[modelName].associate(this.db);
      }
    });

    this.db.sequelize = this.sequelize;
    this.db.Sequelize = Sequelize.Sequelize;
    this.db.executeQuery = this.executeQuery.bind(this);
    this.isConnected = true;
  }

  executeQuery(sql, values, type = 'INSERT') {
    return new Promise(async (resolve, reject) => {
      let typeQuery = type == 'RAW' ? this.db.sequelize.QueryTypes.RAW : this.db.sequelize.QueryTypes.INSERT;
      await this.sequelize
        .query(sql, { replacements: values, type: typeQuery })
        .then((model) => {
          resolve(model[0]);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
exports.default = Postgres;
