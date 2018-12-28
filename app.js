const Koa = require('koa');
const Router = require('koa-router');
const pick = require('lodash/pick');
const mongoose = require('mongoose');

const app = new Koa();
const usersRouter = new Router({
  prefix: '/users'
});

require('./handlers/favicon').init(app);
require('./handlers/logger').init(app);
require('./handlers/templates').init(app);
require('./handlers/static').init(app);
require('./handlers/busBoy').init(app);
require('./handlers/bodyParser').init(app);
require('./handlers/errors').init(app);
require('./handlers/session').init(app);

const User = require('./models/User');

async function loadById(ctx, next) {
  const {id} = ctx.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    ctx.throw(400, 'id is not valid');
  }

  ctx.userById = await User.findById(id);

  if (!ctx.userById) {
    ctx.throw(404, 'There is no user with this id');
  }

  await next();
}

usersRouter
  .get('/', async ctx => {
    const rawUsers = await User.find({});

    ctx.body = await ctx.render('users.pug', {
      usersList: rawUsers.map(
        user => user.toObject()
      )
    });
  })
  .get('/:id', loadById, async ctx => {
    ctx.body = await ctx.render('user.pug' , {
      user: ctx.userById.toObject()
    });
  })
  .post('/', async ctx => {
    const user = await User.create(
      pick(ctx.request.body, User.publicFields)
    );

    ctx.body = await user.toObject();
  })
  .del('/', async ctx => {
    const {id} = ctx.request.body;

    const user = await User.findById(id);
    if (!user) {
      ctx.throw(404, 'There is no user with this id');
    }

    ctx.body = await User.remove({'_id': id});
  })
  .patch('/:id', loadById, async ctx => {
    Object.assign(ctx.userById, pick(ctx.request.body, User.publicFields));
    await ctx.userById.save();

    ctx.body = ctx.userById.toObject();
  });

app.use(usersRouter.routes());

module.exports = app;
