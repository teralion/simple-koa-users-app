const path = require('path');
const pug = require('pug');
const config = require('config');

exports.init = app => app.use(async function(ctx, next) {
  ctx.render = function(templatePath, locals) {
    return pug.renderFile(
      path.join(config.get('templatesRoot'), templatePath),
      locals
    );
  };

  await next();
});
