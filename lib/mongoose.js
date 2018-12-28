const mongoose = require('mongoose');
const beautifulUnique = require('mongoose-beautiful-unique-validation');
const config = require('config');

mongoose.set('debug', true);
mongoose.connect(config.get('mongodb.uri'));
mongoose.plugin(beautifulUnique);

module.exports = mongoose;
