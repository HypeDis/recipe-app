const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const db = require('./../dB/postgresPool');
const key = require('./../config/keys').secretOrKey;

const queries = require('./../dB/postgresQueries');

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('Bearer');

opts.secretOrKey = key;

// change to sequelize
module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      const user_id = parseInt(jwt_payload.user_id);
      db.query(queries.selectUserById, [user_id], (err, result) => {
        if (err) {
          res.json({ err });
        }
        if (result.rows.length > 0) {
          return done(null, result.rows[0]);
        }
        return done(null, false);
      });
      //   return done(null, jwt_payload);
    })
  );
};
