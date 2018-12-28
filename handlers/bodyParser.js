const bodyParser = require('koa-bodyparser');

exports.init = app => app.use(bodyParser({
  jsonLimit: '100kb',
}));
