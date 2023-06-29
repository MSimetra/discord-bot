'use strict';

require('dotenv').config();
const Knex = require('knex');

const knex = Knex({
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
});

async function saveDataToDB(data) {
  await knex('table_name').insert(data);
}


module.exports = { saveDataToDB };