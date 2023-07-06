'use strict';

require('dotenv').config();
const Knex = require('knex');

const knex = Knex({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
});

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