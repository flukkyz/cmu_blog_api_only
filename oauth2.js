const express = require('express')
const axios = require('axios')
const dayjs = require('dayjs')
const db = require('./models')
const User = db.User

const passport = require('./config/passport')

const router = express.Router()

router.get('/authorize', (req, res) => {
  const data = new URLSearchParams()
  data.append('response_type', 'code')
  data.append('client_id', process.env.OAUTH_CLIENT_ID)
  data.append('redirect_uri', `${process.env.BASE_URL}${process.env.OAUTH_RETURN_URI}`)
  data.append('scope', process.env.OAUTH_SCOPE)
  data.append('state', process.env.OAUTH_STATE)
  res.redirect(`${process.env.OAUTH_URL}${process.env.OAUTH_AUTHORIZE}?${data.toString()}`)
})

router.get('/callback', async (req, res) => {
  const code = req.query.code
  const state = req.query.state
  if (code && state) {
    if (state === process.env.OAUTH_STATE) {
      const method = 'post'
      const url = `${process.env.OAUTH_URL}${process.env.OAUTH_TOKEN}`

      const data = new URLSearchParams()
      data.append('code', code)
      data.append('redirect_uri', `${process.env.BASE_URL}${process.env.OAUTH_RETURN_URI}`)
      data.append('client_id', process.env.OAUTH_CLIENT_ID)
      data.append('client_secret', process.env.OAUTH_CLIENT_SECRET)
      data.append('grant_type', 'authorization_code')

      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      }

      try {
        const resData = await axios({
          method,
          url,
          data,
          headers
        })
        try {
          const getUser = await axios({
            method: 'get',
            url: process.env.USER_INFO_URL,
            data: {},
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${resData.data.access_token}`
            }
          })
          const user = await User.findOne({
            where: {
              account_name: getUser.data.cmuitaccount_name
            }
          })
          if (user) {
            const loginLog = {
              current_login: dayjs().format('YYYY-MM-DD HH:mm:ss'),
              last_login: user.current_login,
              current_ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
              last_ip: user.current_ip,
            }
            User.update(loginLog, {
              where: {
                id: user.id
              }
            })
          } else {
            const newData = {
              account_name: getUser.data.cmuitaccount_name,
              current_login: dayjs().format('YYYY-MM-DD HH:mm:ss'),
              current_ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            }
            User.create(newData)
          }
          return res.json(resData.data)
        } catch (e) {
          return res.status(401).json({
            message: 'Unauthorized'
          })
        }
      } catch (e) {
        return res.status(401).json({
          message: 'Unauthorized'
        })
      }
    }
  }
  return res.status(400).json({
    message: 'Bad request'
  })
})

router.post('/token', async (req, res) => {
  const refreshToken = req.body.refresh_token
  if (refreshToken) {
    const method = 'post'
    const url = `${process.env.OAUTH_URL}${process.env.OAUTH_TOKEN}`

    const data = new URLSearchParams()
    data.append('refresh_token', refreshToken)
    data.append('client_id', process.env.OAUTH_CLIENT_ID)
    data.append('client_secret', process.env.OAUTH_CLIENT_SECRET)
    data.append('grant_type', 'refresh_token')

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }

    try {
      const resData = await axios({
        method,
        url,
        data,
        headers
      })
      try {
        const getUser = await axios({
          method: 'get',
          url: process.env.USER_INFO_URL,
          data: {},
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resData.data.access_token}`
          }
        })
        const user = await User.findOne({
          where: {
            account_name: getUser.data.cmuitaccount_name
          }
        })
        if (user) {
          const loginLog = {
            current_login: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            last_login: user.current_login,
            current_ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            last_ip: user.current_ip,
          }
          User.update(loginLog, {
            where: {
              id: user.id
            }
          })
        }
        return res.json(resData.data)
      } catch (e) {
        return res.status(401).json({
          message: 'Unauthorized'
        })
      }
    } catch (e) {
      return res.status(401).json({
        message: 'Unauthorized'
      })
    }
  }
  return res.status(400).json({
    message: 'Bad request'
  })
})

router.get('/me', passport.authenticate('bearer', {
  session: false
}), (req, res) => {
  return res.status(200).json(req.user)
})

module.exports = router