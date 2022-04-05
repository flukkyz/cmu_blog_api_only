require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const { notFound, handleError } = require('./middlewares')
const routes = require('./routes')
const oAuth2 = require('./oauth2')

const port = process.env.PORT || 5000

const app = express()

app.use(express.json({limit: '50mb'}))
app.use(cors())
app.use(morgan('dev'))
app.use(express.urlencoded({
  limit: '50mb',
  extended: false
}))

app.use('/oauth2',oAuth2)
app.use('/api',routes)

app.use(express.static('static'))

app.use(notFound)
app.use(handleError)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
