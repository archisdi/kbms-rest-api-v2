'use strict';

const { generateMigration } = require('../helper');
const { model, options } = require('../models/member');

module.exports = generateMigration(options.tableName, model);
