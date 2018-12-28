const path = require('path');

module.exports = {
  port: 3000,
  root: process.cwd(),
  templatesRoot: path.join(process.cwd(), 'templates'),
  mongodb: {
    uri: 'mongodb://localhost/users_app',
  }
}