const path = require('path');
const FormData = require('form-data');
const pug = require('pug');
const config = require('config');
const mongoose = require('../lib/mongoose');
const User = require('../models/User');
const assert = require('assert');
const request = require('request-promise').defaults({
  simple: false,
  json: true,
  resolveWithFullResponse: true
});
const app = require('../app.js');

function getUrl(path) {
  return `http://localhost:3000${path}`;
}

describe('Simple Koa users app', async () => {
  let existingUserData = {
    displayName: 'Donald',
    email: 'trump@usa.com',
  };
  let editedExistingUserData = {
    displayName: 'Donald',
    email: 'duck@usa.com',
  };
  let newUserData = {
    displayName: 'Macron',
    email: 'emmanuel@france.fr',
  };
  let invalidEmailUserData = {
    displayName: 'Vladimir',
    email: 'Putin',
  };
  const extinctId = '5c2651b3d440040ca8d2c331';
  const invalidId = 'aaaaaaaaaaaaaaaaaaaa'

  let server;
  let exisitingUser;

  before(done => {
    server = app.listen(config.get('port'), done);
  });

  after(done => {
    server.close();
    mongoose.disconnect(done);
  });

  beforeEach(async () => {
    await User.remove({});
    exisitingUser = await User.create(existingUserData);
  });

  describe('POST /users', async () => {
    it('create user from json object', async function() {
      const response = await request({
        uri: getUrl('/users'),
        method: 'POST',
        body: newUserData,
      });

      const user = await User.findById(response.body._id);

      assert.strictEqual(response.body.displayName, user.displayName);
      assert.strictEqual(response.body.email, user.email);
      assert.strictEqual(response.body.email, newUserData.email);
    });

    it('create user from FormData', async () => {
      const response = await request({
        uri: getUrl('/users'),
        method: 'POST',
        formData: newUserData
      });

      const user = await User.findById(response.body._id);

      assert.strictEqual(response.body.displayName, user.displayName);
      assert.strictEqual(response.body.email, user.email);
      assert.strictEqual(response.body.email, newUserData.email);
    });

    it('throws error if email exists', async () => {
      const response = await request({
        url: getUrl('/users'),
        method: 'POST',
        body: existingUserData
      });

      assert.strictEqual(response.statusCode, 400);
      assert.strictEqual(response.body.errors.email, 'Такой email уже существует')
    });

    it('throws error if email ivalid', async () => {
      const response = await request({
        url: getUrl('/users'),
        method: 'POST',
        body: invalidEmailUserData
      });

      assert.strictEqual(response.statusCode, 400);
      assert.strictEqual(response.body.errors.email, 'Укажите, пожалуйста, корректный email');
    });
  });

  describe('GET /users', async () => {
    it('get /users page with all users list', async () => {
      const response = await request({
        method: 'GET',
        url: getUrl('/users')
      });

      const users = await User.find({});
      const page = await pug.renderFile(
        path.join(config.get('templatesRoot'), 'users.pug'),
        {usersList: users.map(user => user.toObject())}
      );

      assert.strictEqual(response.body, page);
      assert.strictEqual(response.statusCode, 200);
      assert.ok(/text\/html/.test(response.headers['content-type']));
    });

    it('get user by id', async () => {
      const response = await request.get(
        getUrl(`/users/${exisitingUser._id}`)
      );
      const user = await User.findById(exisitingUser._id);
      const page = await pug.renderFile(
        path.join(config.get('templatesRoot'), 'user.pug'),
        {user: user.toObject()}
      );

      assert.strictEqual(response.body, page);
      assert.strictEqual(response.statusCode, 200);
      assert.ok(/text\/html/.test(response.headers['content-type']));
    });

    it('throws error if no user left with this id', async () => {
      const response = await request.get(
        getUrl(`/users/${extinctId}`)
      );

      assert.strictEqual(response.statusCode, 404);
      assert.strictEqual(response.body, 'There is no user with this id');
    });

    it('throws error if id is not valid', async () => {
      const response = await request.get(
        getUrl(`/users/${invalidId}`)
      );

      assert.strictEqual(response.statusCode, 400);
      assert.strictEqual(response.body, 'id is not valid');
    });
  });

  describe('DELETE user', async () => {
    it('remove existing user from db', async () => {
      const response = await request.del({
        url: getUrl('/users'),
        body: {id: exisitingUser._id}
      });
      const user = await User.findById(exisitingUser._id);

      assert.strictEqual(response.statusCode, 200);
      assert.ok(!user);
    });

    it('throw 404 if user does not exist', async () => {
      const response = await request.del({
        uri: getUrl('/users'),
        body: {id: extinctId}
      });

      assert.strictEqual(response.statusCode, 404);
      assert.strictEqual(response.body, 'There is no user with this id');
    });
  });

  describe('PATCH user', async () => {
    it('change user data', async () => {
      const user = await User.findById(exisitingUser._id);
      assert.deepEqual(user.toObject(), exisitingUser.toObject());

      const response = await request.patch({
        url: getUrl(`/users/${exisitingUser._id}`),
        body: editedExistingUserData
      });
      const editedUser = await User.findById(exisitingUser._id);

      assert.strictEqual(response.statusCode, 200);
      assert.strictEqual(response.body.email, editedUser.email);
      assert.strictEqual(response.body.displayName, editedUser.displayName);
    });
  });
});
