
exports.init = app => app.use(async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    if (e.status) {
      ctx.body = e.message;
      ctx.status = e.status
    } else if (e.name === 'ValidationError') {
      ctx.status = 400;
      let errors = {};

      for (let field in e.errors) {
        errors[field] = e.errors[field].message;
      }

      ctx.body = {
        errors: errors
      };
    } else {
      ctx.body = 'Internal error',
      ctx.status = 500;
      console.error(e.message);
    }
  }
});
