'use strict';

const { generateMigration } = require('../helper');
const { model, options } = require('../models/configuration');

module.exports = generateMigration(options.tableName, model);
