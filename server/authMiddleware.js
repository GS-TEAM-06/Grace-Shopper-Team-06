const jwt = require('jsonwebtoken');
const User = require('./db/models/user');

const isAuthenticated = async (req, res, next) => {
  // console.log(req.headers);
  const token = req.headers['token'];

  // console.log('req.headers:', authHeader);
  if (token == null) {
    return res.sendStatus(401);
  }
  try {
    let user = await User.findByToken(token);
    if (!user) {
      throw new Error('Unauthorized!');
    }
    user = user.get({ plain: true });
    delete user.password;
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

const isSameUser = (req, res, next) => {
  if (!req.user.admin && req.user.id != req.params.userId) {
    const error = new Error('Unauthorized!');
    error.status = 401;
    next(error);
  } else {
    next();
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.admin) {
    next();
  } else {
    const error = new Error('Unauthorized!');
    error.status = 401;
    next(error);
  }
};

module.exports = { isAuthenticated, isSameUser, isAdmin };
