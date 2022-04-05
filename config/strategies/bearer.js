const BearerStrategy = require('passport-http-bearer').Strategy
const User = require('../../models').User
const axios = require('axios')

module.exports = new BearerStrategy(async (token, done) => {
    const method = 'get'
    const url = process.env.USER_INFO_URL
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }

    try {
      const getUser = await axios({
        method,
        url,
        data: {},
        headers
      })
      
      const user = await User.findOne({
        where: {
          account_name: getUser.data.cmuitaccount_name
        }
      })
      if (user === null) {
        return done(null, false)
      }
      const newUserData = {
        ...getUser.data,
        ...{
          id: user.id,
          role: user.role
        }
      }
      return done(null, newUserData)
    } catch (e) {
      return done(null, false)
    }
  }
)
