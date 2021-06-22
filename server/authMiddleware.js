const jwt = require('jsonwebtoken');
const User = require('./db/models/user');

const isAuthenticated = async (req, res, next) => {
  // console.log(req.headers);
  const token = req.headers['token'];

  if (token == null) {
    return res.sendStatus(401);
  }
  try {
    let user = await User.findByToken(token);
    if (!user) {
      return res.sendStatus(401);
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
    return res.sendStatus(401);
  } else {
    next();
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.admin) {
    next();
  } else {
    return res.sendStatus(401);
  }
};

module.exports = { isAuthenticated, isSameUser, isAdmin };
