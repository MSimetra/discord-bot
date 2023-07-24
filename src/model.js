'use strict';

const knex = require('../config.js')

const saveDataToDB = async (data) => {
  const dbData = await getDataFromDB();

  if (dbData.length === 0) {
    await knex('nbu').insert(data);
  } else {
    for (let i = 0; i < data.length; i++) {
      await knex('nbu').update(data[i]).where('name', '=', data[i].name);
    }
  }
}

const getDataFromDB = async () => {
  return await knex('nbu');
}

module.exports = { saveDataToDB, getDataFromDB };