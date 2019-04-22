const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const db = require('./../dB/sequlizePG');

const key = require('./../config/keys').secretOrKey;

const User = require('./../dB/models/UsersModel');
User.sync();

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('Bearer');

opts.secretOrKey = key;

// change to sequelize
module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      const user_id = jwt_payload.user_id;
      const user_name = jwt_payload.user_name;
      const email = jwt_payload.email;
      User.findOne({ where: { user_id } })
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
};
