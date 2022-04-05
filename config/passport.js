const passport = require('passport')
const bearer = require('./strategies/bearer')

passport.use(bearer)

module.exports = passport