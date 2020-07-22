'use strict';

const { generateMigration } = require('../helper');
const { model, options } = require('../models/major');

module.exports = generateMigration(options.tableName, model);
