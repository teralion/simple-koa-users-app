// Parses multipart/form-data body
const busboy = require('koa-busboy');

exports.init = app => app.use(busboy());
