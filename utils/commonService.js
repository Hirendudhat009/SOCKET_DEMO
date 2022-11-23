/**
 * dbService.js
 * @description: exports all database related methods
 */
const { Op } = require('sequelize');

const OPERATORS = ['and', 'or', 'like', 'in', 'eq', 'gt', 'lt', 'gte', 'lte', 'any', 'between'];



class commonService {


  /*
   * @description : create any record in database
   * @param  {obj} model : sequelize model
   * @param  {obj} data : {}
   * @return {obj} result : database result
   */
  static async createOne(model, data) {
    const result = await model.create(data);
    return result;
  };

  /*
   * @description : create many records in database
   * @param  {obj} model : sequelize model
   * @param  {obj} data : {}
   * @param {obj} options : {}
   * @return {obj} result : database result
   */
  static async createMany(model, data, options = { validate: true }) {
    if (data && data.length > 0) {
      const result = await model.bulkCreate(data, options);
      return result;
    }
    throw new Error('send array as input in create many method');
  };

  /*
   * @description : update record in database by id
   * @param  {obj} model : sequelize model
   * @param  {*} pk : primary field of table
   * @param {obj} data : {}
   * @param {obj} options : {}
   * @return {obj} result : database result
   */
  static async updateByPk(model, pk, data, options = {}) {
    let result = await model.update(data, {
      returning: true,
      where: { [model.primaryKeyField]: pk },
      ...options,
    });
    if (result) {
      result = await model.findOne({
        where: { [model.primaryKeyField]: pk },
        ...options,
      });
    }
    return result;
  };

  /*
   * @description : update records in database by query
   * @param  {obj} model : sequelize model
   * @param  {*} pk : primary field of table
   * @param {obj} data : {}
   * @param {obj} options : {}
   * @return {obj} result : database result
   */
  static async updateByQuery(model, query, data) {
    const result = await model.update(data, {
      returning: true,
      where: query,
    });
    return result;
  };

  /*
   * @description : update many records in database by query
   * @param  {obj} model : sequelize model
   * @param  {*} pk : primary field of table
   * @param {obj} data : {}
   * @param {obj} options : {}
   * @return {obj} result : database result
   */
  static async updateMany(model, query, data, options = { validate: true }) {
    const result = await model.update(data, {
      returning: true,
      where: query,
    });
    return result;
  };

  /*
   * @description : delete any record in database by primary key
   * @param  {obj} model : sequelize model
   * @param  {*} pk : primary field of table
   * @return {obj} result : database result
   */
  static async deleteByPk(model, pk) {
    const result = await model.destroy({ where: { [model.primaryKeyField]: pk } });
    return result;
  };

  /*
 * @description : delete any record in database by primary key
 * @param  {obj} model : sequelize model
 * @param  {*} pk : primary field of table
 * @return {obj} result : database result
 */
  static async deleteOne(model, query) {
    const result = await model.destroy({ where: query });
    return result;
  };
  /*
   * @description : delete many record in database by query
   * @param  {obj} model : sequelize model
   * @param  {obj} query : {}
   * @return {obj} result : database result
   */
  static async deleteMany(model, query) {
    const result = await model.destroy({ where: query });
    return result;
  };

  /*
   * @description : find single record from table by query
   * @param  {obj} model : sequelize model
   * @param  {obj} query : {}
   * @param {obj} options : {}
   * @return {obj} result : database result
   */
  static async findOne(model, query, options = {}) {
    const result = await model.findOne({
      where: query,
      ...options,
    });
    return result;
  };

  /*
   * @description : find multiple records from table by query
   * @param  {obj} model : sequelize model
   * @param  {obj} query : {}
   * @param {obj} options : {}
   * @return {obj} result : database result
   */
  static async findMany(model, query, options = {}) {
    options = {
      where: { ...query },
      ...options,
    };
    const result = await model.paginate(options);
    const data = {
      data: result.docs,
      meta: {
        total: result.total,
        perPage: options.paginate || 25,
        totalPage: result.pages,
        currentPage: options.page || 1,
      },
    };
    return data;
  };

  /*
   * @description : find all records from table
   * @param  {obj} model : sequelize model
   * @param  {obj} query : {}
   * @param {obj} options : {}
   * @return {obj} result : database result
   */
  static async findAllRecords(model, query, options = {}) {
    options = {
      where: { ...query },
      ...options,
    };
    const result = await model.findAll(options);
    return result;
  };

  /*
   * @description : deactivate record by primary key
   * @param  {obj} model : sequelize model
   * @param  {*} pk : primary key field
   * @param {obj} options : {}
   * @return {obj} result : database result
   */
  static async softDeleteByPk(model, pk, options = {}) {
    const result = await model.update(
      { isDeleted: true },
      {
        fields: ['isDeleted'],
        where: { [model.primaryKeyField]: pk },
        ...options,
      },
    );
    return result;
  };

  /*
   * @description : deactivate records by query
   * @param  {obj} model : sequelize model
   * @param  {obj} query : {}
   * @param  {obj} data : {}
   * @param {obj} options : {}
   * @return {obj} result : database result
   */
  static async softDeleteMany(model, query, data, options = {}) {
    const result = await model.update(
      data,
      {
        where: query,
        ...options,
      },
    );
    return result;
  };

  /*
   * @description : count total records from table by query
   * @param  {obj} model : sequelize model
   * @param  {obj} query : {}
   * @param {obj} options : {}
   * @return {obj} result : database result
   */
  static async count(model, query, options = {}) {
    const result = await model.count({
      where: query,
      ...options,
    });
    return result;
  };

  /*
   * @description : get record by primary key
   * @param  {obj} model : sequelize model
   * @param  {obj} param : {}
   * @param {obj} options : {}
   * @return {obj} result : database result
   */
  static async findByPk(model, param, options = {}) {
    const result = await model.findByPk(param, options);
    return result;
  };

  /*
   * @description : upsert record in database
   * @param  {obj} model : sequelize model
   * @param  {obj} param : {}
   * @param {obj} options : {}
   * @return {obj} result : database result
   */
  static async upsert(model, data, options = {}) {
    const result = await model.upsert(data, options);
    return result;
  };

  /*
   * @description : parser for query builder
   * @param  {obj} data : {}
   * @return {obj} data : query
   */
  static async queryBuilderParser(data) {
    if (data) {
      Object.entries(data).forEach(([key]) => {
        if (typeof data[key] === 'object') {
          queryBuilderParser(data[key]);
        }
        if (OPERATORS.includes(key)) {
          data[Op[key]] = data[key];
          delete data[key];
        } else if (key === 'neq') {
          data[Op.not] = data[key];
          delete data[key];
        } else if (key === 'nin') {
          data[Op.notIn] = data[key];
          delete data[key];
        }
      });
    }

    return data;
  };

  /*
   * @description : parser for query builder of sort
   * @param  {obj} input : {}
   * @return {obj} data : query
   */
  static async sortParser(input) {
    const newSortedObject = [];
    if (input) {
      Object.entries(input).forEach(([key, value]) => {
        if (value === 1) {
          newSortedObject.push([key, 'ASC']);
        } else if (value === -1) {
          newSortedObject.push([key, 'DESC']);
        }
      });
    }
    return newSortedObject;
  };

}
export default commonService