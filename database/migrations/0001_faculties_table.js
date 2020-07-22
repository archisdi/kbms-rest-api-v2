'use strict';

const { generateMigration } = require('../helper');
const { model, options } = require('../models/faculty');

module.exports = generateMigration(options.tableName, model);
